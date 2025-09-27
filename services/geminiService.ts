

import { GoogleGenAI, Type } from "@google/genai";
import { Doubt, Feedback } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export interface AIFeedbackAnalysis {
  points: number;
}


export const analyzeFeedbackAndAwardPoints = async (reviewText: string, rating: number): Promise<AIFeedbackAnalysis> => {
  if (!process.env.API_KEY) {
    console.warn("API_KEY not found. Throwing error.");
    throw new Error("Feature not available: API key is not configured.");
  }

  try {
    const prompt = `
      As a fair moderator on a student learning platform, your task is to analyze the feedback a user has provided for an answer and determine the points to award.

      Here is the feedback:
      - Rating: ${rating}/5 stars
      - Review: "${reviewText}"

      Based on the rating, and the review's sentiment and constructiveness, determine how many points to award the person who received this feedback. The scale is from 0 to 15 points.
      - A 5-star rating with a thoughtful review ("This was amazing, it helped me understand X and Y perfectly!") should receive 12-15 points.
      - A 5-star rating with a low-effort review ("thanks") should receive fewer points, maybe 8-10.
      - A 3-star rating with constructive criticism ("This is a good start, but you missed explaining the 'why'") should receive 5-8 points.
      - A 1-star rating with a harsh but valid review should receive 0-2 points.
      - A 1-star rating with a non-constructive review ("useless") should receive 0 points.

      Return ONLY a JSON object with a single "points" key.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            points: { type: Type.NUMBER }
          },
          required: ["points"]
        }
      }
    });

    const jsonText = response.text.trim();
    const result = JSON.parse(jsonText);

    if (result && typeof result.points === 'number') {
      return {
        points: Math.round(result.points),
      };
    }
    
    throw new Error("Received an invalid or incomplete response from the AI.");

  } catch (error) {
    console.error("Error analyzing feedback with Gemini:", error);
    throw new Error("Could not analyze feedback due to an API error. Please try again later.");
  }
};


export const translateText = async (text: string, targetLanguage: string): Promise<string> => {
   if (!process.env.API_KEY) {
    console.warn("API_KEY not found. Throwing error.");
    throw new Error("Feature not available: API key is not configured.");
  }

  try {
    const prompt = `Translate the following text to ${targetLanguage}. Return only the translated text.
    
    Text to translate:
    "${text}"
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    return response.text.trim();

// FIX: Add curly braces to the catch block to fix the syntax error.
  } catch (error) {
    console.error(`Error translating text to ${targetLanguage}:`, error);
    throw new Error(`Translation failed. Please try again later.`);
  }
};
