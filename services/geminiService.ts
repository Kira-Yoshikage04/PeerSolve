import { GoogleGenAI, Type } from "@google/genai";
import { Feedback } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const analyzeFeedbackForPoints = async (feedback: Feedback): Promise<number> => {
  if (!process.env.API_KEY) {
    console.warn("API_KEY not found. Throwing error.");
    throw new Error("Feature not available: API key is not configured.");
  }

  try {
    const prompt = `
      Analyze the following student feedback for a peer-to-peer doubt solving platform.
      The feedback consists of a star rating (1-5) and a written review.
      Based on the sentiment and helpfulness conveyed, award points to the user who provided the answer.

      - A 1-star review might be 0-2 points.
      - A 3-star review with mixed feedback could be 5-8 points.
      - A 5-star review with glowing praise should be 12-15 points.
      - Consider the nuance in the text. "Good" is okay, "Amazingly helpful and clear" is much better.

      Feedback to analyze:
      - Rating: ${feedback.rating} stars
      - Review: "${feedback.review}"

      Return ONLY a JSON object with a single key "points" containing the calculated integer value. Example: {"points": 12}
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
          }
        }
      }
    });

    const jsonText = response.text.trim();
    const result = JSON.parse(jsonText);

    if (result && typeof result.points === 'number') {
      return Math.round(result.points);
    }
    
    // If parsing is successful but points are not a number
    throw new Error("Received an invalid response from the AI.");

  } catch (error) {
    console.error("Error analyzing feedback with Gemini:", error);
    throw new Error("Could not analyze feedback due to an API error. Please try again later.");
  }
};

export const translateText = async (text: string, targetLanguage: 'English' | 'Hindi'): Promise<string> => {
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

  } catch (error) {
    console.error(`Error translating text to ${targetLanguage}:`, error);
    throw new Error(`Translation failed. Please try again later.`);
  }
};