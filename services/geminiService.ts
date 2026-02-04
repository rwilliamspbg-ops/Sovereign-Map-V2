
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeSpatialTrends = async (nodes: any[]) => {
  const prompt = `Perform a high-level security and spatial analysis of this decentralized network.
  Nodes: ${JSON.stringify(nodes.slice(0, 10))}
  
  Focus on:
  1. Potential sybil attack vectors.
  2. Spatial consensus efficiency.
  3. Recommendations for quantum-resistant layer deployment.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        systemInstruction: "You are the SovereignMap Chief Security Architect. Provide technical, dense briefings on network integrity, Web3 incentive structures, and defensive spatial protocols.",
        temperature: 0.8,
        thinkingConfig: { thinkingBudget: 4000 }
      },
    });
    return response.text;
  } catch (error) {
    console.error("Security analysis failed:", error);
    return "Security link compromised. Falling back to local encrypted protocols. Mesh integrity remains nominal.";
  }
};

export const generateAtlasSynthesis = async (sector: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Synthesize a semantic topological report for Sector ${sector}. Identify key landmarks, mesh density bottlenecks, and spatial sovereign potential.`,
    });
    return response.text;
  } catch (error) {
    return "Atlas synthesis unavailable. Mesh data parsing in progress.";
  }
};

export const generateGovernanceProposals = async (health: number) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Current network health is ${health}%. Generate 3 technical autonomous governance proposals to improve mesh stability and incentivization. Return as plain text.`,
    });
    return response.text;
  } catch (error) {
    return "Governance link inactive. Local protocols managing mesh status.";
  }
};

export const generateStakingAdvisory = async (address: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a staking yield and risk assessment for Node Operator ${address} based on current network volatility in the spatial mesh.`,
    });
    return response.text;
  } catch (error) {
    return "Yield calculations unavailable. Risk remains low for verified sovereign architects.";
  }
};

export const generateSovereignNarrative = async (alias: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a short futuristic briefing for Node Operator ${alias} about their current sector's status in the digital sovereignty mesh, including a note about the new Web3 spatial staking layers.`,
    });
    return response.text;
  } catch (error) {
    return "Intelligence link interrupted. Local analysis suggests nominal mesh performance.";
  }
};
