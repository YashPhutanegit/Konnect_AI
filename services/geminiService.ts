import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AgentResponse, SystemType } from "../types";

const apiKey = process.env.API_KEY;

// Define the schema for the structured output we want from Gemini
const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    orchestrationPlan: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          stepNumber: { type: Type.INTEGER },
          system: { type: Type.STRING, enum: [SystemType.JIRA, SystemType.GITHUB, SystemType.DOCS, SystemType.SLACK, SystemType.ANALYSIS] },
          action: { type: Type.STRING },
          dataFlow: { type: Type.STRING },
          status: { type: Type.STRING, enum: ['complete'] }
        },
        required: ['stepNumber', 'system', 'action', 'dataFlow', 'status']
      }
    },
    executionResults: {
      type: Type.OBJECT,
      properties: {
        detectedComponent: { type: Type.STRING },
        bugPriority: { type: Type.STRING },
        bugSummary: { type: Type.STRING },
        commitHash: { type: Type.STRING },
        developerName: { type: Type.STRING },
        docEntryId: { type: Type.STRING },
        docContent: { type: Type.STRING },
        slackChannel: { type: Type.STRING },
        slackMessage: { type: Type.STRING }
      },
      required: ['detectedComponent', 'bugPriority', 'bugSummary', 'commitHash', 'developerName', 'docEntryId', 'docContent', 'slackChannel', 'slackMessage']
    }
  },
  required: ['orchestrationPlan', 'executionResults']
};

export const analyzeAndOrchestrate = async (imageBase64: string): Promise<AgentResponse> => {
  if (!apiKey) {
    throw new Error("API Key is missing. Please set process.env.API_KEY.");
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    You are the Software Development Ecosystem Orchestrator (C-PEOF).
    
    TASK:
    Analyze the provided image (which represents a Jira Board, Codebase Diagram, or generic software context).
    If the image is generic or unclear, SIMULATE a realistic P0 critical bug scenario based on standard software patterns.
    
    1. Identify a critical component and a P0 bug.
    2. Simulate a Git lookup for the last commit and developer.
    3. Simulate creating a Google Doc entry.
    4. Simulate drafting a Slack announcement.
    
    Return the result strictly as JSON matching the schema provided.
    Ensure the tone is professional, technical, and executive-ready.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/png', // Assuming PNG for simplicity, usually safe for base64
              data: imageBase64
            }
          },
          { text: prompt }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.4 // Low temperature for consistent, structured outputs
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");
    
    return JSON.parse(text) as AgentResponse;

  } catch (error) {
    console.error("Gemini Interaction Error:", error);
    throw new Error("Failed to process the orchestration request.");
  }
};