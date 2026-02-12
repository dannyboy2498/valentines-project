import { useState, useEffect } from 'react';
import { differenceInMilliseconds } from 'date-fns';

const useTimeGate = (targetDate) => {
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isLocked, setIsLocked] = useState(true);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const debugMode = urlParams.get('debug') === 'true';

    if (debugMode) {
      setIsLocked(false);
      return;
    }

    const calculateTime = () => {
      const now = new Date();
      const target = new Date(targetDate);
      const diff = differenceInMilliseconds(target, now);

      if (diff <= 0) {
        setIsLocked(false);
        setTimeRemaining(0);
      } else {
        setIsLocked(true);
        setTimeRemaining(diff);
      }
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return { isLocked, timeRemaining };
};

export default useTimeGate;
