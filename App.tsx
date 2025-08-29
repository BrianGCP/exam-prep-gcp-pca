
import React, { useState, useCallback } from 'react';
import CategorySelector from './components/CategorySelector';
import QuizView from './components/QuizView';
import ResultsView from './components/ResultsView';
import LoadingSpinner from './components/LoadingSpinner';
import { generateQuiz } from './services/geminiService';
import { AppView } from './types';
import type { Category, QuizQuestion, UserAnswer } from './types';

const App: React.FC = () => {
    const [currentView, setCurrentView] = useState<AppView>(AppView.CATEGORY_SELECTION);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [questions, setQuestions] = useState<QuizQuestion[]>([]);
    const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleSelectCategory = useCallback(async (category: Category) => {
        setIsLoading(true);
        setError(null);
        setSelectedCategory(category);
        try {
            const fetchedQuestions = await generateQuiz(category.topics);
            if (fetchedQuestions && fetchedQuestions.length > 0) {
                setQuestions(fetchedQuestions);
                setCurrentView(AppView.QUIZ);
            } else {
                setError("No questions were generated. Please try a different category.");
                setCurrentView(AppView.CATEGORY_SELECTION);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "An unknown error occurred.");
            setCurrentView(AppView.CATEGORY_SELECTION);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleSubmitQuiz = useCallback((answers: UserAnswer[]) => {
        setUserAnswers(answers);
        setCurrentView(AppView.RESULTS);
    }, []);

    const handleRestart = useCallback(() => {
        setCurrentView(AppView.CATEGORY_SELECTION);
        setSelectedCategory(null);
        setQuestions([]);
        setUserAnswers([]);
        setError(null);
    }, []);

    const renderContent = () => {
        switch (currentView) {
            case AppView.QUIZ:
                return (
                    <QuizView 
                        questions={questions} 
                        onSubmitQuiz={handleSubmitQuiz} 
                        categoryTitle={selectedCategory?.title || ''}
                    />
                );
            case AppView.RESULTS:
                return (
                    <ResultsView 
                        questions={questions} 
                        userAnswers={userAnswers} 
                        onRestart={handleRestart}
                        categoryTitle={selectedCategory?.title || ''}
                    />
                );
            case AppView.CATEGORY_SELECTION:
            default:
                return <CategorySelector onSelectCategory={handleSelectCategory} />;
        }
    };
    
    return (
        <div className="relative">
            {isLoading && <LoadingSpinner message="Generating your custom quiz with AI..." />}
            {error && (
                <div className="bg-red-800/90 text-white p-4 text-center fixed top-0 left-0 right-0 z-50 animate-fade-in">
                    <p>
                        <strong>Error:</strong> {error}
                        <button onClick={() => setError(null)} className="ml-4 font-bold text-lg">&times;</button>
                    </p>
                </div>
            )}
            {renderContent()}
        </div>
    );
};

export default App;
