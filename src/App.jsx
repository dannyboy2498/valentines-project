import React, { useState } from 'react';
import useTimeGate from './hooks/useTimeGate';
import CountdownScreen from './components/CountdownScreen';
import QuestionScreen from './components/QuestionScreen';
import Dashboard from './components/Dashboard';

function App() {
  // CONFIGURATION
  // -----------------------------------------------------------------
  const TARGET_DATE = '2026-02-14T00:00:00';

  // BYPASS LOGIC:
  // 1. URL Parameter: ?debug=true
  // 2. Development Mode: Bypass if running in dev environment (optional, but requested)
  const isDev = import.meta.env.DEV;
  const urlParams = new URLSearchParams(window.location.search);
  const isForcedUnlock = urlParams.get('debug') === 'true' || isDev;

  const { isLocked, timeRemaining } = useTimeGate(TARGET_DATE);

  // Effectively override the lock if forced
  const activeLockedState = isForcedUnlock ? false : isLocked;

  // VIEW STATE: 'asking' | 'success'
  const [gameState, setGameState] = useState('asking');

  // RENDERER
  // -----------------------------------------------------------------
  if (activeLockedState) {
    return (
      <main className="min-h-screen">
        <CountdownScreen timeRemaining={timeRemaining} />
      </main>
    );
  }

  return (
    <main className="min-h-screen transition-all duration-1000">
      {gameState === 'asking' ? (
        <QuestionScreen onYes={() => setGameState('success')} />
      ) : (
        <Dashboard />
      )}
    </main>
  );
}

export default App;
