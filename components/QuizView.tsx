
import React, { useState, useEffect } from 'react';
import type { QuizQuestion, UserAnswer } from '../types';

interface QuizViewProps {
  questions: QuizQuestion[];
  onSubmitQuiz: (answers: UserAnswer[]) => void;
  categoryTitle: string;
}

const QuizView: React.FC<QuizViewProps> = ({ questions, onSubmitQuiz, categoryTitle }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);

  const currentQuestion = questions[currentQuestionIndex];
  const progressPercentage = ((currentQuestionIndex + 1) / questions.length) * 100;

  const handleSelectAnswer = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const handleNext = () => {
    if (selectedAnswer) {
      const newAnswers = [...userAnswers, { questionIndex: currentQuestionIndex, answer: selectedAnswer.split(':')[0] }];
      setUserAnswers(newAnswers);
      setSelectedAnswer(null);

      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        onSubmitQuiz(newAnswers);
      }
    }
  };
  
  // Fade in animation for each new question
  const [key, setKey] = useState(0);
  useEffect(() => {
    setKey(prevKey => prevKey + 1);
  }, [currentQuestionIndex]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-3xl bg-gray-800 rounded-lg shadow-2xl p-6 md:p-8">
        <div className="mb-6">
          <p className="text-indigo-400 font-semibold mb-1">{categoryTitle}</p>
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-bold">Question {currentQuestionIndex + 1} of {questions.length}</h2>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2.5">
            <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${progressPercentage}%`, transition: 'width 0.3s ease-in-out' }}></div>
          </div>
        </div>

        <div key={key} className="animate-fade-in">
            <p className="text-lg leading-relaxed mb-6 text-gray-200">{currentQuestion.question}</p>
            <div className="space-y-4">
            {currentQuestion.options.map((option, index) => (
                <button
                key={index}
                onClick={() => handleSelectAnswer(option)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
                    selectedAnswer === option
                    ? 'bg-indigo-600 border-indigo-500 shadow-lg'
                    : 'bg-gray-700 border-gray-600 hover:bg-gray-600/50 hover:border-indigo-700'
                }`}
                >
                <span className="font-medium text-gray-100">{option}</span>
                </button>
            ))}
            </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            onClick={handleNext}
            disabled={!selectedAnswer}
            className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-500 transition-colors duration-200 disabled:bg-gray-600 disabled:cursor-not-allowed"
          >
            {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Submit Answers'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizView;
