import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export class GeminiService {
  private model: any;

  constructor() {
    this.model = genAI.getGenerativeModel({ model: "gemini-pro" });
  }

  async generateContent(prompt: string): Promise<string> {
    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error("Gemini API Error:", error);
      throw new Error("Failed to generate content from AI");
    }
  }

  async generateJSON(prompt: string): Promise<any> {
    try {
      const result = await this.model.generateContent(prompt + " \n\n RESPONSE MUST BE VALID JSON ONLY. NO MARKDOWN.");
      const response = await result.response;
      const text = response.text();

      const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleanText);
    } catch (error) {
      console.error("Gemini JSON Generation Error:", error);
      throw new Error("Failed to generate JSON from AI");
    }
  }
}

export const geminiService = new GeminiService();
