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


