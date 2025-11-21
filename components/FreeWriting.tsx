import React, { useState } from 'react';
import { WritingFeedback, WordData } from '../types';
import { reviewWriting } from '../services/geminiService';

interface FreeWritingProps {
  theme: string;
  words: WordData[];
  onRestart: () => void;
  onRetry: (words: WordData[]) => void;
}

export const FreeWriting: React.FC<FreeWritingProps> = ({ theme, words, onRestart, onRetry }) => {
  const [text, setText] = useState('');
  const [isReviewing, setIsReviewing] = useState(false);
  const [feedback, setFeedback] = useState<WritingFeedback | null>(null);
  const [selectedWords, setSelectedWords] = useState<Set<string>>(new Set());
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const ITEMS_PER_PAGE = 6;

  const handleSubmit = async () => {
    if (!text.trim()) return;
    setIsReviewing(true);
    try {
      const result = await reviewWriting(theme, text);
      setFeedback(result);
    } catch (e) {
      console.error(e);
    } finally {
      setIsReviewing(false);
    }
  };

  const toggleWordSelection = (word: string) => {
    const newSet = new Set(selectedWords);
    if (newSet.has(word)) {
        newSet.delete(word);
    } else {
        newSet.add(word);
    }
    setSelectedWords(newSet);
  };

  const handlePracticeSelected = () => {
      const wordsToPractice = words.filter(w => selectedWords.has(w.word));
      onRetry(wordsToPractice);
  };

  // Pagination logic
  const totalPages = Math.ceil(words.length / ITEMS_PER_PAGE);
  const currentWords = words.slice(currentPage * ITEMS_PER_PAGE, (currentPage + 1) * ITEMS_PER_PAGE);

  const handlePrevPage = () => setCurrentPage(p => Math.max(0, p - 1));
  const handleNextPage = () => setCurrentPage(p => Math.min(totalPages - 1, p + 1));

  return (
    <div className="max-w-4xl mx-auto w-full">
      {!feedback ? (
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Final Challenge: Free Writing</h2>
          <p className="text-gray-500 mb-6">Write a short paragraph (3-5 sentences) about <span className="font-bold text-gray-800">"{theme}"</span> using the words you just learned.</p>
          
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full h-64 p-5 border-2 border-gray-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-lg transition-all resize-none"
            placeholder="Start writing here..."
            disabled={isReviewing}
          />

          <div className="mt-6 flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={!text.trim() || isReviewing}
              className="bg-accent text-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md"
            >
              {isReviewing ? 'Analyzing...' : 'Submit for Review'}
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-8 animate-fade-in pb-20">
          {/* Score Card */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-primary px-8 py-6 text-white flex justify-between items-center">
               <div>
                 <h2 className="text-2xl font-bold">Writing Feedback</h2>
                 <p className="opacity-90">Here is how you did</p>
               </div>
               <div className="text-center">
                 <div className="text-4xl font-black">{feedback.score}</div>
                 <div className="text-xs uppercase tracking-widest opacity-75">Score</div>
               </div>
            </div>
            
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <h3 className="text-gray-400 uppercase text-xs font-bold tracking-wider mb-3">AI Critique</h3>
                    <p className="text-gray-700 leading-relaxed">{feedback.critique}</p>
                </div>
                <div>
                    <h3 className="text-gray-400 uppercase text-xs font-bold tracking-wider mb-3">Your Text</h3>
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-gray-600 italic">
                        "{text}"
                    </div>
                </div>
            </div>
          </div>

          {/* Improved Version */}
          <div className="bg-green-50 rounded-2xl border border-green-100 p-8 shadow-sm">
             <h3 className="text-green-800 font-bold text-lg mb-4 flex items-center">
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Better Way to Say It
             </h3>
             <p className="text-xl text-gray-800 font-medium leading-relaxed">
                {feedback.improvedVersion}
             </p>
          </div>
          
          {/* Word Review Section - Always Visible */}
          <div className="mt-12 pt-8 border-t border-gray-200">
              <h3 className="text-xl font-bold text-gray-800 mb-2 text-center">Session Vocabulary Review</h3>
              <p className="text-gray-400 text-sm mb-8 text-center">Review learned words and add difficult ones to your notebook.</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                  {currentWords.map((w, idx) => {
                      const isSelected = selectedWords.has(w.word);
                      // Calculate actual index for numbering
                      const actualIndex = currentPage * ITEMS_PER_PAGE + idx;
                      return (
                          <div 
                            key={actualIndex} 
                            onClick={() => toggleWordSelection(w.word)}
                            className={`relative p-5 rounded-xl border-2 cursor-pointer transition-all ${isSelected ? 'border-primary bg-blue-50' : 'border-gray-300 bg-transparent hover:border-primary/50 hover:bg-white/50'}`}
                          >
                              <div className="flex justify-between items-start mb-2">
                                  <h4 className="font-bold text-lg text-gray-800">{w.word}</h4>
                                  <div className={`p-1 rounded-full ${isSelected ? 'text-primary' : 'text-gray-300'}`}>
                                       <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                                           <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                                       </svg>
                                  </div>
                              </div>
                              <p className="text-gray-500 text-sm mb-1">/{w.phonetic}/</p>
                              <p className="text-gray-700 text-sm line-clamp-2">{w.translation}</p>
                              
                              <div className="absolute bottom-2 right-3 text-xs font-bold text-gray-400 select-none pointer-events-none">
                                  {actualIndex + 1}
                              </div>
                          </div>
                      );
                  })}
              </div>
              
              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-6 mb-10">
                    <button 
                        onClick={handlePrevPage} 
                        disabled={currentPage === 0}
                        className="p-3 rounded-full bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed shadow-sm transition-all"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    
                    <div className="flex gap-2">
                        {[...Array(totalPages)].map((_, i) => (
                            <div 
                                key={i} 
                                className={`w-2.5 h-2.5 rounded-full transition-all ${i === currentPage ? 'bg-primary scale-125' : 'bg-gray-300'}`}
                            />
                        ))}
                    </div>

                    <button 
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages - 1}
                        className="p-3 rounded-full bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed shadow-sm transition-all"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
              )}
              
              <div className="flex flex-col items-center gap-6">
                  {selectedWords.size > 0 && (
                      <button 
                        onClick={handlePracticeSelected}
                        className="bg-emerald-500 text-white px-8 py-4 rounded-full text-lg font-bold shadow-xl hover:bg-emerald-600 hover:-translate-y-1 transition-all flex items-center gap-2 animate-bounce-subtle w-full max-w-md justify-center"
                      >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                              <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Add {selectedWords.size} Words to Notebook & Learn
                      </button>
                  )}

                  <button
                   onClick={onRestart}
                   className="text-gray-500 bg-white border border-gray-200 px-8 py-3 rounded-full font-medium hover:border-primary hover:text-primary hover:bg-blue-50 transition-all"
                  >
                   Start New Topic
                  </button>
              </div>
          </div>
        </div>
      )}
    </div>
  );
};