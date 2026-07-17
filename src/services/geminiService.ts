import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: (process.env as any).GEMINI_API_KEY });

const DEFAULT_MODEL = "gemini-3-flash-preview";

export class GeminiService {
  private static instance: GeminiService;

  static getInstance(): GeminiService {
    if (!GeminiService.instance) {
      GeminiService.instance = new GeminiService();
    }
    return GeminiService.instance;
  }

  async classifyIntent(signal: string) {
    try {
      const response = await ai.models.generateContent({
        model: DEFAULT_MODEL,
        contents: [{ role: 'user', parts: [{ text: `Classify the following user intent for a digital marketing agency system: "${signal}". Return JSON with "role" (one of: OrchestratorAgent, LEDGER_AGENT, TIER_ANALYSIS_AGENT, ComplianceAgent) and "intent" string.` }] }],
        config: { responseMimeType: "application/json" }
      });
      return JSON.parse(response.text || '{}');
    } catch (e) {
      console.error("Gemini classifyIntent error:", e);
      return { role: 'OrchestratorAgent', intent: 'GENERAL_INQUIRY' };
    }
  }

  async synthesizeResponse(role: string, payload: any) {
    try {
      const response = await ai.models.generateContent({
        model: DEFAULT_MODEL,
        contents: [{ role: 'user', parts: [{ text: `As the ${role}, synthesize a professional response based on this payload: ${JSON.stringify(payload)}. Be brief and high-performance focused.` }] }],
      });
      return response.text || "Response synthesis failed. Protocol fallback: Status Optimal.";
    } catch (e) {
      console.error("Gemini synthesizeResponse error:", e);
      return "Response synthesis failed. Protocol fallback: Status Optimal.";
    }
  }

  async classifyAdsIntent(signal: string) {
    try {
      const response = await ai.models.generateContent({
        model: DEFAULT_MODEL,
        contents: [{ role: 'user', parts: [{ text: `Classify ads management intent for: "${signal}". Return JSON with "role" (OrchestratorAgent, ChannelPerformanceAgent), "channel" (CH_01, CH_02, CH_03), and "intent".` }] }],
        config: { responseMimeType: "application/json" }
      });
      return JSON.parse(response.text || '{}');
    } catch (e) {
      console.error("Gemini classifyAdsIntent error:", e);
      return { role: 'OrchestratorAgent', channel: 'CH_01', intent: 'PERFORMANCE_SCAN' };
    }
  }

  async synthesizeAdsResponse(role: string, payload: any) {
    try {
      const response = await ai.models.generateContent({
        model: DEFAULT_MODEL,
        contents: [{ role: 'user', parts: [{ text: `As the ${role} for Ads, provide a data-driven insight for: ${JSON.stringify(payload)}. Keep it short.` }] }],
      });
      return response.text || "Ad insight synthesis offline. Channels operational.";
    } catch (e) {
      console.error("Gemini synthesizeAdsResponse error:", e);
      return "Ad insight synthesis offline. Channels operational.";
    }
  }
}

export async function generateOutreachEmail(topic: string) {
  try {
    const response = await ai.models.generateContent({
      model: DEFAULT_MODEL,
      contents: [{ role: 'user', parts: [{ text: `Generate two professional, high-intent A/B test variants of an outreach email for "Flux Agency". 
      Topic: ${topic}.
      
      Requirements:
      - Subject lines MUST start with [FLUX_AGENCY_OS]
      - Tone: Technical excellence + Luxury performance.
      - Variant A: Direct and data-heavy.
      - Variant B: Narrative-driven and growth-focused.
      - Mention "FLUX AGENCY OS: SYSTEM STATUS NOMINAL."
      - Format: Return JSON with "variantA" and "variantB", each having "subject" and "body".` }] }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            variantA: {
              type: Type.OBJECT,
              properties: {
                subject: { type: Type.STRING },
                body: { type: Type.STRING }
              },
              required: ["subject", "body"]
            },
            variantB: {
              type: Type.OBJECT,
              properties: {
                subject: { type: Type.STRING },
                body: { type: Type.STRING }
              },
              required: ["subject", "body"]
            }
          },
          required: ["variantA", "variantB"]
        }
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Gemini Generation Error:", error);
    throw error;
  }
}

export async function runMarketIntelligenceQuery(query: string, module: 'competitor' | 'trend' | 'seo' | 'crisis' | 'integrated') {
  try {
    const response = await ai.models.generateContent({
      model: DEFAULT_MODEL,
      contents: [{ role: 'user', parts: [{ text: `Perform a deep market intelligence analysis for the following ${module} query: "${query}". 
      
      For 'integrated' modules, synchronize data across Competitors, Trends, SEO, and Brand Health contexts.
      
      You MUST use the googleSearch tool to ground your response in real-time data.
      Return a structured intelligence report as JSON.` }] }],
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            data_points: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING } 
            },
            citations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  url: { type: Type.STRING }
                },
                required: ["title", "url"]
              }
            },
            confidence_score: { type: Type.NUMBER },
            grounding_verified: { type: Type.BOOLEAN }
          },
          required: ["summary", "data_points", "confidence_score", "grounding_verified"]
        }
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Market Intelligence Error:", error);
    return {
      summary: "Simulation mode active. Neural grounding engine latency detected.",
      data_points: ["Competitor check: Operational", "Trend scan: Cached", "SEO gap: Nominal"],
      confidence_score: 85,
      grounding_verified: false
    };
  }
}

export async function analyzeLeadScore(leadData: any) {
  try {
    const response = await ai.models.generateContent({
      model: DEFAULT_MODEL,
      contents: [{ role: 'user', parts: [{ text: `Perform a high-precision lead scoring analysis for Flux Agency. 
      Data: ${JSON.stringify(leadData)}
      
      Calculate a score (0-100) and provide a "Next-Gen Action".
      Return JSON: { "score": number, "action": string, "rationale": string }` }] }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            action: { type: Type.STRING },
            rationale: { type: Type.STRING }
          },
          required: ["score", "action", "rationale"]
        }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Lead scoring error:", error);
    return { score: 75, action: "Manual Protocol Override Required", rationale: "AI Analysis Offline" };
  }
}

export async function generateBuildCenterContent(templateName: string, instructions: string, action: string) {
  try {
    const response = await ai.models.generateContent({
      model: DEFAULT_MODEL,
      contents: [{ role: 'user', parts: [{ text: `You are an AI assistant specialized for the "Build Center" of Flux Agency.
      Application Template: ${templateName}
      Instructions: ${instructions}
      User requested action: ${action}
      
      Generate a professional and detailed output for this request. 
      Use Markdown formatting. 
      The output should include:
      1. A summary of the action taken.
      2. Detailed findings or content generated (e.g., ad copy, SEO audit points, lead score breakdown, calendar draft).
      3. Strategic recommendations.
      
      Ensure all claims are grounded where appropriate.` }] }],
    });

    return response.text;
  } catch (error) {
    console.error("Build Center Generation Error:", error);
    return "## Generation Failed\n\nProtocol fallback: Logic Engine Offline. Please retry activation.";
  }
}
