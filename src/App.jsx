import React, { useState } from 'react';
import useTimeGate from './hooks/useTimeGate';
import CountdownScreen from './components/CountdownScreen';
import LockScreen from './components/LockScreen';
import QuestionScreen from './components/QuestionScreen';
import Dashboard from './components/Dashboard';

function App() {
  // CONFIGURATION
  // -----------------------------------------------------------------
  const TARGET_DATE = '2026-02-14T00:00:00-05:00';

  // BYPASS LOGIC:
  const urlParams = new URLSearchParams(window.location.search);
  const isForcedUnlock = urlParams.get('debug') === 'true';

  const { isLocked, timeRemaining } = useTimeGate(TARGET_DATE);

  // Effectively override the lock if forced
  const isTimeGateOpen = isForcedUnlock ? true : !isLocked;

  // VIEW STATE: 'asking' | 'success'
  const [gameState, setGameState] = useState('asking');

  // CODE UNLOCK STATE
  const [isCodeUnlocked, setIsCodeUnlocked] = useState(false);

  // RENDERER
  // -----------------------------------------------------------------

  // 1. If the Time Gate (Timer) is still closed, show Countdown
  if (!isTimeGateOpen) {
    return (
      <main className="min-h-screen bg-[#fce7f3]">
        <CountdownScreen timeRemaining={timeRemaining} />
      </main>
    );
  }

  // 2. If Time Gate is open but Code Lock is still on, show LockScreen
  if (!isCodeUnlocked) {
    return (
      <main className="min-h-screen bg-[#fce7f3]">
        <LockScreen onUnlock={() => setIsCodeUnlocked(true)} />
      </main>
    );
  }

  // 3. Main Game Flow
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
