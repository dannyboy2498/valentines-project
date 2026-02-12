import React, { useState } from 'react';
import useTimeGate from './hooks/useTimeGate';
import CountdownScreen from './components/CountdownScreen';
import QuestionScreen from './components/QuestionScreen';
import Dashboard from './components/Dashboard';

function App() {
  // CONFIGURATION
  // -----------------------------------------------------------------
  // The hook now handles the Ecuador (UTC-5) timezone logic internally.
  const TARGET_DATE = '2026-02-14T00:00:00-05:00';

  // BYPASS LOGIC:
  // Use ?debug=true in URL to skip the countdown for testing.
  const urlParams = new URLSearchParams(window.location.search);
  const isForcedUnlock = urlParams.get('debug') === 'true';

  const { isLocked, timeRemaining } = useTimeGate(TARGET_DATE);

  // Effectively override the lock if forced
  const activeLockedState = isForcedUnlock ? false : isLocked;

  // VIEW STATE: 'asking' | 'success'
  const [gameState, setGameState] = useState('asking');

  // RENDERER
  // -----------------------------------------------------------------
  if (activeLockedState) {
    return (
      <main className="min-h-screen bg-[#fce7f3]">
        <CountdownScreen timeRemaining={timeRemaining} />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fce7f3] transition-all duration-1000">
      {gameState === 'asking' ? (
        <QuestionScreen onYes={() => setGameState('success')} />
      ) : (
        <Dashboard />
      )}
    </main>
  );
}

export default App;
