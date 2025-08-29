
import React, { useState } from 'react';
import type { QuizQuestion, UserAnswer } from '../types';

interface ResultsViewProps {
  questions: QuizQuestion[];
  userAnswers: UserAnswer[];
  onRestart: () => void;
  categoryTitle: string;
}

const getOptionLetter = (option: string) => option.split(':')[0];

const ResultItem: React.FC<{ question: QuizQuestion; userAnswer: UserAnswer }> = ({ question, userAnswer }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const isCorrect = userAnswer.answer === question.correctAnswer;
    const allExplanations = [
        { option: question.correctAnswer, explanation: question.explanation, isCorrect: true },
        ...question.distractorExplanations.map(de => ({ ...de, isCorrect: false }))
    ].sort((a, b) => a.option.localeCompare(b.option));


    return (
        <div className="bg-gray-800 rounded-lg p-5 border border-gray-700">
            <p className="font-semibold text-gray-200 mb-4">{question.question}</p>
            <div className="space-y-2 mb-4">
                {question.options.map(option => {
                    const optionLetter = getOptionLetter(option);
                    const isUserAnswer = optionLetter === userAnswer.answer;
                    const isCorrectAnswer = optionLetter === question.correctAnswer;
                    
                    let bgColor = 'bg-gray-700';
                    if (isUserAnswer && isCorrectAnswer) bgColor = 'bg-green-800/60 border-green-500';
                    else if (isUserAnswer && !isCorrectAnswer) bgColor = 'bg-red-800/60 border-red-500';
                    else if (isCorrectAnswer) bgColor = 'bg-green-800/60 border-green-500';

                    return (
                        <div key={optionLetter} className={`p-3 rounded-md border ${bgColor} border-transparent`}>
                            {option}
                        </div>
                    );
                })}
            </div>
             <button onClick={() => setIsExpanded(!isExpanded)} className="text-indigo-400 hover:text-indigo-300 text-sm font-medium">
                {isExpanded ? 'Hide Explanation' : 'Show Explanation'}
            </button>
            {isExpanded && (
                <div className="mt-4 space-y-3 text-sm animate-fade-in">
                    {allExplanations.map(({ option, explanation, isCorrect }) => (
                         <div key={option}>
                            <p className={`font-bold ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                                Option {option}: {isCorrect ? 'Correct' : 'Incorrect'}
                            </p>
                            <p className="text-gray-400 ml-2">{explanation}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const ResultsView: React.FC<ResultsViewProps> = ({ questions, userAnswers, onRestart, categoryTitle }) => {
  const correctAnswersCount = userAnswers.filter(
    (ua, index) => ua.answer === questions[index].correctAnswer
  ).length;
  const score = (correctAnswersCount / questions.length) * 100;

  let scoreColor = 'text-green-400';
  if (score < 70) scoreColor = 'text-yellow-400';
  if (score < 40) scoreColor = 'text-red-400';

  return (
    <div className="min-h-screen p-4 sm:p-6 animate-fade-in">
      <div className="max-w-4xl mx-auto">
        <header className="text-center bg-gray-800 p-6 rounded-lg shadow-xl mb-8">
            <p className="text-indigo-400 font-semibold">{categoryTitle}</p>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white mt-1 mb-2">Quiz Results</h1>
            <p className={`text-5xl font-bold ${scoreColor}`}>{score.toFixed(0)}%</p>
            <p className="text-gray-300 mt-2">You answered {correctAnswersCount} out of {questions.length} questions correctly.</p>
            <button
                onClick={onRestart}
                className="mt-6 px-6 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-500 transition-colors duration-200"
            >
                Take Another Quiz
            </button>
        </header>

        <main className="space-y-4">
          {questions.map((question, index) => (
            <ResultItem key={index} question={question} userAnswer={userAnswers[index]} />
          ))}
        </main>
      </div>
    </div>
  );
};

export default ResultsView;
