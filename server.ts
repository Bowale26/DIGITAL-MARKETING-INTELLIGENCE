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

  // Webhook needs raw body - MUST be defined before express.json()
  app.post("/api/webhooks/stripe", express.raw({ type: 'application/json' }), async (req, res) => {
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

    if (event.type === 'invoice.payment_succeeded') {
      const invoice = event.data.object as any;
      const customerEmail = invoice.customer_email;
      const subscriptionId = invoice.subscription;
      const priceId = invoice.lines.data[0].price.id;

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
          console.error('Firestore Update Error:', dbErr);
        }
      }
    }
    res.json({ received: true });
  });

  app.use(express.json());
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

  // Stripe Checkout Sessions (Modern Integration)
  app.post("/api/create-checkout-session", async (req, res) => {
    try {
      const { priceId, email } = req.body;
      const s = getStripe();

      if (!s) {
        return res.json({ 
          sessionId: `mock_session_${Date.now()}`,
          url: `${req.headers.origin || 'http://localhost:3000'}/success?session_id=mock_session_${Date.now()}`,
          isMock: true
        });
      }

      const session = await s.checkout.sessions.create({
        customer_email: email,
        payment_method_types: ['card'],
        line_items: [{ price: priceId, quantity: 1 }],
        mode: 'subscription',
        subscription_data: {
          trial_period_days: 7,
          metadata: {
            app_name: "DIGITAL MARKETING INTELLIGENCE"
          }
        },
        success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.origin}/pricing`,
      });

      res.status(200).json({ sessionId: session.id, url: session.url });
    } catch (error: any) {
      console.error("Stripe Checkout Error:", error);
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
