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
  "type": "theory" | "practical",
  "studentAnswer": "<text>",
  "isCorrect": true | false,
  "feedback": "<text>",
  "marks": <number>
}

Here is the data:
${JSON.stringify(qa, null, 2)}
`;