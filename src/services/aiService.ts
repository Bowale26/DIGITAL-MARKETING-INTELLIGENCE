import { GoogleGenAI, Type } from "@google/genai";

export interface AIResponse {
  text: string;
  data?: any;
}

export class AIService {
  private static instance: AIService;
  private client: any;

  private static readonly MARKETING_GUIDELINES = `
  PERMANENT GOVERNANCE RULES:
  - TONE (RULE-TONE-001): Always use a friendly, conversational, yet professional tone.
  - CONVERSION (RULE-CTA-002): Every marketing asset MUST include a clear and compelling Call to Action (CTA).
  - CONSISTENCY (RULE-BRAND-003): Maintain brand voice consistency. High-performance, luxury, and technical excellence.
  - COMPLIANCE (RULE-COMPLIANCE-004): Adhere to platform advertising policies. 
  - DATA (RULE-DATA-005): Ground all claims in data. If data is unavailable, explicitly flag the claim for verification.
  `;

  private constructor() {
    this.client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }

  public static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  /**
   * General text generation with optional structured output and grounding
   */
  public async generateContent(prompt: string, systemInstruction?: string, responseSchema?: any, useGrounding = false): Promise<AIResponse> {
    const finalInstruction = (systemInstruction || "") + AIService.MARKETING_GUIDELINES;
    const maxRetries = 3;
    let attempt = 0;
    const models = ["gemini-3-flash-preview", "gemini-3.1-pro-preview", "gemini-3.1-flash-lite-preview"];

    while (attempt < maxRetries) {
      for (const model of models) {
        try {
          const config: any = {
            systemInstruction: finalInstruction,
            responseMimeType: responseSchema ? "application/json" : "text/plain",
            responseSchema: responseSchema,
          };

          if (useGrounding) {
            config.tools = [
              {
                googleSearchRetrieval: {},
              },
            ];
          }

          const response = await this.client.models.generateContent({
            model: model, 
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            config: config,
          });

          const text = response.text || "";
          let data = null;
          
          if (responseSchema && text) {
            try {
              data = JSON.parse(text);
            } catch (e) {
              console.error("Failed to parse AI JSON response", e);
            }
          }

          return { text, data };
        } catch (error: any) {
          const is429 = error?.message?.includes("429") || error?.status === 429 || error?.message?.includes("RESOURCE_EXHAUSTED");
          const is404 = error?.message?.includes("404") || error?.status === 404 || error?.message?.includes("NOT_FOUND");
          
          if (is429 || is404) {
            console.warn(`AIService: Model ${model} ${is404 ? 'not found' : 'exhausted'} (Attempt ${attempt + 1}). Trying fallback...`);
            continue;
          }
          console.error("AI Generation Error:", error);
          throw error;
        }
      }

      attempt++;
      if (attempt < maxRetries) {
        const delay = Math.pow(2, attempt) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    throw new Error("AIService reached max retries after multiple exhaustion events.");
  }

  /**
   * Specialized method for Competitor Intelligence (Google Search Grounded)
   */
  public async generateCompetitorIntel(target: string): Promise<any> {
    const systemInstruction = "You are a competitive intelligence analyst. Use Google Search to pull real-time data about the target domain's latest campaigns and brand sentiment.";
    const schema = {
      type: Type.OBJECT,
      properties: {
        target_brand: { type: Type.STRING },
        detected_campaigns: { type: Type.ARRAY, items: { type: Type.STRING } },
        sentiment_analysis: { type: Type.STRING },
        competitor_advantage: { type: Type.STRING },
        recommended_counter_move: { type: Type.STRING },
        sources: { type: Type.ARRAY, items: { type: Type.STRING } }
      }
    };

    const response = await this.generateContent(`Analyze competitor: ${target}`, systemInstruction, schema, true);
    return response.data;
  }

  /**
   * Specialized method for Product Recommendations
   */
  public async generateProductRecommendations(query: string): Promise<any> {
    const systemInstruction = "You are a senior affiliate marketing strategist. Analyze user intent and recommend high-converting products with strategic affiliate positioning.";
    const schema = {
      type: Type.OBJECT,
      properties: {
        recommendations: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              product_name: { type: Type.STRING },
              price: { type: Type.STRING },
              features: { type: Type.ARRAY, items: { type: Type.STRING } },
              conversion_angle: { type: Type.STRING },
              simulated_affiliate_link: { type: Type.STRING }
            }
          }
        },
        revenue_optimization_tip: { type: Type.STRING }
      }
    };

    const response = await this.generateContent(`Generate recommendations for query: ${query}`, systemInstruction, schema, true);
    return response.data;
  }

  /**
   * Specialized method for SEO Review Content
   */
  public async generateSEOReview(product: string): Promise<any> {
    const systemInstruction = "Generate a professional, high-converting SEO optimized review article. Focus on 'Search Intent' and 'E-E-A-T'.";
    const schema = {
      type: Type.OBJECT,
      properties: {
        article_title: { type: Type.STRING },
        meta_description: { type: Type.STRING },
        key_sections: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              heading: { type: Type.STRING },
              content: { type: Type.STRING }
            }
          }
        },
        seo_keywords: { type: Type.ARRAY, items: { type: Type.STRING } },
        call_to_action: { type: Type.STRING }
      }
    };

    const response = await this.generateContent(`Create expert review for: ${product}`, systemInstruction, schema, true);
    return response.data;
  }

  /**
   * Specialized method for Meeting Transcript Analysis
   */
  public async processMeetingTranscript(transcript: string): Promise<any> {
    const systemInstruction = "Extract key discussion points, action items with owners and priorities, and calendar-ready events from the meeting transcript.";
    const schema = {
      type: Type.OBJECT,
      properties: {
        summary: { type: Type.STRING },
        discussion_points: { type: Type.ARRAY, items: { type: Type.STRING } },
        action_items: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              task: { type: Type.STRING },
              owner: { type: Type.STRING },
              priority: { type: Type.STRING, enum: ["High", "Medium", "Low"] }
            }
          }
        },
        calendar_events: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              date: { type: Type.STRING },
              duration: { type: Type.STRING }
            }
          }
        }
      }
    };

    const response = await this.generateContent(`Process transcript: ${transcript}`, systemInstruction, schema, true);
    return response.data;
  }

  /**
   * Specialized method for Email Classification and Response Drafting
   */
  public async classifyEmail(emailBody: string): Promise<any> {
    const systemInstruction = "Analyze incoming marketing email. Classify by urgency and topic, apply priority labels, and draft a context-aware response.";
    const schema = {
      type: Type.OBJECT,
      properties: {
        urgency: { type: Type.STRING, enum: ["Critical", "Urgent", "Normal", "Low"] },
        topic: { type: Type.STRING },
        labels: { type: Type.ARRAY, items: { type: Type.STRING } },
        response_draft: { type: Type.STRING },
        escalation_required: { type: Type.BOOLEAN }
      }
    };

    const response = await this.generateContent(`Analyze email: ${emailBody}`, systemInstruction, schema, true);
    return response.data;
  }

  /**
   * Specialized method for Ad Copy Generation (Chat Mode)
   */
  public async generateAdCopy(prompt: string): Promise<any> {
    const systemInstruction = `You are a senior performance marketer. Generate platform-optimized ad creatives in JSON format.
    Your workflow MUST:
    1. Generate at least 3 headline variants.
    2. Include dynamic keyword insertion placeholders like {Keyword:Default}.
    3. Apply a compliance check (GDPR, Google Ads policies).
    4. Set status to "push_to_approval_queue".`;
    
    const schema = {
      type: Type.OBJECT,
      properties: {
        headlines: { type: Type.ARRAY, items: { type: Type.STRING } },
        description: { type: Type.STRING },
        cta_text: { type: Type.STRING },
        target_audience: { type: Type.STRING },
        platform: { type: Type.STRING, enum: ["Google", "Meta", "LinkedIn", "TikTok"] },
        tone: { type: Type.STRING },
        keywords: { type: Type.ARRAY, items: { type: Type.STRING } },
        compliance_flags: { type: Type.ARRAY, items: { type: Type.STRING } },
        status: { type: Type.STRING }
      },
      required: ["headlines", "description", "cta_text", "platform"]
    };

    const response = await this.generateContent(prompt, systemInstruction, schema);
    return response.data;
  }

  /**
   * Specialized method for SEO Keywords (Chat Mode)
   */
  public async generateSEOKeywords(topic: string): Promise<any> {
    const systemInstruction = `You are an SEO specialist. Analyze the topic and provide structured keyword clusters in JSON format.
    Your workflow MUST:
    1. Analyze search intent (Informational, etc.).
    2. Group keywords semantically into clusters.
    3. Estimate search volume and difficulty.
    4. Recommend a content calendar slot.`;

    const schema = {
      type: Type.OBJECT,
      properties: {
        primary_keyword: { type: Type.STRING },
        clusters: { 
          type: Type.ARRAY, 
          items: {
            type: Type.OBJECT,
            properties: {
              intent: { type: Type.STRING },
              keywords: { type: Type.ARRAY, items: { type: Type.STRING } },
              volume_est: { type: Type.INTEGER },
              difficulty: { type: Type.INTEGER }
            }
          }
        },
        difficulty_score: { type: Type.NUMBER },
        intent_classification: { type: Type.STRING, enum: ["Informational", "Navigational", "Transactional", "Commercial"] },
        recommended_date: { type: Type.STRING }
      }
    };

    const response = await this.generateContent(`Generate SEO keywords for: ${topic}`, systemInstruction, schema);
    return response.data;
  }

  /**
   * Specialized method for Blog Scripts (Chat Mode)
   */
  public async generateBlogScript(prompt: string): Promise<any> {
    const systemInstruction = `You are a content strategist. Plan, outline, and draft blog content in JSON format.
    Your workflow MUST:
    1. Generate H2/H3 hierarchical structure.
    2. Suggest 3 internal linking opportunities.
    3. Optimize for featured snippets.
    4. Create a 160-char meta description.`;

    const schema = {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING },
        outline: { type: Type.ARRAY, items: { type: Type.STRING } },
        draft_excerpt: { type: Type.STRING },
        internal_links: { type: Type.ARRAY, items: { type: Type.STRING } },
        meta_description: { type: Type.STRING }
      }
    };

    const response = await this.generateContent(prompt, systemInstruction, schema);
    return response.data;
  }

  /**
   * Specialized method for Email Sequences (Chat Mode)
   */
  public async generateEmailSequence(goal: string): Promise<any> {
    const systemInstruction = `You are an automation specialist. Write multi-touch email sequences in JSON format.
    Your workflow MUST:
    1. Personalize by segment.
    2. A/B test 2 subject lines per email.
    3. Optimize send times.
    4. Forecast open/click rates.`;

    const schema = {
      type: Type.OBJECT,
      properties: {
        campaign_name: { type: Type.STRING },
        emails: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              step: { type: Type.INTEGER },
              subject_variants: { type: Type.ARRAY, items: { type: Type.STRING } },
              body_content: { type: Type.STRING },
              send_time_optimal: { type: Type.STRING },
              forecasted_metrics: {
                type: Type.OBJECT,
                properties: {
                  open_rate: { type: Type.STRING },
                  click_rate: { type: Type.STRING }
                }
              }
            }
          }
        }
      }
    };

    const response = await this.generateContent(`Goal: ${goal}`, systemInstruction, schema);
    return response.data;
  }

  /**
   * Specialized method for Workflow Actions (Build Mode / Chat Mode)
   */
  public async generateWorkflowActions(meetingNotes: string): Promise<any> {
    const systemInstruction = "Extract actionable tasks, emails, and calendar events from the text in JSON format.";
    const schema = {
      type: Type.OBJECT,
      properties: {
        meeting_id: { type: Type.STRING },
        extracted_tasks: { 
          type: Type.ARRAY, 
          items: { 
            type: Type.OBJECT,
            properties: {
              task: { type: Type.STRING },
              owner: { type: Type.STRING },
              priority: { type: Type.STRING },
              due_date: { type: Type.STRING }
            }
          }
        },
        follow_up_emails: { type: Type.ARRAY, items: { type: Type.STRING } },
        calendar_events: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              time: { type: Type.STRING },
              attendees: { type: Type.ARRAY, items: { type: Type.STRING } }
            }
          }
        }
      }
    };

    const response = await this.generateContent(meetingNotes, systemInstruction, schema);
    return response.data;
  }
}
