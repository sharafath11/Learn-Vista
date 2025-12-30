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
    try {
      return await callOpenRouter(
        "nvidia/nemotron-nano-12b-v2-vl:free",
        prompt
      );
    } catch {
      try {
        return await callOpenRouter(
          "alibaba/tongyi-deepresearch-30b-a3b:free",
          prompt
        );
      } catch {
        throwError(
          "All AI services are currently unavailable. Please try again later.",
          StatusCode.BAD_REQUEST
        );
      }
    }
  }
  throwError("AI process completion error.", StatusCode.INTERNAL_SERVER_ERROR);
}

export async function getAIResponseJSON(prompt: string): Promise<any> {
  const strictPrompt = `${prompt}

IMPORTANT:
Respond with ONLY valid JSON.
No markdown.
No explanation.
JSON must be directly parseable.`;

  const text = await getAIResponse(strictPrompt);
  return extractAndParseJSON(text);
}

function extractAndParseJSON(text: string): any {
  const cleaned = text.replace(/```json/gi, "").replace(/```/g, "").trim();
  try {
    return JSON.parse(cleaned);
  } catch {}
  const firstBrace = cleaned.indexOf("{");
  const firstBracket = cleaned.indexOf("[");
  const start =
    firstBrace === -1
      ? firstBracket
      : firstBracket === -1
      ? firstBrace
      : Math.min(firstBrace, firstBracket);
  if (start === -1) {
    throw new Error("No JSON found in AI response");
  }
  const candidate = cleaned.slice(start);
  return JSON.parse(candidate);
}

async function callOpenRouter(modelName: string, prompt: string): Promise<string> {
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPEN_ROUTER_KEY}`,
      "HTTP-Referer": "https://learnvista.app",
      "X-Title": "Learn Vista",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: modelName,
      messages: [
        {
          role: "user",
          content: [{ type: "text", text: prompt }],
        },
      ],
    }),
  });
  if (!response.ok) {
    const err = await response.text();
    throw new Error(err);
  }
  const data = await response.json();
  return data.choices?.[0]?.message?.content || "";
}
