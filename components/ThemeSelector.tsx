import React, { useState } from 'react';
import { DifficultyLevel, LearningSession } from '../types';

interface ThemeSelectorProps {
  onSelectTheme: (theme: string, difficulty: DifficultyLevel) => void;
  onStartCustom: (words: string) => void;
  history: LearningSession[];
  onLoadSession: (session: LearningSession) => void;
  isLoading: boolean;
}

const SUGGESTIONS = [
  "Environment & Pollution",
  "Education & Technology",
  "Globalization",
  "Urbanization",
  "Health & Diet",
  "Art & Culture",
  "Work & Careers",
  "Travel & Tourism"
];

const DEFAULT_CATEGORIES = [
  "Daily Conversation", "Travel & Adventure", "Business English", "Food & Cooking",
  "Health & Wellness", "Science & Tech", "Nature & Environment", "Arts & Literature",
  "Job Interview", "Academic Study", "Sports & Hobbies", "Movies & Music",
  "Family & Friends", "Fashion & Style", "House & Home", "Social Issues",
  "History & Culture", "Emotions & Personality", "Law & Politics", "Internet & Social Media"
];

const CEFR_LEVELS: DifficultyLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
const EXAM_LEVELS: DifficultyLevel[] = ['IELTS', 'TOEFL', 'SAT'];

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({ 
  onSelectTheme, 
  onStartCustom,
  history,
  onLoadSession,
  isLoading 
}) => {
  const [input, setInput] = useState('');
  const [customWordsInput, setCustomWordsInput] = useState('');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('B2');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) onSelectTheme(input.trim(), difficulty);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customWordsInput.trim()) onStartCustom(customWordsInput);
  };

  const handleDifficultyClick = (level: DifficultyLevel) => {
    setDifficulty(level);
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="w-full max-w-4xl space-y-10 text-center">
        <div>
          <h2 className="text-4xl font-extrabold text-gray-900 mb-2">Vocabulary Builder</h2>
          <p className="text-gray-500 text-lg">Select your proficiency level and a topic, or create your own list.</p>
        </div>

        <div className="space-y-8 bg-white p-8 rounded-3xl border border-gray-100 shadow-xl">
            {/* Difficulty Selector */}
            <div className="space-y-4">
                <div>
                    <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">1. Select Level</span>
                    <div className="flex flex-wrap justify-center gap-2">
                        {CEFR_LEVELS.map((level) => (
                        <button
                            key={level}
                            type="button"
                            onClick={() => handleDifficultyClick(level)}
                            className={`w-10 h-10 rounded-full text-xs font-bold transition-all duration-200 border-2 ${
                            difficulty === level
                                ? 'bg-primary text-white border-primary shadow-md scale-110'
                                : 'bg-white text-gray-500 border-gray-200 hover:border-primary/50 hover:text-primary'
                            }`}
                            disabled={isLoading}
                        >
                            {level}
                        </button>
                        ))}
                         <div className="w-px h-10 bg-gray-200 mx-2"></div>
                         {EXAM_LEVELS.map((level) => (
                            <button
                                key={level}
                                type="button"
                                onClick={() => handleDifficultyClick(level)}
                                className={`px-3 py-2 rounded-full text-xs font-bold transition-all duration-200 border-2 ${
                                difficulty === level
                                    ? 'bg-accent text-white border-accent shadow-md transform scale-105'
                                    : 'bg-white text-gray-500 border-gray-200 hover:border-accent/50 hover:text-accent'
                                }`}
                                disabled={isLoading}
                            >
                                {level}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <hr className="border-gray-100" />

            {/* Topic Input */}
            <form onSubmit={handleSubmit} className="relative max-w-xl mx-auto">
                 <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">2. Choose Topic</span>
                <div className="relative">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Enter a topic (e.g., Space Exploration)"
                        className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-full focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all shadow-sm placeholder-gray-400"
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || isLoading}
                        className="absolute right-2 top-2 bottom-2 bg-primary text-white px-6 rounded-full font-bold hover:bg-primary/90 disabled:opacity-50 transition-all shadow-sm"
                    >
                         {isLoading ? '...' : 'Generate'}
                    </button>
                </div>
                <div className="flex flex-wrap justify-center gap-2 mt-3">
                    {SUGGESTIONS.slice(0, 4).map((topic) => (
                        <button
                            key={topic}
                            type="button"
                            onClick={() => onSelectTheme(topic, difficulty)}
                            disabled={isLoading}
                            className="text-xs text-gray-500 hover:text-primary underline decoration-dotted"
                        >
                            {topic}
                        </button>
                    ))}
                </div>
            </form>
            
            <div className="flex items-center gap-4">
                <div className="h-px bg-gray-200 flex-1"></div>
                <span className="text-gray-400 font-bold text-sm">OR</span>
                <div className="h-px bg-gray-200 flex-1"></div>
            </div>

            {/* Custom Words Input */}
            <form onSubmit={handleCustomSubmit} className="max-w-xl mx-auto">
                <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Paste Your Own Words</span>
                <div className="relative">
                    <textarea
                        value={customWordsInput}
                        onChange={(e) => setCustomWordsInput(e.target.value)}
                        placeholder="Enter words separated by commas, spaces, or new lines...&#10;(e.g. ephemeral, serendipity, oblivion)"
                        className="w-full px-6 py-4 text-base border-2 border-gray-200 rounded-2xl focus:border-secondary focus:ring-4 focus:ring-secondary/10 outline-none transition-all shadow-sm placeholder-gray-400 min-h-[100px] resize-none"
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        disabled={!customWordsInput.trim() || isLoading}
                        className="mt-2 w-full bg-secondary text-white py-3 rounded-xl font-bold hover:bg-secondary/90 disabled:opacity-50 transition-all shadow-sm flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        ) : (
                            <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                            </svg>
                            Create Custom Lesson
                            </>
                        )}
                    </button>
                </div>
            </form>

            {/* 20 Default Categories */}
            <div className="pt-6">
                <div className="flex items-center gap-4 mb-6">
                    <div className="h-px bg-gray-100 flex-1"></div>
                    <span className="text-gray-400 font-bold text-xs uppercase tracking-wider">Quick Select Categories</span>
                    <div className="h-px bg-gray-100 flex-1"></div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
                    {DEFAULT_CATEGORIES.map((category) => (
                        <button
                            key={category}
                            onClick={() => onSelectTheme(category, difficulty)}
                            disabled={isLoading}
                            className="px-2 py-2.5 rounded-xl border border-gray-100 bg-gray-50 text-gray-600 text-xs font-semibold hover:bg-primary hover:text-white hover:border-primary hover:shadow-md transition-all duration-200 truncate"
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </div>
        </div>

        {/* History Snippet */}
        {history.length > 0 && (
            <div className="pt-8">
                 <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Recent Sessions</h3>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto">
                     {history.slice(0, 4).map(session => (
                         <button 
                            key={session.id}
                            onClick={() => onLoadSession(session)}
                            className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 hover:border-primary hover:shadow-md transition-all text-left group"
                         >
                             <div>
                                 <div className="font-bold text-gray-800 group-hover:text-primary truncate max-w-[200px]">{session.theme}</div>
                                 <div className="text-xs text-gray-500">{session.words.length} words • {session.difficulty}</div>
                             </div>
                             <div className="text-gray-300 group-hover:text-primary">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                </svg>
                             </div>
                         </button>
                     ))}
                 </div>
            </div>
        )}

      </div>
    </div>
  );
};