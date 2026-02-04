
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

async function callGeminiWithRetry(
  modelName: string, 
  contents: any, 
  systemInstruction?: string,
  retries = 3
): Promise<string | null> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  let lastError: any = null;

  for (let i = 0; i < retries; i++) {
    try {
      const response = await ai.models.generateContent({
        model: modelName,
        contents: contents,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7,
        },
      });
      return response.text || null;
    } catch (error: any) {
      lastError = error;
      const errorMsg = error?.message || "";
      
      if (errorMsg.includes("429") || errorMsg.includes("RESOURCE_EXHAUSTED")) {
        console.warn(`Quota exceeded for ${modelName}. Retry ${i + 1}/${retries} after delay...`);
        await delay(Math.pow(2, i) * 1000 + Math.random() * 1000);
        continue;
      }
      
      console.error(`Gemini API Error (${modelName}):`, error);
      break;
    }
  }
  
  if (lastError?.message?.includes("429")) {
    return "The Mesh Intelligence is currently at peak capacity (Quota Exceeded). Please recalibrate in a few moments to restore full neural analysis.";
  }
  
  return null;
}

export const checkApiHealth = async (): Promise<boolean> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: 'ping',
      config: { maxOutputTokens: 5 }
    });
    return !!response.text;
  } catch (e) {
    console.error("Health check failed:", e);
    return false;
  }
};

export const analyzeThreatVector = async (logs: any[]) => {
  const prompt = `Analyze these recent network security logs for coordinated attack patterns (Eclipse, Sybil, Routing manipulation).
  Logs: ${JSON.stringify(logs)}
  
  Identify the most likely vector and provide a 2-sentence mitigation strategy for the autonomous firewall.`;

  const systemInstruction = "You are the SovereignMap Head of Cyber-Defense. You are laconic, highly technical, and focused on quantum-resistant mitigation strategies.";
  
  return await callGeminiWithRetry('gemini-3-flash-preview', prompt, systemInstruction);
};

export const analyzeSpatialTrends = async (nodes: any[]) => {
  const prompt = `Perform a high-level security and spatial analysis of this decentralized network.
  Nodes: ${JSON.stringify(nodes.slice(0, 10))}
  
  Focus on:
  1. Potential sybil attack vectors.
  2. Spatial consensus efficiency.
  3. Recommendations for quantum-resistant layer deployment.`;

  const systemInstruction = "You are the SovereignMap Chief Security Architect. Provide technical, dense briefings on network integrity, Web3 incentive structures, and defensive spatial protocols.";
  
  return await callGeminiWithRetry('gemini-3-flash-preview', prompt, systemInstruction);
};

export const planAutonomousMission = async (origin: string, destination: string, density: number) => {
  const prompt = `Plan a sovereign flight mission from ${origin} to ${destination}. 
  Current mesh density is ${density}%. 
  Identify potential 'Blind Spots' in mapping coverage and suggest a scouting pattern for a swarm of 3 drones.`;

  const systemInstruction = "You are a Chief Autonomous Flight Controller. Provide tactical, spatial coordinates and risk mitigation steps for decentralized drone fleets.";
  
  return await callGeminiWithRetry('gemini-3-flash-preview', prompt, systemInstruction);
};

export const generateAtlasSynthesis = async (sector: string) => {
  const prompt = `Synthesize a semantic topological report for Sector ${sector}. Identify key landmarks, mesh density bottlenecks, and spatial sovereign potential.`;
  return await callGeminiWithRetry('gemini-3-flash-preview', prompt);
};

export const generateGovernanceProposals = async (health: number) => {
  const prompt = `Current network health is ${health}%. Generate 3 technical autonomous governance proposals to improve mesh stability and incentivization. Return as plain text.`;
  return await callGeminiWithRetry('gemini-3-flash-preview', prompt);
};

export const generateStakingAdvisory = async (address: string) => {
  const prompt = `Generate a staking yield and risk assessment for Node Operator ${address} based on current network volatility in the spatial mesh.`;
  return await callGeminiWithRetry('gemini-3-flash-preview', prompt);
};

export const generateSovereignNarrative = async (alias: string) => {
  const prompt = `Generate a short futuristic briefing for Node Operator ${alias} about their current sector's status in the digital sovereignty mesh, including a note about the new Web3 spatial staking layers.`;
  return await callGeminiWithRetry('gemini-3-flash-preview', prompt);
};
