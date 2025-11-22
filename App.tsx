import React, { useState, useMemo } from 'react';
import Sidebar from './components/Sidebar';
import Flashcard from './components/Flashcard';
import { MOCK_DATA } from './constants';
import { Menu, X, Trophy } from 'lucide-react';

const App: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentGroupId, setCurrentGroupId] = useState<string>('grp_nature_1');
  const [currentGroupName, setCurrentGroupName] = useState<string>('Group 1');
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [score, setScore] = useState(0);

  // Flatten words logic based on current group
  const currentWords = useMemo(() => {
    let words: any[] = [];
    MOCK_DATA.forEach(cat => {
        cat.subcategories.forEach(sub => {
            sub.groups.forEach(grp => {
                if (grp.id === currentGroupId) {
                    words = grp.words;
                }
            });
        });
    });
    // Fallback
    if (words.length === 0) return MOCK_DATA[0].subcategories[0].groups[0].words;
    return words;
  }, [currentGroupId]);

  const handleGroupSelect = (groupId: string, groupName: string) => {
    setCurrentGroupId(groupId);
    setCurrentGroupName(groupName);
    setCurrentWordIndex(0);
    setSidebarOpen(false); // Close sidebar on mobile on selection
  };

  const handleNext = () => {
    if (currentWordIndex < currentWords.length - 1) {
        setCurrentWordIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentWordIndex > 0) {
        setCurrentWordIndex(prev => prev - 1);
    }
  };

  const addPoints = (points: number) => {
    setScore(prev => prev + points);
  };

  return (
    <div className="flex h-screen w-screen bg-slate-950 text-white overflow-hidden font-sans">
      
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar Container (Mobile Absolute, Desktop Relative) */}
      <div className={`
        fixed md:relative z-50 h-full transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
         <Sidebar 
            data={MOCK_DATA} 
            currentGroupId={currentGroupId}
            onSelectGroup={handleGroupSelect}
            isOpen={true} 
         />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Header */}
        <header className="h-16 border-b border-slate-800 flex items-center justify-between px-4 md:px-8 bg-slate-900/80 backdrop-blur-sm">
            <div className="flex items-center gap-4">
                <button 
                    className="md:hidden p-2 text-slate-400 hover:text-white"
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                >
                    {sidebarOpen ? <X /> : <Menu />}
                </button>
                <h2 className="text-lg font-medium text-slate-200 hidden md:block">
                    {currentGroupName}
                </h2>
            </div>

            <div className="flex items-center gap-6">
                {/* Score Display */}
                <div className="flex items-center gap-2 bg-slate-800/50 px-3 py-1 rounded-full border border-yellow-500/20">
                    <Trophy size={16} className="text-yellow-500" />
                    <span className="text-yellow-400 font-bold">{score}</span>
                    <span className="text-xs text-slate-500">pts</span>
                </div>

                <div className="flex items-center gap-3">
                    <span className="text-sm text-slate-400 hidden sm:inline">Progress:</span>
                    <div className="flex items-center bg-slate-800 rounded-full px-4 py-1 border border-slate-700">
                        <span className="text-primary font-bold">{currentWordIndex + 1}</span>
                        <span className="text-slate-500 mx-1">/</span>
                        <span className="text-slate-400">{currentWords.length}</span>
                    </div>
                </div>
            </div>
        </header>

        {/* Main Learning Area */}
        <main className="flex-1 overflow-y-auto relative bg-gradient-to-b from-slate-950 to-slate-900">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-30 pointer-events-none"></div>
            
            <Flashcard 
                wordData={currentWords[currentWordIndex]}
                onNext={handleNext}
                onPrev={handlePrev}
                isFirst={currentWordIndex === 0}
                isLast={currentWordIndex === currentWords.length - 1}
                addPoints={addPoints}
                totalScore={score}
            />
        </main>

      </div>
    </div>
  );
};

export default App;