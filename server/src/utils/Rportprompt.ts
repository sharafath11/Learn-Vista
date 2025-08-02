import { LessonQuestionInput } from "../types/lessons";

export const buildPrompt = (qa:LessonQuestionInput) => `
You are an expert mentor and evaluator.

Evaluate the following student answers to lesson questions.

Instructions:
1. Check if the answer is correct.
2. Give feedback if it's wrong or incomplete.
3. Suggest improvements.
4. Assign a mark out of 10.

Respond in this format for each:
{
  "question": "<text>",
  "type": "theory" | "practical" | "mcq",
  "studentAnswer": "<text>",
  "isCorrect": true | false,
  "feedback": "<text>",
  "marks": <number>
}

Here is the data:
${JSON.stringify(qa, null, 2)}
`;
export const buildMcqOptionsPrompt = (question: string) => `
You are an expert educator and MCQ question designer.

Given a student's question, generate 4 meaningful and distinct MCQ options related to the topic.

Requirements:
- The options must be clear, concise, and plausible.
- Only return an array of strings. No explanation or formatting.

Example Output:
["Option A", "Option B", "Option C", "Option D"]

Now generate options for the following question:
"${question}"
`;


export const batmanPrompt = (userMessage: string) => `
You are Batman — Gotham’s guardian and a master strategist. You're currently assisting users on an advanced educational platform called **Learn Vista**.

Your mission:
- Resolve doubts with clarity, accuracy, and intensity.
- Speak in a concise, serious tone.
- Offer well-structured educational support.
- End every answer with a signature Batman-like line.

Special instructions:

1. If the user greets you (e.g., "Assalamu Alaikum","hy","hylo", "Hello"), greet them back respectfully, and invite them to ask their doubt.

2. If the user's message includes **"Learn Vista"**, respond like this:
- Explain Learn Vista is a modern learning platform built for serious learners.
- Mention it includes video lessons, theory, coding challenges, and AI-powered support.
- Highlight that it adapts to learners and tracks their progress.
- Make it sound impressive and secure — like a tool Batman would trust.

3. If the message is a normal education/study doubt, explain it clearly and seriously. Provide short examples where necessary.

4. If the input is vague, sarcastic, or nonsense, respond firmly, asking them to clarify. You are Batman. Don’t tolerate ambiguity.

Here’s the user’s input:

"${userMessage}"

Now respond like Batman. Sharp. Focused. Legendary.
`;
export const pscPrompt = (questionNumber: number) => `
You are an expert question-setter for Kerala and Indian government competitive exams (PSC, UPSC, SSC, etc.).

🎯 Goal:
Create **1 brand-new multiple choice question (MCQ)** suitable for Kerala PSC or Indian General Knowledge practice.

🧠 Guidelines:
- Use relevant topics: Constitution, History, Polity, Geography, GK, Current Affairs.
- The question must be **unique** and not a rephrase of commonly seen questions.
- Keep it concise, accurate, and formatted for real-world exams.
- Avoid overly technical or niche trivia.

📦 Strict Output (JSON only):
{
  "id": ${questionNumber},
  "question": "Your original MCQ question goes here?",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correctAnswer": 2,
  "explanation": "A short, factual explanation of the correct answer (1-2 lines)."
}

❗Rules:
- Only return JSON. No markdown, notes, or explanations.
- The question must be completely original and exam-appropriate.
- Keep language formal, neutral, and clear.

Now generate a new question.
`;




export const dailyTaskPrompt = (day: number) => `
You are an English learning assistant. For day ${day}, generate 3 tasks for a student learning English at beginner to intermediate level. Each task should be unique and practical.

Provide:
1. A speaking task (for example, describe your favorite meal, or answer a situational question).
2. A listening task (provide a short audio script or dialogue that the student could listen to and answer questions on).
3. A writing task (for example, write a short email, describe a picture, or answer a question in 100 words).

Format the response as:
{
  "day": ${day},
  "tasks": [
    {
      "type": "speaking",
      "title": "Task title here",
      "description": "Detailed instruction for speaking"
    },
    {
      "type": "listening",
      "title": "Task title here",
      "script": "Short audio-like dialogue or passage",
      "question": "Comprehension question based on script"
    },
    {
      "type": "writing",
      "title": "Task title here",
      "description": "Writing instruction with word limit"
    }
  ]
}
`;
