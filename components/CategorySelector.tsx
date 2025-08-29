
import React from 'react';
import type { Category } from '../types';
import { EXAM_CATEGORIES } from '../constants';

interface CategorySelectorProps {
  onSelectCategory: (category: Category) => void;
}

const CategoryCard: React.FC<{ category: Category; onSelect: () => void }> = ({ category, onSelect }) => (
    <div 
        onClick={onSelect}
        className="bg-gray-800 rounded-lg shadow-lg p-6 flex flex-col justify-between hover:bg-indigo-900/50 hover:shadow-indigo-500/30 transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
    >
        <div>
            <h3 className="text-xl font-bold text-indigo-400 mb-2">{category.title}</h3>
            <p className="text-gray-400 text-sm">{category.description}</p>
        </div>
        <button className="mt-6 w-full bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-500 transition-colors duration-200 self-end">
            Start Quiz
        </button>
    </div>
);


const CategorySelector: React.FC<CategorySelectorProps> = ({ onSelectCategory }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 animate-fade-in">
        <header className="text-center mb-10">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-2">GCP Architect Exam Prep</h1>
            <p className="text-lg text-gray-400">Select a category to start your practice quiz.</p>
        </header>
        <main className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {EXAM_CATEGORIES.map(category => (
                <CategoryCard key={category.id} category={category} onSelect={() => onSelectCategory(category)} />
            ))}
        </main>
        <footer className="text-center mt-12 text-gray-500 text-sm">
            <p>Powered by Google Gemini</p>
        </footer>
    </div>
  );
};

export default CategorySelector;
