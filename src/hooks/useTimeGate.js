import { useState, useEffect } from 'react';
import { DASHBOARD_CONTENT } from '../config/content';

const useTimeGate = () => {
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isLocked, setIsLocked] = useState(true);
  const [serverOffset, setServerOffset] = useState(0);

  const { unlockDate, unlockTime, timezone } = DASHBOARD_CONTENT;

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('debug') === 'true') {
      setIsLocked(false);
      return;
    }

    const syncWithServer = async () => {
      try {
        // Use the configured timezone for server sync
        const response = await fetch(`https://worldtimeapi.org/api/timezone/${timezone}`, {
          cache: 'no-store'
        });
        const data = await response.json();

        const serverTime = new Date(data.datetime);
        const localTime = new Date();

        setServerOffset(serverTime.getTime() - localTime.getTime());
      } catch (error) {
        console.warn(`Failed to fetch ${timezone} server time, falling back to local clock.`, error);
      }
    };

    syncWithServer();
  }, [timezone]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('debug') === 'true') {
      setIsLocked(false);
      return;
    }

    // Construct the target date
    // We want to calculate the target time in the specific timezone.
    // A robust way without heavy libraries is to use the server offset we calculated.
    // We need to know what the target time is in UTC.

    const updateCountdown = async () => {
      try {
        // To get the target UTC time for a specific date/time in a specific timezone:
        // We can use the worldtimeapi 'datetime' we already fetched to infer the offset of the target timezone.
        // But simpler: just use the local time + serverOffset to get "current time in source timezone" 
        // and compare it to the target date/time string.

        // This is tricky without a library. 
        // Let's assume the user provided something like "2026-02-14T00:00:00" 
        // and we want that to be in the target timezone.

        // Let's fetch the target timezone's info again if we don't have it to get its UTC offset.
        const response = await fetch(`https://worldtimeapi.org/api/timezone/${timezone}`);
        const data = await response.json();
        const utcOffsetSeconds = data.raw_offset + (data.dst ? data.dst_offset : 0);

        // Target time in UTC is: targetLocalTime - utcOffset
        const targetDate = new Date(`${unlockDate}T${unlockTime}Z`);
        const targetUTC = targetDate.getTime() - (utcOffsetSeconds * 1000);

        const internalUpdate = () => {
          const adjustedNow = new Date().getTime() + serverOffset;
          const diff = targetUTC - adjustedNow;

          if (diff <= 0) {
            setIsLocked(false);
            setTimeRemaining(0);
          } else {
            setIsLocked(true);
            setTimeRemaining(diff);
          }
        };

        internalUpdate();
        const timer = setInterval(internalUpdate, 1000);
        return () => clearInterval(timer);
      } catch (e) {
        // Fallback: Just use local time if API fails
        const targetUTC = new Date(`${unlockDate}T${unlockTime}`).getTime();
        const internalUpdate = () => {
          const diff = targetUTC - new Date().getTime();
          if (diff <= 0) {
            setIsLocked(false);
            setTimeRemaining(0);
          } else {
            setIsLocked(true);
            setTimeRemaining(diff);
          }
        };
        internalUpdate();
        const timer = setInterval(internalUpdate, 1000);
        return () => clearInterval(timer);
      }
    };

    const cleanupPromise = updateCountdown();
    return () => {
      cleanupPromise.then(cleanup => cleanup && cleanup());
    };
  }, [serverOffset, unlockDate, unlockTime, timezone]);

  return { isLocked, timeRemaining };
};

export default useTimeGate;
