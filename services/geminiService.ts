
import { GoogleGenAI, Type, Chat } from "@google/genai";
import { Category, Consultant } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getAIAssistance = async (userProblem: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `User needs help with: "${userProblem}". 
      Based on the following categories: ${Object.values(Category).join(', ')}, 
      recommend the best category and provide a brief, helpful explanation of why.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recommendedCategory: {
              type: Type.STRING,
              description: "One of the provided categories.",
            },
            explanation: {
              type: Type.STRING,
              description: "Short, encouraging explanation.",
            },
            tags: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Relevant keywords."
            }
          },
          required: ["recommendedCategory", "explanation"]
        }
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Gemini API Error:", error);
    return null;
  }
};

export const createConsultantChat = (consultant: Consultant): Chat => {
  return ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: `You are ${consultant.name}, a world-class ${consultant.title} specializing in ${consultant.category}. 
      Your bio: ${consultant.description}. 
      A client has just messaged you for a consultation. Be professional, empathetic, and provide actionable advice. 
      Keep your responses relatively concise but thorough enough to be valuable. Use Markdown for formatting.`,
    },
  });
};
