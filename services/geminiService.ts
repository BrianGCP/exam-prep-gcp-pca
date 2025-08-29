
import { GoogleGenAI, Type } from "@google/genai";
import { GEMINI_SYSTEM_PROMPT } from '../constants';
import type { QuizQuestion, QuizResponse } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const QUIZ_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    quiz: {
      type: Type.ARRAY,
      description: "A list of 10 multiple-choice quiz questions.",
      items: {
        type: Type.OBJECT,
        properties: {
          question: {
            type: Type.STRING,
            description: "The question text, also known as the stem.",
          },
          options: {
            type: Type.ARRAY,
            description: "An array of four answer choices, formatted as 'A: ...', 'B: ...', 'C: ...', 'D: ...'.",
            items: {
              type: Type.STRING,
            },
          },
          correctAnswer: {
            type: Type.STRING,
            description: "The letter of the correct answer (e.g., 'A', 'B', 'C', or 'D').",
          },
          explanation: {
            type: Type.STRING,
            description: "A detailed explanation for why the correct answer is correct.",
          },
          distractorExplanations: {
            type: Type.ARRAY,
            description: "An array of objects, each containing an incorrect option letter and its explanation.",
            items: {
                type: Type.OBJECT,
                properties: {
                    option: { type: Type.STRING, description: "The incorrect option letter (e.g., 'B')" },
                    explanation: { type: Type.STRING, description: "The explanation for why this option is incorrect."}
                },
                required: ["option", "explanation"]
            }
          }
        },
        required: ["question", "options", "correctAnswer", "explanation", "distractorExplanations"],
      },
    },
  },
  required: ["quiz"],
};


export const generateQuiz = async (categoryTopics: string): Promise<QuizQuestion[]> => {
    try {
        const userPrompt = `Please create 10 multiple-choice questions for the Google Cloud Professional Cloud Architect exam, comparable to the cognitive level and technical complexity of the real exam. The questions should be based on the following topics and be highly relevant and accurate according to current Google Cloud documentation:\n\n${categoryTopics}`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: userPrompt,
            config: {
                systemInstruction: GEMINI_SYSTEM_PROMPT,
                responseMimeType: "application/json",
                responseSchema: QUIZ_SCHEMA,
            },
        });
        
        const jsonText = response.text.trim();
        const parsedResponse: QuizResponse = JSON.parse(jsonText);
        
        return parsedResponse.quiz;

    } catch (error) {
        console.error("Error generating quiz:", error);
        throw new Error("Failed to generate quiz. Please check your API key and try again.");
    }
};
