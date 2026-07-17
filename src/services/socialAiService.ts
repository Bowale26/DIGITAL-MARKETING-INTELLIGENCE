import { GoogleGenAI, Type } from "@google/genai";

export interface SocialPostVariation {
  platform: 'Instagram' | 'LinkedIn' | 'TikTok' | 'Twitter/X';
  content: string;
  hashtags: string[];
  cta: string;
  optimalTime: string;
}

export interface PostGenerationResult {
  variations: SocialPostVariation[];
}

export class SocialAiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });
  }

  public async generatePostVariations(
    prompt: string, 
    brandVoice: string,
    options?: {
      tone?: string;
      length?: 'short' | 'medium' | 'long';
      keywords?: string[];
    }
  ): Promise<SocialPostVariation[]> {
    const { tone = 'Professional', length = 'medium', keywords = [] } = options || {};
    
    const response = await this.ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate high-performance social media post variations based on the following topic: "${prompt}".
      
      Brand Voice base: ${brandVoice}.
      Applied Tone Override: ${tone}.
      Desired Length: ${length}.
      Mandatory Keywords to Include: ${keywords.join(', ') || 'None specified'}.
      
      Requirements:
      1. Provide variations for Instagram (visual-focused), LinkedIn (professional/thought-leadership), and TikTok (engaging/short).
      2. Each variation MUST include a compelling Call to Action (CTA) and adhere to the ${tone} tone.
      3. The content length should be ${length}.
      4. Explicitly include keywords: ${keywords.join(', ') || 'N/A'}.
      5. Suggest 3-5 optimal hashtags per platform.
      6. Suggest an optimal posting time based on algorithmic trends.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            variations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  platform: { type: Type.STRING },
                  content: { type: Type.STRING },
                  hashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
                  cta: { type: Type.STRING },
                  optimalTime: { type: Type.STRING }
                },
                required: ["platform", "content", "hashtags", "cta", "optimalTime"]
              }
            }
          },
          required: ["variations"]
        }
      }
    });

    try {
      const data = JSON.parse(response.text.trim());
      return data.variations;
    } catch (e) {
      console.error("Failed to parse AI response", e);
      return [];
    }
  }
}

export const socialAiService = new SocialAiService();
