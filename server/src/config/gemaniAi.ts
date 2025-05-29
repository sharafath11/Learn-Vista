import dotenv from 'dotenv';
dotenv.config();

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY!);
console.log("gen ai",genAI)
export async function getGemaniResponse() {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); 

    const result = await model.generateContent("Explain how AI works in a few words");
    const response = await result.response;
    const text = response.text();

    console.log(text);
  } catch (error) {
    console.error("Error generating content:", error);
  }
}
