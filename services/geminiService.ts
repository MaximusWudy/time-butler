import { GoogleGenAI, Type } from "@google/genai";
import { TimeLog, AIAnalysis } from '../types';

export const analyzeTimeLogs = async (logs: TimeLog[]): Promise<AIAnalysis> => {
  if (!logs || logs.length === 0) {
    return {
      summary: "No data available yet. Start tracking your time!",
      suggestions: ["Try logging your first activity."],
      score: 0
    };
  }

  // Filter logs for the last 7 days to keep context relevant
  const recentLogs = logs.filter(l => {
    const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
    return l.startTime > sevenDaysAgo;
  });

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `
    Analyze the following time tracking data.
    The data is a list of activities with duration in seconds.
    Provide a concise summary, 3 actionable suggestions to improve productivity or balance, and a productivity score from 0-100 based on healthy habits.
    
    Data: ${JSON.stringify(recentLogs.map(l => ({ type: l.activityType, durationMinutes: Math.round(l.duration / 60) })))}
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            suggestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            score: { type: Type.NUMBER }
          },
          required: ["summary", "suggestions", "score"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as AIAnalysis;
    }
    throw new Error("Empty response from AI");

  } catch (error) {
    console.error("AI Analysis failed:", error);
    return {
      summary: "Time Butler is currently offline or experiencing issues connecting to his brain.",
      suggestions: ["Check your internet connection", "Ensure API key is valid"],
      score: 50
    };
  }
};
