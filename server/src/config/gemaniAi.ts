import { GoogleGenerativeAI } from "@google/generative-ai";
import { throwError } from "../utils/resAndError";
import { StatusCode } from "../enums/statusCode.enum";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY!);

export async function getAIResponse(prompt: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (geminiError) {
    console.error("⚠️ Gemini failed, switching to NVIDIA/Nemotron:", geminiError);

    try {
      const NEMOTRON_MODEL = "nvidia/nemotron-nano-12b-v2-vl:free";
      const openRouterResult = await callOpenRouter(NEMOTRON_MODEL, prompt);
      return openRouterResult;
    } catch (nemotronError) {
      console.error("⚠️ NVIDIA/Nemotron failed, switching to Tongyi DeepResearch:", nemotronError);

      try {
        const TONGYI_MODEL = "alibaba/tongyi-deepresearch-30b-a3b:free";
        const openRouterResult = await callOpenRouter(TONGYI_MODEL, prompt);
        return openRouterResult;
      } catch (tongyiError) {
        console.error("❌ All three AI services failed:", tongyiError);
        throwError(
          "All AI services are currently unavailable. Please try again later 😮‍💨",
          StatusCode.BAD_REQUEST
        );
      }
    }
  }

  throwError("AI process completion error.", StatusCode.INTERNAL_SERVER_ERROR);
}

async function callOpenRouter(modelName: string, prompt: string): Promise<string> {
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPEN_ROUTER_KEY}`,
      "HTTP-Referer": "https://yourapp.com", 
      "X-Title": "Learn vista",             
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: modelName,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: prompt,
            },
          ],
        },
      ],
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`OpenRouter API for ${modelName} failed: ${response.statusText}. Details: ${errorBody}`);
  }

  const data = await response.json();
  const text =
    data.choices?.[0]?.message?.content ||
    `No content response from model: ${modelName}.`;
  return text;
}