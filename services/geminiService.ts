import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AnalysisResult } from "../types";

const SYSTEM_INSTRUCTION = `
You are an expert technical troubleshooter and problem solver. 
Your goal is to analyze images of broken items, error screens, or general problems provided by users, along with their description.
You must diagnose the issue and provide a safe, clear, step-by-step solution.
Be concise but thorough. Prioritize safety.
If the image is unclear, provide general advice based on the description but note the ambiguity.
`;

const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    summary: {
      type: Type.STRING,
      description: "A concise summary of the identified problem.",
    },
    likelyCause: {
      type: Type.STRING,
      description: "The most probable root cause of the issue.",
    },
    solutionSteps: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Step-by-step instructions to fix the problem. Ordered from easiest/safest to most complex.",
    },
    alternativeCauses: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Other possible causes if the primary one is incorrect.",
    },
    searchQueries: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Keywords for the user to search on Google for more help.",
    },
    warnings: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Safety warnings or things to avoid doing.",
    },
  },
  required: ["summary", "likelyCause", "solutionSteps", "alternativeCauses", "searchQueries", "warnings"],
};

export const analyzeProblem = async (
  imageBase64: string,
  description: string,
  category: string = "General"
): Promise<AnalysisResult> => {
  try {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("API Key not found. Please set VITE_GEMINI_API_KEY in your .env.local file.");
    }

    const ai = new GoogleGenAI({ apiKey });

    // Remove data URL prefix if present (e.g., "data:image/jpeg;base64,")
    const base64Data = imageBase64.split(',')[1] || imageBase64;

    const contextPrompt = `
      Context Category: ${category}
      ${description ? `User Description: "${description}"` : "Please analyze this image and identify the problem."}
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg", // Assuming JPEG/PNG, the API is flexible with standard image types
              data: base64Data,
            },
          },
          {
            text: contextPrompt,
          },
        ],
      },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response received from AI.");
    }

    const result = JSON.parse(text) as AnalysisResult;
    return result;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};