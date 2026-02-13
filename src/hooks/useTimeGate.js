import { useState, useEffect } from 'react';
import { DASHBOARD_CONTENT } from '../config/content';

const useTimeGate = () => {
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isLocked, setIsLocked] = useState(true);
  const [serverOffset, setServerOffset] = useState(0);

  const { unlockDate, unlockTime, timezone } = DASHBOARD_CONTENT;

  // 1. Sync with Server once to get the "Absolute Truth" offset
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('debug') === 'true') {
      setIsLocked(false);
      return;
    }

    const syncWithServer = async () => {
      try {
        const response = await fetch(`https://worldtimeapi.org/api/timezone/${timezone}`, {
          cache: 'no-store'
        });
        const data = await response.json();

        // This is the server's UTC time
        const serverUTC = new Date(data.utc_datetime).getTime();
        const localUTC = new Date().getTime();

        // If local is 12:00 and server is 12:00, offset is 0.
        // This accounts for any system clock drift on her computer.
        setServerOffset(serverUTC - localUTC);
      } catch (error) {
        console.warn("Server sync failed, using local clock as fallback.");
      }
    };

    syncWithServer();
  }, [timezone]);

  // 2. Calculate the target time in UTC based on the desired Timezone
  useEffect(() => {
    const updateCountdown = async () => {
      let utcTarget;

      try {
        // We need to know the offset of the target timezone (e.g., -5 for Ecuador)
        const response = await fetch(`https://worldtimeapi.org/api/timezone/${timezone}`);
        const data = await response.json();
        const offsetSeconds = data.raw_offset + (data.dst ? data.dst_offset : 0);

        // Target: Midnight in Ecuador (-5) 
        // Logic: (Target Local Time) - (Ecuador Offset) = UTC Target
        // 00:00:00 - (-5) = 05:00:00 UTC
        const localTarget = new Date(`${unlockDate}T${unlockTime}Z`).getTime();
        utcTarget = localTarget - (offsetSeconds * 1000);
      } catch (e) {
        // Fallback: If API fails, default to a -5 offset (Ecuador) if that's what's configured
        const isEcuador = timezone.includes('Guayaquil');
        const fallbackOffset = isEcuador ? -5 * 3600 : 0;
        const localTarget = new Date(`${unlockDate}T${unlockTime}Z`).getTime();
        utcTarget = localTarget - (fallbackOffset * 1000);
      }

      const timer = setInterval(() => {
        const nowUTC = new Date().getTime() + serverOffset;
        const diff = utcTarget - nowUTC;

        if (diff <= 0) {
          setIsLocked(false);
          setTimeRemaining(0);
          clearInterval(timer);
        } else {
          setIsLocked(true);
          setTimeRemaining(diff);
        }
      }, 1000);

      return () => clearInterval(timer);
    };

    const cleanupPromise = updateCountdown();
    return () => { cleanupPromise.then(cleanup => cleanup && cleanup()); };
  }, [serverOffset, unlockDate, unlockTime, timezone]);

  return { isLocked, timeRemaining };
};

export default useTimeGate;
