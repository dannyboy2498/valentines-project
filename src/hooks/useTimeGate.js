import { useState, useEffect } from 'react';

const useTimeGate = (targetDateString) => {
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isLocked, setIsLocked] = useState(true);
  const [serverOffset, setServerOffset] = useState(0); // Difference between server and local time

  useEffect(() => {
    // 1. Check for debug bypass
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('debug') === 'true') {
      setIsLocked(false);
      return;
    }

    // 2. Fetch "Server Time" from Ecuador (America/Guayaquil)
    // We do this once to get the offset, then clock it locally to avoid API spam.
    const syncWithServer = async () => {
      try {
        const response = await fetch('https://worldtimeapi.org/api/timezone/America/Guayaquil', {
          cache: 'no-store'
        });
        const data = await response.json();

        // server_time is "2026-02-12T14:45:00.123456-05:00"
        const serverTime = new Date(data.datetime);
        const localTime = new Date();

        // If server says it's 2 PM and local says 3 PM, offset is -1 hour
        setServerOffset(serverTime.getTime() - localTime.getTime());
      } catch (error) {
        console.warn('Failed to fetch Ecuador server time, falling back to local-to-UTC offset.', error);
        // Fallback: Assume local clock is roughly correct and just target the ECT timestamp
      }
    };

    syncWithServer();
  }, []);

  useEffect(() => {
    // 1. Bypass check
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('debug') === 'true') {
      setIsLocked(false);
      return;
    }

    // TARGET DATE in Ecuador (UTC-5)
    // 2026-02-14T00:00:00 in Ecuador is 2026-02-14T05:00:00 UTC
    // We create the target date explicitly as a UTC date to avoid local timezone weirdness.
    const targetUTC = new Date('2026-02-14T05:00:00Z').getTime();

    const updateCountdown = () => {
      const nowLocal = new Date().getTime();
      // Apply the offset we got from the server. 
      // If serverOffset is 0 (fetch failed), we fall back to local clock accuracy.
      const adjustedNow = nowLocal + serverOffset;

      const diff = targetUTC - adjustedNow;

      if (diff <= 0) {
        setIsLocked(false);
        setTimeRemaining(0);
      } else {
        setIsLocked(true);
        setTimeRemaining(diff);
      }
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);

    return () => clearInterval(timer);
  }, [serverOffset]);

  return { isLocked, timeRemaining };
};

export default useTimeGate;
