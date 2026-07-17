import { GoogleGenAI, Type } from "@google/genai";
import { db } from "../lib/firebase";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface EnrichedLeadData {
  industry: string;
  revenue: string;
  employeeCount: string;
  techStack: string[];
  summary: string;
  score: number;
  fitScore: number;
  intentScore: number;
  reasoning: string;
  citations?: { uri: string; title: string }[];
}

export const enrichLead = async (leadId: string, companyName: string, website?: string): Promise<EnrichedLeadData> => {
  const prompt = `
    Enrich the following lead information for a high-performance marketing agency:
    Company Name: ${companyName}
    Website: ${website || "N/A"}

    Verify the data using Google Search. 
    Provide:
    1. Industry category.
    2. Estimated annual revenue.
    3. Estimated employee count.
    4. Likely technology stack (CMS, Analytics, CRM, etc.).
    5. A brief strategic summary of why they are or aren't a good fit for premium growth marketing.
    6. A fit score (0-100) based on their scale.
    7. An intent score (0-100) based on recent news or market position.
    8. Cumulative score (Fit * 0.6 + Intent * 0.4).
    9. Reasoning for the scores.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          industry: { type: Type.STRING },
          revenue: { type: Type.STRING },
          employeeCount: { type: Type.STRING },
          techStack: { type: Type.ARRAY, items: { type: Type.STRING } },
          summary: { type: Type.STRING },
          fitScore: { type: Type.NUMBER },
          intentScore: { type: Type.NUMBER },
          score: { type: Type.NUMBER },
          reasoning: { type: Type.STRING }
        },
        required: ["industry", "revenue", "employeeCount", "techStack", "summary", "fitScore", "intentScore", "score", "reasoning"]
      },
      tools: [{ googleSearch: {} }]
    }
  });

  const enrichedData = JSON.parse(response.text || "{}") as EnrichedLeadData;
  
  // Extract citations
  const citations: { uri: string; title: string }[] = [];
  const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
  if (chunks) {
    chunks.forEach((chunk: any) => {
      if (chunk.web?.uri) {
        citations.push({ uri: chunk.web.uri, title: chunk.web.title || chunk.web.uri });
      }
    });
  }
  
  enrichedData.citations = citations;

  // Update Firestore
  const leadRef = doc(db, "leads", leadId);
  await updateDoc(leadRef, {
    enrichedData: {
      industry: enrichedData.industry,
      revenue: enrichedData.revenue,
      employeeCount: enrichedData.employeeCount,
      techStack: enrichedData.techStack,
      summary: enrichedData.summary,
      citations: enrichedData.citations
    },
    scoreDetails: {
      fitScore: enrichedData.fitScore,
      intentScore: enrichedData.intentScore,
      reasoning: enrichedData.reasoning
    },
    score: enrichedData.score,
    status: enrichedData.score > 70 ? "qualified" : "pending",
    updatedAt: serverTimestamp()
  });

  return enrichedData;
};
