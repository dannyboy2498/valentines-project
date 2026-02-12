import React, { useState } from 'react';
import useTimeGate from './hooks/useTimeGate';
import CountdownScreen from './components/CountdownScreen';
import LockScreen from './components/LockScreen';
import QuestionScreen from './components/QuestionScreen';
import Dashboard from './components/Dashboard';
import HeartParticles from './components/HeartParticles';

function App() {
  // BYPASS LOGIC:
  const urlParams = new URLSearchParams(window.location.search);
  const isForcedUnlock = urlParams.get('debug') === 'true';

  // Config is now inside useTimeGate
  const { isLocked, timeRemaining } = useTimeGate();

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
      <main className="min-h-screen bg-[#fce7f3] relative">
        <CountdownScreen timeRemaining={timeRemaining} />
        <HeartParticles />
      </main>
    );
  }

  // 2. If Time Gate is open but Code Lock is still on, show LockScreen
  if (!isCodeUnlocked) {
    return (
      <main className="min-h-screen bg-[#fce7f3] relative">
        <LockScreen onUnlock={() => setIsCodeUnlocked(true)} />
        <HeartParticles />
      </main>
    );
  }

  // 3. Main Game Flow
  return (
    <main className="min-h-screen bg-[#fce7f3] transition-all duration-1000 relative">
      {gameState === 'asking' ? (
        <QuestionScreen onYes={() => setGameState('success')} />
      ) : (
        <Dashboard />
      )}
      <HeartParticles />
    </main>
  );
}

export default App;
