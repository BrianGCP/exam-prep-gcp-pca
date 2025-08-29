
import { GoogleGenAI, Type } from "@google/genai";
import { GEMINI_SYSTEM_PROMPT } from '../constants';
import type { QuizQuestion, QuizResponse, DistractorExplanation } from '../types';

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
          },
          sourceURL: {
            type: Type.STRING,
            description: "A URL to a relevant Google Cloud documentation page for further reading.",
          },
        },
        required: ["question", "options", "correctAnswer", "explanation", "distractorExplanations", "sourceURL"],
      },
    },
  },
  required: ["quiz"],
};

// Fisher-Yates shuffle algorithm
const shuffleArray = <T>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
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
        
        // Randomize answer choices to ensure the correct answer isn't always in the same position
        const randomizedQuiz = parsedResponse.quiz.map(question => {
            const letters = ['A', 'B', 'C', 'D'];
            
            const answers = question.options.map((option, index) => {
                const originalLetter = letters[index];
                const text = option.substring(option.indexOf(':') + 1).trim();
                const isCorrect = originalLetter === question.correctAnswer;
                
                let explanation = '';
                if (isCorrect) {
                    explanation = question.explanation;
                } else {
                    const distractor = question.distractorExplanations.find(de => de.option === originalLetter);
                    explanation = distractor ? distractor.explanation : 'No explanation provided for this distractor.';
                }
                return { text, isCorrect, explanation };
            });

            const shuffledAnswers = shuffleArray(answers);

            const newCorrectIndex = shuffledAnswers.findIndex(ans => ans.isCorrect);
            const newCorrectAnswer = letters[newCorrectIndex];
            const newOptions = shuffledAnswers.map((ans, index) => `${letters[index]}: ${ans.text}`);
            const newExplanation = shuffledAnswers[newCorrectIndex].explanation;
            const newDistractorExplanations = shuffledAnswers
                .map((ans, index) => {
                    if (!ans.isCorrect) {
                        return { option: letters[index], explanation: ans.explanation };
                    }
                    return null;
                })
                .filter((de): de is DistractorExplanation => de !== null);

            return {
                ...question,
                options: newOptions,
                correctAnswer: newCorrectAnswer,
                explanation: newExplanation,
                distractorExplanations: newDistractorExplanations,
            };
        });

        return randomizedQuiz;

    } catch (error) {
        console.error("Error generating quiz:", error);
        throw new Error("Failed to generate quiz. Please check your API key and try again.");
    }
};