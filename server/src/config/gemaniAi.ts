import dotenv from 'dotenv';
dotenv.config();

import { GoogleGenerativeAI } from "@google/generative-ai";
import { throwError } from '../utils/ResANDError';
import { StatusCode } from '../enums/statusCode.enum';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY!);

export async function getGemaniResponse(prompt: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return text;
  } catch (error) {
    throwError("AI is currently busy. Please try again later 😮‍💨",StatusCode.BAD_REQUEST);
  }
}
