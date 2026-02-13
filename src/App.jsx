import React, { useState, useEffect, useRef } from 'react';
import useTimeGate from './hooks/useTimeGate';
import CountdownScreen from './components/CountdownScreen';
import LockScreen from './components/LockScreen';
import QuestionScreen from './components/QuestionScreen';
import Dashboard from './components/Dashboard';

// Global Scaler component to handle core responsive "shrink to fit" behavior
const AppScaler = ({ children }) => {
  const [scale, setScale] = useState(1);
  const [stageSize, setStageSize] = useState({ width: 1280, height: 900 });

  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 1024;

      // We define a "Safe Stage" that we want to preserve.
      // If the window is smaller than this stage, we scale the stage down.
      const idealWidth = isMobile ? 480 : 1300;
      const idealHeight = isMobile ? 850 : 920;

      const vScale = window.innerHeight / idealHeight;
      const hScale = window.innerWidth / idealWidth;

      // The final scale is the most restrictive one, capped at 1.
      const finalScale = Math.min(vScale, hScale, 1);

      setScale(Math.max(finalScale, 0.35));
      setStageSize({ width: idealWidth, height: idealHeight });
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full bg-[#fce7f3] overflow-hidden flex items-center justify-center">
      {/* 
          The Stage: 
          This is a fixed-size container that represents our "Design Surface".
          We scale this entire surface to fit the window.
          overflow-visible is CRITICAL so shadows and badges can bleed out.
      */}
      <div
        className="flex items-center justify-center transition-transform duration-150 ease-out will-change-transform overflow-visible"
        style={{
          width: stageSize.width,
          height: stageSize.height,
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
          flexShrink: 0
        }}
      >
        <div className="w-full h-full flex items-center justify-center overflow-visible relative">
          {children}
        </div>
      </div>
    </div>
  );
};

function App() {
  const urlParams = new URLSearchParams(window.location.search);
  const isForcedUnlock = urlParams.get('debug') === 'true';

  const { isLocked, timeRemaining } = useTimeGate();
  const isTimeGateOpen = isForcedUnlock ? true : !isLocked;

  const [gameState, setGameState] = useState('asking');
  const [isCodeUnlocked, setIsCodeUnlocked] = useState(false);

  // View state mapping
  let content;
  if (!isTimeGateOpen) {
    content = <CountdownScreen timeRemaining={timeRemaining} />;
  } else if (!isCodeUnlocked) {
    content = <LockScreen onUnlock={() => setIsCodeUnlocked(true)} />;
  } else {
    content = gameState === 'asking' ? (
      <QuestionScreen onYes={() => setGameState('success')} />
    ) : (
      <Dashboard />
    );
  }

  return (
    <AppScaler>
      {content}
    </AppScaler>
  );
}

export default App;
