import React, { useState, useEffect } from 'react';
import { ArticleData } from '../types';
import { generateSpeech } from '../services/geminiService';
import { decodeBase64, decodeAudioData, playAudioBuffer, getAudioContext } from '../services/audioUtils';

interface ArticleViewProps {
  article: ArticleData;
  onComplete: () => void;
  highlightWords?: string[];
}

export const ArticleView: React.FC<ArticleViewProps> = ({ article, onComplete, highlightWords = [] }) => {
  const [mode, setMode] = useState<'read' | 'dictation'>('read');
  const [isPlaying, setIsPlaying] = useState(false);
  const [userTranscript, setUserTranscript] = useState('');
  const [showTranslation, setShowTranslation] = useState(false);

  const handlePlayAudio = async () => {
    if (isPlaying) return;
    setIsPlaying(true);
    try {
      const base64Audio = await generateSpeech(`${article.title}. ${article.content}`);
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

  const renderContent = (text: string) => {
    if (!highlightWords.length) return text;

    const uniqueWords = Array.from(new Set(highlightWords.map(w => w.toLowerCase())));
    // Create regex that matches whole words, case insensitive
    // We escape special regex chars just in case, though strictly word chars usually don't need it
    const safeWords = uniqueWords.map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    const regex = new RegExp(`\\b(${safeWords.join('|')})\\b`, 'gi');

    const parts = text.split(regex);

    return parts.map((part, i) => {
      if (uniqueWords.includes(part.toLowerCase())) {
        return (
          <span 
            key={i} 
            className="text-blue-600 underline font-bold decoration-blue-300 decoration-2 underline-offset-2"
          >
            {part}
          </span>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <div className="max-w-4xl mx-auto w-full space-y-6">
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <h2 className="text-2xl font-bold text-gray-900">{article.title}</h2>
          <div className="flex gap-2">
             <button 
                onClick={handlePlayAudio}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border border-primary text-primary hover:bg-blue-50 transition-colors ${isPlaying ? 'ring-2 ring-primary ring-opacity-50' : ''}`}
             >
                {isPlaying ? (
                   <>
                    <span className="animate-pulse">Playing...</span>
                   </>
                ) : (
                   <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                    Listen
                   </>
                )}
             </button>
             <button
                onClick={() => setMode(mode === 'read' ? 'dictation' : 'read')}
                className="px-4 py-2 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium"
             >
                {mode === 'read' ? 'Switch to Dictation' : 'Switch to Reading'}
             </button>
          </div>
        </div>

        {mode === 'read' ? (
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-800 leading-relaxed whitespace-pre-line">
              {renderContent(article.content)}
            </p>
            
            <button 
              onClick={() => setShowTranslation(!showTranslation)}
              className="mt-6 text-sm text-gray-500 hover:text-gray-700 underline"
            >
              {showTranslation ? 'Hide Translation' : 'Show Translation'}
            </button>
            
            {showTranslation && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-gray-600">{article.translation}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
             <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <p className="text-blue-800 text-sm">
                  <span className="font-bold">Challenge:</span> Listen to the audio and type the article below. Don't worry about perfect punctuation, focus on the words.
                </p>
             </div>
             <textarea
                value={userTranscript}
                onChange={(e) => setUserTranscript(e.target.value)}
                className="w-full h-64 p-4 border-2 border-gray-300 rounded-lg focus:border-primary outline-none font-mono text-base"
                placeholder="Type what you hear..."
             />
             <div className="flex justify-end">
                <button 
                  onClick={() => setMode('read')} 
                  className="text-sm text-gray-500 hover:text-primary"
                >
                    Show Original Text to Check
                </button>
             </div>
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <button 
          onClick={onComplete}
          className="bg-primary text-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
        >
          Proceed to Final Writing Task &rarr;
        </button>
      </div>
    </div>
  );
};
