import React, { useState, useEffect, useRef } from 'react';
import { WordData, SentenceFeedback } from '../types';
import { generateSpeech, checkSentence } from '../services/geminiService';
import { decodeBase64, decodeAudioData, playAudioBuffer, getAudioContext } from '../services/audioUtils';

interface WordLearningProps {
  words: WordData[];
  onComplete: () => void;
  theme?: string;
}

export const WordLearning: React.FC<WordLearningProps> = ({ words, onComplete, theme }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [writeCount, setWriteCount] = useState(0);
  const [currentInput, setCurrentInput] = useState('');
  const [step, setStep] = useState<'learn' | 'write_word' | 'copy_sentence' | 'make_sentence'>('learn');
  
  // Interactive Syllable State
  const [userSplits, setUserSplits] = useState<Set<number>>(new Set());
  const [userStress, setUserStress] = useState<Set<number>>(new Set());
  
  const [sentenceInput, setSentenceInput] = useState('');
  const [feedback, setFeedback] = useState<SentenceFeedback | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [copyError, setCopyError] = useState<string | null>(null);

  const currentWord = words[currentIndex];
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const STEPS = ['learn', 'write_word', 'copy_sentence', 'make_sentence'] as const;

  // Reset state when word changes
  useEffect(() => {
    setUserSplits(new Set());
    setUserStress(new Set());
    setCopyError(null);
    
    // Scroll the active pill into view
    if (scrollRef.current) {
        const activeButton = scrollRef.current.children[currentIndex] as HTMLElement;
        if (activeButton) {
            activeButton.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
    }
  }, [currentIndex]);

  // Reset error when input changes
  useEffect(() => {
    setCopyError(null);
  }, [currentInput]);

  // Audio Auto-play Effect
  useEffect(() => {
    if (step === 'learn') {
      handlePlayAudio(currentWord.word);
    } else if (step === 'write_word') {
       if (writeCount === 0 || writeCount === 2) {
         handlePlayAudio(currentWord.word);
       }
    } else if (step === 'copy_sentence') {
       handlePlayAudio(currentWord.exampleSentence);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, step, writeCount]);

  const handlePlayAudio = async (text: string) => {
    if (isPlaying) return;
    setIsPlaying(true);
    try {
      const base64Audio = await generateSpeech(text);
      if (base64Audio) {
        const ctx = getAudioContext();
        const audioBuffer = await decodeAudioData(decodeBase64(base64Audio), ctx);
        playAudioBuffer(audioBuffer, () => setIsPlaying(false));
      } else {
        setIsPlaying(false);
      }
    } catch (e) {
      console.error(e);
      setIsPlaying(false);
    }
  };

  const handleWordInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentInput.toLowerCase().trim() === currentWord.word.toLowerCase()) {
      const newCount = writeCount + 1;
      setWriteCount(newCount);
      setCurrentInput('');
      if (newCount >= 3) {
        setStep('copy_sentence');
      }
    } else {
      alert("Incorrect spelling. Listen and try again!");
      handlePlayAudio(currentWord.word);
    }
  };

  const handleCopySentenceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const normalize = (s: string) => s.toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "").trim();
    
    const normalizedInput = normalize(currentInput);
    const normalizedTarget = normalize(currentWord.exampleSentence);

    if (normalizedInput === normalizedTarget) {
      setCurrentInput('');
      setStep('make_sentence');
      setCopyError(null);
    } else {
        const clean = (s: string) => s.toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, " ").trim();
        const targetWords = clean(currentWord.exampleSentence).split(/\s+/);
        const inputWords = clean(currentInput).split(/\s+/);
        
        let errorMsg = "The sentence is not quite right.";

        for (let i = 0; i < targetWords.length; i++) {
            if (!inputWords[i]) {
                errorMsg = `Missing word: It seems you stopped before "${targetWords[i]}".`;
                break;
            }
            if (inputWords[i] !== targetWords[i]) {
                errorMsg = `Typo detected: You wrote "${inputWords[i]}" but expected "${targetWords[i]}".`;
                break;
            }
        }
        
        if (errorMsg === "The sentence is not quite right." && inputWords.length > targetWords.length) {
             errorMsg = `Extra words detected: The sentence is longer than expected.`;
        }

        setCopyError(errorMsg);
    }
  };

  const handleMakeSentenceSubmit = async () => {
    if (!sentenceInput.trim()) return;
    setIsChecking(true);
    try {
      const result = await checkSentence(currentWord.word, sentenceInput);
      setFeedback(result);
    } catch (e) {
      console.error(e);
    } finally {
      setIsChecking(false);
    }
  };

  const handleNextWord = () => {
    if (currentIndex < words.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setStep('learn');
      resetStepState();
    } else {
      onComplete();
    }
  };
  
  const handleJumpTo = (index: number) => {
      setCurrentIndex(index);
      setStep('learn');
      resetStepState();
  };

  const resetStepState = () => {
     setWriteCount(0);
     setCurrentInput('');
     setSentenceInput('');
     setFeedback(null);
     setCopyError(null);
     setIsPlaying(false);
  };

  const goBack = () => {
    const currentStepIndex = STEPS.indexOf(step);
    if (currentStepIndex > 0) {
      setStep(STEPS[currentStepIndex - 1]);
      resetStepState();
    } else if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setStep(STEPS[STEPS.length - 1]); // Go to last step of prev word
      resetStepState();
    }
  };

  const goNext = () => {
    const currentStepIndex = STEPS.indexOf(step);
    if (currentStepIndex < STEPS.length - 1) {
      setStep(STEPS[currentStepIndex + 1]);
      resetStepState();
    } else {
       handleNextWord();
    }
  };

  // Syllable Interaction Handlers
  const toggleSplit = (index: number) => {
    const newSplits = new Set(userSplits);
    if (newSplits.has(index)) {
      newSplits.delete(index);
    } else {
      newSplits.add(index);
    }
    setUserSplits(newSplits);
  };

  const toggleStress = (index: number) => {
    const newStress = new Set(userStress);
    if (newStress.has(index)) {
      newStress.delete(index);
    } else {
      newStress.add(index);
    }
    setUserStress(newStress);
  };

  const showCorrectSyllables = () => {
    if (!currentWord.syllables) return;
    
    const syllableParts = currentWord.syllables.toLowerCase().split('-');
    let currentIndex = 0;
    const newSplits = new Set<number>();
    
    for (let i = 0; i < syllableParts.length - 1; i++) {
      currentIndex += syllableParts[i].length;
      newSplits.add(currentIndex - 1); 
    }
    setUserSplits(newSplits);
  };

  const progress = ((currentIndex + 1) / words.length) * 100;
  const isHiddenMode = step === 'write_word' && writeCount >= 2;

  return (
    <div className="max-w-6xl mx-auto w-full">
      {/* Navigation Header (Sticky) */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10 mb-6 -mt-6 shadow-sm">
           <div className="max-w-4xl mx-auto px-4 pt-4 pb-2">
               <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                      <span className="bg-blue-100 text-primary p-1.5 rounded-lg">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                             <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                         </svg>
                      </span>
                      <div>
                        <span className="text-xs font-bold text-gray-400 uppercase block">Review</span>
                        <span className="text-sm font-bold text-gray-800">{theme || "Vocabulary"}</span>
                      </div>
                  </div>
                  <div className="flex items-center gap-3">
                     <span className="text-sm font-bold text-primary">{currentIndex + 1} / {words.length}</span>
                     <button onClick={onComplete} className="text-gray-400 hover:text-gray-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                     </button>
                  </div>
               </div>
               
               {/* Progress Bar */}
               <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden mb-4">
                   <div className="h-full bg-primary transition-all duration-500 ease-out" style={{ width: `${progress}%` }} />
               </div>

               {/* Horizontal Word List */}
               <div className="flex overflow-x-auto gap-2 pb-2 no-scrollbar scroll-smooth" ref={scrollRef}>
                   {words.map((w, i) => (
                       <button 
                         key={i}
                         onClick={() => handleJumpTo(i)} 
                         className={`px-4 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all
                            ${i === currentIndex 
                                ? 'bg-gray-900 text-white shadow-md' 
                                : 'bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-gray-700'}
                         `}
                       >
                          {i + 1}- {w.word}
                       </button>
                   ))}
               </div>
           </div>
      </div>

      <div className="px-4 flex items-start justify-center gap-4">
        {/* Left Arrow */}
        <button 
            onClick={goBack}
            disabled={currentIndex === 0 && step === 'learn'}
            className="mt-32 hidden md:flex p-4 rounded-full text-gray-400 hover:bg-white hover:text-primary hover:shadow-md transition-all disabled:opacity-0 disabled:cursor-not-allowed"
            aria-label="Previous Step"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
        </button>

        <div className="w-full max-w-4xl">
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 min-h-[500px]">
            {/* Word Display */}
            <div className="flex justify-between items-start mb-8">
              <div className="w-full">
                
                {isHiddenMode ? (
                    <div className="mt-2 flex items-center space-x-3 justify-center py-8 animate-pulse">
                        <h2 className="text-5xl font-bold text-gray-300 tracking-widest">??????</h2>
                        <button 
                            onClick={() => handlePlayAudio(currentWord.word)}
                            className={`p-3 rounded-full bg-primary text-white shadow-lg hover:bg-primary/90 transition-transform transform hover:scale-110`}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                            </svg>
                          </button>
                    </div>
                ) : (
                    <div className="mt-4">
                        {/* Interactive Word Area */}
                        <div className="flex flex-col items-center">
                          
                          <div className="flex items-center select-none flex-wrap justify-center">
                            {currentWord.word.split('').map((char, idx, arr) => {
                              // Calculate which segment color to use
                              let segmentCount = 0;
                              for(let i=0; i<idx; i++) {
                                if (userSplits.has(i)) segmentCount++;
                              }
                              const segmentColor = segmentCount % 2 === 0 ? 'text-gray-800' : 'text-primary';
                              const isStressed = userStress.has(idx);

                              return (
                                <React.Fragment key={idx}>
                                  {/* The Character */}
                                  <span 
                                    onClick={() => toggleStress(idx)}
                                    className={`text-5xl md:text-6xl font-bold cursor-pointer transition-colors duration-300 hover:opacity-80
                                      ${isStressed ? 'text-[#F59E0B]' : segmentColor}
                                    `}
                                    title="Click to mark stress"
                                  >
                                    {char}
                                  </span>

                                  {/* The Splitter Gap */}
                                  {idx < arr.length - 1 && (
                                    <span 
                                      onClick={() => toggleSplit(idx)}
                                      className={`
                                        mx-1 cursor-pointer h-12 w-4 flex items-center justify-center text-2xl font-light transition-all
                                        ${userSplits.has(idx) ? 'text-gray-400' : 'text-transparent hover:text-gray-200'}
                                      `}
                                      title="Click to split syllable"
                                    >
                                      -
                                    </span>
                                  )}
                                </React.Fragment>
                              );
                            })}
                          </div>

                          {/* Controls for Interaction */}
                          {step === 'learn' && (
                            <div className="mt-4 flex gap-4 text-sm">
                                <button 
                                  onClick={showCorrectSyllables}
                                  className="text-primary hover:underline flex items-center gap-1"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                  </svg>
                                  Show Syllables
                                </button>
                                <button 
                                  onClick={() => { setUserSplits(new Set()); setUserStress(new Set()); }}
                                  className="text-gray-400 hover:text-gray-600"
                                >
                                  Reset
                                </button>
                            </div>
                          )}

                        </div>

                        <div className="flex items-center justify-center mt-6 space-x-3">
                            {currentWord.partOfSpeech && (
                              <span className="text-xs font-bold text-white bg-gray-400 px-2 py-1 rounded uppercase">
                                {currentWord.partOfSpeech}
                              </span>
                            )}
                            <span className="text-gray-500 font-mono text-lg">/{currentWord.phonetic}/</span>
                            <button 
                                onClick={() => handlePlayAudio(currentWord.word)}
                                className={`p-2 rounded-full bg-blue-50 text-primary hover:bg-blue-100 transition-colors ${isPlaying ? 'animate-pulse' : ''}`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                )}
              </div>
              <div className="text-right absolute right-8 top-8 hidden md:block">
                <span className="inline-block px-3 py-1 rounded-full bg-green-50 text-secondary text-sm font-medium">
                    {step === 'learn' && 'Learn'}
                    {step === 'write_word' && 'Drill'}
                    {step === 'copy_sentence' && 'Copy'}
                    {step === 'make_sentence' && 'Create'}
                </span>
              </div>
            </div>

            {/* Definition Section */}
            <div className="mb-8 p-6 bg-gray-50 rounded-xl">
              <p className="text-xl text-gray-800 font-medium">{currentWord.definition}</p>
              <p className="text-gray-500 mt-1">{currentWord.translation}</p>
            </div>

            {/* Interaction Area */}
            <div className="space-y-6">
              
              {/* Step 1: Learn */}
              {step === 'learn' && (
                <div className="text-center space-y-4">
                  <p className="text-sm text-gray-400">
                    Tip: Click between letters to split syllables. Click a letter to mark stress.
                  </p>
                  <button 
                    onClick={() => {
                      setStep('write_word');
                      resetStepState();
                    }}
                    className="bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-transform hover:scale-105"
                  >
                    Start Copying & Spelling
                  </button>
                </div>
              )}

              {/* Step 2: Write Word 3 Times */}
              {step === 'write_word' && (
                <div>
                    <p className="mb-2 text-gray-600">
                      {writeCount < 2 ? (
                          <span>Copy the word <span className="font-bold">({writeCount + 1}/3)</span>:</span>
                      ) : (
                          <span>Listen and write from memory <span className="font-bold">({writeCount + 1}/3)</span>:</span>
                      )}
                    </p>
                    <form onSubmit={handleWordInputSubmit}>
                        <input
                            ref={inputRef}
                            type="text"
                            value={currentInput}
                            onChange={(e) => setCurrentInput(e.target.value)}
                            placeholder={writeCount < 2 ? "Copy the word..." : "Type what you hear..."}
                            autoFocus
                            className="w-full p-4 border-2 border-gray-300 rounded-lg text-xl focus:border-primary outline-none"
                            autoComplete="off"
                        />
                        <div className="flex gap-2 mt-2 justify-center">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className={`h-2 w-8 rounded-full ${i < writeCount ? 'bg-green-500' : 'bg-gray-200'}`} />
                            ))}
                        </div>
                    </form>
                </div>
              )}

              {/* Step 3: Copy Sentence */}
              {step === 'copy_sentence' && (
                <div>
                    <div className="mb-4">
                        <p className="text-sm text-gray-500 uppercase font-bold mb-1">Example Sentence</p>
                        <div className="flex items-center gap-2 mb-2">
                            <p className="text-lg font-medium text-gray-800">{currentWord.exampleSentence}</p>
                            <button 
                                onClick={() => handlePlayAudio(currentWord.exampleSentence)} 
                                className={`p-2 rounded-full text-primary hover:bg-blue-50 transition-colors ${isPlaying ? 'bg-blue-50' : ''}`}
                                title="Play Sentence Audio"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                                </svg>
                            </button>
                        </div>
                        <p className="text-gray-500 italic">{currentWord.exampleTranslation}</p>
                    </div>
                    <p className="mb-2 text-gray-600">Type the example sentence above:</p>
                    <form onSubmit={handleCopySentenceSubmit}>
                        <input
                            type="text"
                            value={currentInput}
                            onChange={(e) => setCurrentInput(e.target.value)}
                            placeholder="Type the sentence..."
                            autoFocus
                            className={`w-full p-4 border-2 rounded-lg focus:outline-none ${copyError ? 'border-red-300 bg-red-50 focus:border-red-500' : 'border-gray-300 focus:border-primary'}`}
                            autoComplete="off"
                        />
                        {copyError && (
                            <div className="mt-2 text-red-600 text-sm font-medium flex items-start gap-1 animate-fade-in">
                                <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>{copyError}</span>
                            </div>
                        )}
                    </form>
                </div>
              )}

              {/* Step 4: Make Sentence */}
              {step === 'make_sentence' && (
                <div className="animate-fade-in">
                    <p className="mb-2 text-gray-600 font-medium">Create your own sentence using <span className="font-bold text-primary">"{currentWord.word}"</span>:</p>
                    <textarea
                        value={sentenceInput}
                        onChange={(e) => setSentenceInput(e.target.value)}
                        placeholder="e.g. I really need to..."
                        className="w-full p-4 border-2 border-gray-300 rounded-lg focus:border-primary outline-none min-h-[100px]"
                        disabled={isChecking || feedback?.isCorrect}
                    />
                    
                    {!feedback && (
                        <button 
                            onClick={handleMakeSentenceSubmit}
                            disabled={!sentenceInput.trim() || isChecking}
                            className="mt-4 w-full bg-accent text-white font-bold py-3 rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-50"
                        >
                            {isChecking ? 'Checking...' : 'Check My Sentence'}
                        </button>
                    )}

                    {feedback && (
                        <div className={`mt-4 p-4 rounded-lg border ${feedback.isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                            <div className="flex items-center gap-2 mb-2">
                                {feedback.isCorrect ? (
                                    <span className="text-green-600 font-bold flex items-center">
                                        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                        Excellent!
                                    </span>
                                ) : (
                                    <span className="text-red-600 font-bold flex items-center">
                                        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                        Needs Improvement
                                    </span>
                                )}
                            </div>
                            <p className="text-gray-700 mb-2">{feedback.explanation}</p>
                            {feedback.correctedSentence && (
                                <div className="bg-white p-3 rounded border border-gray-200">
                                    <span className="text-xs text-gray-500 uppercase font-bold">Correction</span>
                                    <p className="text-gray-900 font-medium">{feedback.correctedSentence}</p>
                                </div>
                            )}
                            
                            <button 
                                onClick={handleNextWord}
                                className="mt-4 w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-primary/90 transition-colors"
                            >
                                {currentIndex < words.length - 1 ? 'Next Word' : 'Finish Vocabulary'}
                            </button>
                        </div>
                    )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Arrow */}
        <button 
            onClick={goNext}
            className="mt-32 hidden md:flex p-4 rounded-full text-gray-400 hover:bg-white hover:text-primary hover:shadow-md transition-all"
            aria-label="Next Step"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
        </button>
      </div>
    </div>
  );
};