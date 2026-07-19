import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";
import { rateLimit } from "express-rate-limit";
import Stripe from 'stripe';
import sgMail from '@sendgrid/mail';
import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import firebaseConfig from './firebase-applet-config.json' with { type: 'json' };
import { GoogleGenAI } from "@google/genai";
import bodyParser from "body-parser";

import { DevOpsService } from "./src/services/devopsService.ts";

dotenv.config();

// --- FIREBASE ADMIN SETUP ---
const appInstance = admin.initializeApp({
  projectId: firebaseConfig.projectId,
});
const db = getFirestore(appInstance, firebaseConfig.firestoreDatabaseId);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Mock Database for quick caching and backup of trial status (Replace/sync with Firebase in production)
  const usersDb: Record<string, {
    stripeCustomerId: string;
    status: 'active' | 'trialing' | 'expired';
    trialEndDate: Date;
  }> = {};

  // Initialize Google AI Studio (Gemini) with proper User-Agent
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });

  // Middleware to enforce 7-Day Trial Restrictions & Check Access
  const checkSubscriptionStatus = async (req: any, res: any, next: any) => {
    const email = req.body?.email || req.query?.email || req.headers['x-user-email'];

    if (!email) {
      return res.status(403).json({ error: "Access Denied. Please Sign Up for a Free Trial." });
    }

    let user = usersDb[email];

    // Attempt to synchronize/load from Firestore if not present in cache
    if (!user) {
      try {
        const snapshot = await db.collection('users').where('email', '==', email).get();
        if (!snapshot.empty) {
          const doc = snapshot.docs[0].data();
          user = {
            stripeCustomerId: doc.stripeCustomerId || '',
            status: doc.status === 'EXPIRED' ? 'expired' : (doc.status === 'SUBSCRIBED' ? 'active' : 'trialing'),
            trialEndDate: doc.trialEndDate ? new Date(doc.trialEndDate.toDate ? doc.trialEndDate.toDate() : doc.trialEndDate) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
          };
          usersDb[email] = user;
        }
      } catch (err) {
        console.error("checkSubscriptionStatus Firestore Load Error:", err);
      }
    }

    if (!user) {
      return res.status(403).json({ error: "Access Denied. Please Sign Up for a Free Trial." });
    }

    const now = new Date();
    if (user.status === 'trialing' && now > new Date(user.trialEndDate)) {
      user.status = 'expired'; // Automatically transition status
      try {
        const snapshot = await db.collection('users').where('email', '==', email).get();
        if (!snapshot.empty) {
          await snapshot.docs[0].ref.update({ status: 'EXPIRED' });
        }
      } catch (err) {
        console.error("checkSubscriptionStatus Firestore status transition failed:", err);
      }
    }

    if (user.status === 'expired') {
      return res.status(402).json({ 
        error: "Your 7-Day trial has expired.", 
        redirectTo: "/subscription-hub" 
      });
    }
    
    next();
  };

  // Unified Webhook handler to process Stripe Webhook events seamlessly
  const handleStripeWebhook = async (req: any, res: any) => {
    const s = getStripe();
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!s || !endpointSecret) {
      console.warn("Stripe Webhook: Stripe not configured or secret missing.");
      return res.sendStatus(400);
    }

    const sig = req.headers['stripe-signature'];
    let event;

    try {
      if (!sig) throw new Error('Missing Stripe signature');
      event = s.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err: any) {
      console.error(`Webhook Error: ${err.message}`);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    const session = event.data.object as any;
    
    switch (event.type) {
      case 'checkout.session.completed': {
        const email = session.customer_details?.email;
        if (email) {
          usersDb[email] = {
            stripeCustomerId: session.customer,
            status: session.payment_status === 'paid' || session.subscription ? 'active' : 'trialing',
            trialEndDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
          };

          try {
            const usersRef = db.collection('users');
            const snapshot = await usersRef.where('email', '==', email).get();
            if (!snapshot.empty) {
              const batch = db.batch();
              snapshot.forEach(doc => {
                batch.update(doc.ref, {
                  stripeCustomerId: session.customer,
                  stripeSubscriptionId: session.subscription || '',
                  status: usersDb[email].status === 'active' ? 'SUBSCRIBED' : 'TRIALING',
                  trialEndDate: usersDb[email].trialEndDate,
                  updatedAt: admin.firestore.FieldValue.serverTimestamp()
                });
              });
              await batch.commit();
            } else {
              await usersRef.add({
                email,
                stripeCustomerId: session.customer,
                stripeSubscriptionId: session.subscription || '',
                status: usersDb[email].status === 'active' ? 'SUBSCRIBED' : 'TRIALING',
                trialEndDate: usersDb[email].trialEndDate,
                plan: 'monthly',
                createdAt: admin.firestore.FieldValue.serverTimestamp()
              });
            }
          } catch (dbErr) {
            console.error('Firestore Webhook update error:', dbErr);
          }
        }
        break;
      }
        
      case 'customer.subscription.deleted': {
        const customerId = session.customer;
        const userKey = Object.keys(usersDb).find(k => usersDb[k].stripeCustomerId === customerId);
        if (userKey) {
          usersDb[userKey].status = 'expired';
          try {
            const usersRef = db.collection('users');
            const snapshot = await usersRef.where('stripeCustomerId', '==', customerId).get();
            if (!snapshot.empty) {
              const batch = db.batch();
              snapshot.forEach(doc => {
                batch.update(doc.ref, {
                  status: 'EXPIRED',
                  updatedAt: admin.firestore.FieldValue.serverTimestamp()
                });
              });
              await batch.commit();
            }
          } catch (dbErr) {
            console.error('Firestore Webhook deleted update error:', dbErr);
          }
        }
        break;
      }

      case 'invoice.payment_succeeded': {
        const customerEmail = session.customer_email;
        const subscriptionId = session.subscription;
        const priceId = session.lines?.data?.[0]?.price?.id;

        if (customerEmail) {
          try {
            const usersRef = db.collection('users');
            const snapshot = await usersRef.where('email', '==', customerEmail).get();
            
            if (!snapshot.empty) {
              let plan: 'monthly' | 'annual' = 'monthly';
              if (priceId === 'price_1TSOKGBMbxh6jv0CMhUwlHYX') {
                plan = 'annual';
              }

              const batch = db.batch();
              snapshot.forEach(doc => {
                batch.update(doc.ref, {
                  plan: plan,
                  stripeSubscriptionId: subscriptionId,
                  status: 'SUBSCRIBED',
                  updatedAt: admin.firestore.FieldValue.serverTimestamp()
                });
              });
              await batch.commit();
            }
          } catch (dbErr) {
            console.error('Firestore Invoice payment_succeeded update error:', dbErr);
          }
        }
        break;
      }
    }
    res.json({ received: true });
  };

  // Webhooks need raw body - MUST be defined before express.json()
  app.post("/webhook", express.raw({ type: 'application/json' }), handleStripeWebhook);
  app.post("/api/webhooks/stripe", express.raw({ type: 'application/json' }), handleStripeWebhook);

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(cors());

  // --- DEVOPS PILLAR: MAINTENANCE ---
  app.get("/api/devops/status", DevOpsService.getHealthStatus);
  app.post("/api/system/purge", DevOpsService.purgeSystemCache);

  // --- STRIPE INTEGRATION ---
  let stripe: Stripe | null = null;
  const getStripe = () => {
    if (!stripe && process.env.STRIPE_SECRET_KEY) {
      stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { 
        apiVersion: '2024-12-18.acacia' as any
      });
    }
    return stripe;
  };

  // --- SENDGRID INTEGRATION ---
  if (process.env.SENDGRID_API_KEY) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  }

  // --- API ROUTES ---

  // Health Check
  app.get("/api/health", (req, res) => {
    res.json({ status: "alive", engine: "flux-core-v1" });
  });

  // --- STRIPE REGISTER-TRIAL AND CHECKOUT SESSION (EXPLICIT USER ENDPOINTS) ---
  app.post('/api/auth/register-trial', async (req: any, res: any) => {
    const { fullName, email, password } = req.body;
    
    if (!fullName || !email || !password) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    try {
      // Create user record in Firebase Auth
      const userRecord = await admin.auth().createUser({
        email: email,
        password: password,
        displayName: fullName,
      });

      // Create a customer profile inside Stripe for them
      let stripeCustomerId = '';
      const s = getStripe();
      if (s) {
        try {
          const customer = await s.customers.create({
            email: email,
            name: fullName,
            metadata: { plan: 'Free Trial Node' }
          });
          stripeCustomerId = customer.id;
        } catch (stripeErr: any) {
          console.warn("Stripe customer creation failed during trial signup:", stripeErr.message);
        }
      }

      // Save user profile inside Firestore (syncing with authService properties)
      const now = Date.now();
      const newUser = {
        id: userRecord.uid,
        email: email,
        name: fullName,
        role: 'USER',
        plan: 'free',
        status: 'TRIAL',
        stripeCustomerId: stripeCustomerId || `mock_cust_${Date.now()}`,
        trialStartDate: now,
        trialEndDate: now + (7 * 24 * 60 * 60 * 1000), // 7 days
        projectsCreated: 0,
        intent: 'MEDIUM',
        featureUsage: {
          aiGenerations: 0,
          analyticsViews: 0,
          exports: 0
        },
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      };

      await db.collection('users').doc(userRecord.uid).set(newUser);

      // Keep backend memory-cache in sync
      usersDb[email] = {
        stripeCustomerId: newUser.stripeCustomerId,
        status: 'trialing',
        trialEndDate: new Date(newUser.trialEndDate)
      };

      return res.status(201).json({ 
        success: true, 
        message: 'Free trial registered successfully.',
        customerId: newUser.stripeCustomerId,
        userId: userRecord.uid
      });
    } catch (error: any) {
      console.error("Free Trial Registration Error:", error);
      return res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/checkout/create-session', async (req: any, res: any) => {
    const { priceLookupKey, customerEmail } = req.body;

    // Map your lookups to actual Stripe Price IDs (price_xxxx) created in your Stripe Dashboard
    const priceMap: Record<string, string | undefined> = {
      'monthly': process.env.STRIPE_PRICE_MONTHLY || 'price_1TSOJLBMbxh6jv0C9aEJBKRt', // $19.99
      'yearly': process.env.STRIPE_PRICE_YEARLY || 'price_1TSOKGBMbxh6jv0CMhUwlHYX'     // $199.99
    };

    const selectedPriceId = priceMap[priceLookupKey];
    if (!selectedPriceId) {
      return res.status(400).json({ error: 'Invalid plan selected.' });
    }

    const s = getStripe();
    const clientUrl = process.env.CLIENT_URL || req.headers.origin || 'http://localhost:3000';

    if (!s) {
      // Fallback for non-configured environment (e.g. mock mode during development)
      const mockSessionId = `mock_session_${Date.now()}`;
      return res.json({ 
        url: `${clientUrl}/success?session_id=${mockSessionId}`,
        isMock: true 
      });
    }

    try {
      const session = await s.checkout.sessions.create({
        billing_address_collection: 'auto',
        line_items: [
          {
            price: selectedPriceId,
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: `${clientUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${clientUrl}/subscription-hub`,
        customer_email: customerEmail || undefined, 
      });

      res.json({ url: session.url });
    } catch (error: any) {
      console.error("Stripe Create Session Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // --- STRIPE SUBSCRIPTION CHANNELS & PORTALS ---

  const createCheckoutSessionHandler = async (req: any, res: any) => {
    try {
      const { priceId, email, isTrial } = req.body;
      const s = getStripe();

      if (!s) {
        return res.json({ 
          sessionId: `mock_session_${Date.now()}`,
          url: `${req.headers.origin || 'http://localhost:3000'}/success?session_id=mock_session_${Date.now()}`,
          isMock: true
        });
      }

      const sessionConfig: any = {
        customer_email: email,
        payment_method_types: ['card'],
        line_items: [{ price: priceId, quantity: 1 }],
        mode: 'subscription',
        subscription_data: {
          trial_period_days: isTrial === false ? undefined : 7,
          metadata: {
            app_name: "DIGITAL MARKETING INTELLIGENCE"
          }
        },
        success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.origin}/subscription-hub`,
      };

      const session = await s.checkout.sessions.create(sessionConfig);
      res.status(200).json({ sessionId: session.id, url: session.url });
    } catch (error: any) {
      console.error("Stripe Checkout Error:", error);
      res.status(500).json({ error: error.message });
    }
  };

  app.post("/create-checkout-session", createCheckoutSessionHandler);
  app.post("/api/create-checkout-session", createCheckoutSessionHandler);

  const createPortalSessionHandler = async (req: any, res: any) => {
    try {
      const { email } = req.body;
      const s = getStripe();

      if (!s) {
        return res.json({
          url: `${req.headers.origin || 'http://localhost:3000'}/subscription-hub`,
          isMock: true
        });
      }

      let user = usersDb[email];
      let stripeCustomerId = user?.stripeCustomerId;

      if (!stripeCustomerId) {
        try {
          const snapshot = await db.collection('users').where('email', '==', email).get();
          if (!snapshot.empty) {
            stripeCustomerId = snapshot.docs[0].data().stripeCustomerId;
          }
        } catch (err) {
          console.error("Firestore stripeCustomerId fetch error:", err);
        }
      }

      if (!stripeCustomerId) {
        return res.status(400).json({ error: "No active Stripe customer profile found." });
      }

      const portalSession = await s.billingPortal.sessions.create({
        customer: stripeCustomerId,
        return_url: `${req.headers.origin}/subscription-hub`,
      });

      res.json({ url: portalSession.url });
    } catch (error: any) {
      console.error("Stripe Portal Error:", error);
      res.status(500).json({ error: error.message });
    }
  };

  app.post("/create-portal-session", createPortalSessionHandler);
  app.post("/api/create-portal-session", createPortalSessionHandler);

  // Protected Google AI Studio Route Example
  app.post('/api/ai-feature', checkSubscriptionStatus, async (req, res) => {
    const { prompt } = req.body;
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
      });
      res.json({ result: response.text });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Alias for Checkout Sessions (per user request)
  app.post("/api/checkout_sessions", async (req, res) => {
    try {
      const { priceId, serviceId, price } = req.body;
      const s = getStripe();

      if (!s) {
        return res.json({ 
          id: `mock_session_${Date.now()}`,
          url: `${req.headers.origin || 'http://localhost:3000'}/success?session_id=mock_session_${Date.now()}`,
          isMock: true
        });
      }

      const session = await s.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{
          // If priceId is provided, use it (standard Stripe flow)
          ...(priceId ? { price: priceId } : {
            price_data: {
              currency: 'usd',
              product_data: { name: `Flux Subscription: ${serviceId || 'Pro Protocol'}` },
              unit_amount: price || 2499,
              recurring: { interval: 'month' },
            },
          }),
          quantity: 1,
        }],
        mode: 'subscription',
        subscription_data: {
          trial_period_days: 7,
        },
        success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.origin}/cancel`,
      });

      res.json({ id: session.id, url: session.url });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Stripe Checkout (legacy)
  app.post("/api/payments/create-checkout", async (req, res) => {
    try {
      const { serviceId, price } = req.body;
      const s = getStripe();

      if (!s) {
        // Silent fallback for non-production environments to avoid console noise unless specifically tracked
        if (process.env.NODE_ENV === "production") {
          console.error("CRITICAL: Stripe key missing in production.");
        }
        
        return res.json({ 
          url: `${req.headers.origin || 'http://localhost:3000'}/success?session_id=mock_session_${Date.now()}`,
          isMock: true
        });
      }

      const session = await s.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{
          price_data: {
            currency: 'usd',
            product_data: { name: `Flux Service: ${serviceId}` },
            unit_amount: price || 25000, // Default to $250.00
          },
          quantity: 1,
        }],
        mode: 'payment',
        success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.origin}/cancel`,
      });

      res.json({ id: session.id, url: session.url });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // SendGrid Email Dispatch
  app.post("/api/email/dispatch", async (req, res) => {
    try {
      const { to, subject, html } = req.body;

      if (!process.env.SENDGRID_API_KEY) {
        console.warn("Email service not configured (missing SENDGRID_API_KEY). Simulating dispatch.");
        return res.json({ 
          success: true, 
          isMock: true, 
          message: "PROTOTYPE: Email simulated successfully." 
        });
      }
      
      await sgMail.send({
        to,
        from: process.env.FROM_EMAIL || 'reports@fluxagency.com',
        subject,
        html,
      });

      res.json({ success: true });
    } catch (error: any) {
      console.error("SendGrid Error:", error.response?.body || error.message);
      res.status(500).json({ error: error.message });
    }
  });

  // --- SECURE ENCRYPTED EMAIL ---
  app.post("/api/email/send-encrypted", async (req, res) => {
    try {
      const { to, subject, encryptedData, publicKeyId } = req.body;

      console.log(`[SECURE CHANNEL] Dispatching encrypted payload to: ${to} using key: ${publicKeyId}`);

      if (!process.env.SENDGRID_API_KEY) {
        return res.json({ 
          success: true, 
          isMock: true, 
          message: "SECRET: Encrypted email dispatched via Flux Secure Proxy." 
        });
      }

      // In a real scenario, we might wrap the encrypted data in a standard mime/pgp format
      const formattedHtml = `
        <div style="font-family: monospace; border: 2px solid #FF6B00; padding: 20px; border-radius: 10px;">
          <h2 style="color: #FF6B00;">FLUX SECURE MESSAGE</h2>
          <p>This is an end-to-end encrypted message from Flux Agency Legal Architect.</p>
          <div style="background: #f4f4f4; padding: 15px; border: 1px solid #ddd; word-break: break-all;">
            <code>${encryptedData}</code>
          </div>
          <p style="font-size: 0.8em; color: #666;">Key ID: ${publicKeyId}</p>
        </div>
      `;

      await sgMail.send({
        to,
        from: process.env.FROM_EMAIL || 'security@fluxagency.com',
        subject: `[SECURE] ${subject}`,
        html: formattedHtml,
      });

      res.json({ success: true, channel: "flux-secure-v2" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // --- EMAIL DISPATCH GATEWAY ---
  app.post("/api/email/dispatch", (req, res) => {
    const task = req.body;
    
    // Handle A2A Task Format
    if (task.id && task.state === "submitted") {
      const subject = task.metadata?.subject || "No Subject";
      const content = task.message?.parts?.[0]?.content || "No Content";
      const urgency = task.metadata?.urgency || "standard";
      
      console.log(`[A2A_OUTREACH] Task Received: ${task.id}`);
      console.log(`[A2A_OUTREACH] Urgency: ${urgency}`);
      console.log(`[A2A_OUTREACH] Payload: ${content.substring(0, 50)}...`);

      return res.json({ 
        success: true, 
        task_id: task.id,
        state: "processed",
        message: "A2A Task accepted by Flux Outreach Node.",
        provider: "A2A-MAIL-GATEWAY-02"
      });
    }

    // Fallback for legacy calls
    const { to, subject, html } = req.body;
    console.log(`[OUTREACH_LEGACY] Dispatching to: ${to}`);
    
    return res.json({ 
      success: true, 
      message: "Legacy outreach handoff complete.",
      provider: "A2A-MAIL-GATEWAY-01"
    });
  });

  // --- A2A PROTOCOL RATE LIMITER ---
  const rpcRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // Limit each IP to 100 requests per window
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      jsonrpc: "2.0",
      error: { code: -32005, message: "Too many A2A RPC requests from this server IP address trace. Connection throttled." },
      id: null
    }
  });

  // --- A2A PROTOCOL: JSON-RPC 2.0 ---
  app.post("/api/rpc", rpcRateLimiter, (req, res) => {
    const { jsonrpc, method, params, id } = req.body;
    
    if (jsonrpc !== "2.0") {
      return res.status(400).json({
        jsonrpc: "2.0",
        error: { code: -32600, message: "Invalid Request: Must be JSON-RPC 2.0" },
        id: id || null
      });
    }

    console.log(`[A2A RPC] Method: ${method} | Params:`, params);

    // Mock response for protocol compliance
    switch (method) {
      case "agent.getCapabilities":
        return res.json({
          jsonrpc: "2.0",
          result: { version: "2.0-EXPANDED", services: ["shopify", "ads", "seo", "content", "design", "hosting", "social", "leadgen"] },
          id
        });
      
      case "task.submit":
        const taskId = `task-${Math.random().toString(36).substring(7)}`;
        return res.json({
          jsonrpc: "2.0",
          result: { taskId, status: "submitted", message: "Task accepted by Flux Orchestrator." },
          id
        });

      case "competitor.refresh_intelligence":
        return res.json({
          jsonrpc: "2.0",
          result: { 
            status: "success", 
            message: "Neural scan initialized. Competitor matrix updating via Google Search API.",
            timestamp: new Date().toISOString()
          },
          id
        });

      case "competitor.campaign_alert":
        return res.json({
          jsonrpc: "2.0",
          result: { 
            status: "active", 
            message: "Real-time monitoring protocol armed for competitor campaign shifts.",
            alert_id: `alert-${Math.random().toString(36).substring(7)}`
          },
          id
        });

      case "trends.generate_report":
        return res.json({
          jsonrpc: "2.0",
          result: {
            status: "success",
            message: "Trend analysis pipeline triggered. Grounding data via Google Search.",
            report_id: `trend-${Math.random().toString(36).substring(7)}`
          },
          id
        });

      case "trends.content_angles":
        return res.json({
          jsonrpc: "2.0",
          result: {
            status: "processing",
            message: "Synthesizing 10 content angles based on seasonal neural dynamics.",
            node: "FLUX-TREND-ENGINE-04"
          },
          id
        });

      case "seo.quick_wins":
        return res.json({
          jsonrpc: "2.0",
          result: {
            status: "success",
            message: "Portfolio analyzed. 5 high-intent, low-difficulty keywords identified.",
            data: { opportunities: ["A2A Automation Guide", "Neural Grounding Best Practices"] }
          },
          id
        });

      case "seo.serp_analysis":
        return res.json({
          jsonrpc: "2.0",
          result: {
            status: "monitoring",
            message: "SERP feature shift detected for 'growth orchestration'. Adjusting content strategy.",
            impact_score: 8.5
          },
          id
        });

      case "crisis.brand_health":
        return res.json({
          jsonrpc: "2.0",
          result: {
            status: "nominal",
            message: "Global sentiment scan complete. Brand health score: 92/100.",
            trending: "positive"
          },
          id
        });

      case "crisis.response_draft":
        return res.json({
          jsonrpc: "2.0",
          result: {
            status: "drafted",
            message: "Crisis containment protocol active. 3 response variations generated for review.",
            escalation: "Tier 1: PR Team notified"
          },
          id
        });

      case "intel.integrated_report":
        return res.json({
          jsonrpc: "2.0",
          result: {
            status: "processing",
            message: "Multi-agent orchestration initialized. Synchronizing Competitor, Trend, SEO, and Crisis nodes.",
            orchestrator: "FLUX-MASTER-INTEL-01"
          },
          id
        });

      case "engagement.ledger_sync":
        console.log(`[LEDGER] Syncing handoff: ${JSON.stringify(req.body.params)}`);
        return res.json({
          jsonrpc: "2.0",
          result: {
            status: "logged",
            ledger_id: `ledger-${crypto.randomUUID()}`,
            timestamp: new Date().toISOString(),
            integrity: "verified"
          },
          id
        });

      case "engagement.agent_mesh_sync":
        return res.json({
          jsonrpc: "2.0",
          result: {
            status: "synchronized",
            active_agents: ["achievements", "academy", "community", "legal", "system"],
            mesh_id: `mesh-${crypto.randomUUID()}`
          },
          id
        });

      default:
        return res.status(404).json({
          jsonrpc: "2.0",
          error: { code: -32601, message: "Method not found" },
          id
        });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Command Center Active: http://localhost:${PORT}`);
  });
}

startServer();
