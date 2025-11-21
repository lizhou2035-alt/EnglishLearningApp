import React from 'react';

interface HeaderProps {
  onReset: () => void;
  onOpenNotebook: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onReset, onOpenNotebook }) => {
  return (
    <header className="bg-surface shadow-sm sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2 cursor-pointer" onClick={onReset}>
          <span className="text-2xl">📚</span>
          <h1 className="text-xl font-bold text-gray-800 tracking-tight">LinguaFlow</h1>
        </div>
        <div className="flex items-center space-x-4">
          <button 
            onClick={onOpenNotebook}
            className="text-sm font-medium text-gray-600 hover:text-primary transition-colors flex items-center gap-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
            </svg>
            Notebook
          </button>
          <button 
            onClick={onReset}
            className="text-sm font-medium text-gray-500 hover:text-primary transition-colors"
          >
            New Session
          </button>
        </div>
      </div>
    </header>
  );
};