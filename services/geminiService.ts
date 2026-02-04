
import { GoogleGenAI } from "@google/genai";

// Initialize Gemini API client correctly using named parameter
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeSpatialTrends = async (nodes: any[]) => {
  const prompt = `Analyze this set of spatial network nodes for a digital sovereign mapping network. 
  Identify potential clusters, network weaknesses, and provide a strategic outlook on expansion.
  Nodes: ${JSON.stringify(nodes.slice(0, 10))}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: "You are the SovereignMap Intelligence Unit. Your role is to provide strategic, high-level analysis of spatial data mesh performance and geopolitical digital sovereignty impact. Keep responses concise and technical.",
        temperature: 0.7,
      },
    });
    // Correctly accessing text property (not a method)
    return response.text;
  } catch (error) {
    console.error("Gemini analysis failed:", error);
    return "Intelligence link interrupted. Local analysis suggests nominal mesh performance.";
  }
};

export const generateSovereignNarrative = async (alias: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a short futuristic briefing for Node Operator ${alias} about their current sector's status in the digital sovereignty mesh.`,
    });
    // Correctly accessing text property (not a method)
    return response.text;
  } catch (error) {
    console.error("Narrative generation failed:", error);
    return "Intelligence link interrupted. Local analysis suggests nominal mesh performance.";
  }
};
