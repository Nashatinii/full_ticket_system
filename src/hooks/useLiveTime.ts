import { useState, useEffect } from 'react';
import { formatTimestamp, TimeDisplay } from '@/lib/timeUtils';

/**
 * Hook for live updating timestamps
 */
export function useLiveTime(timestamp: string, updateInterval: number = 60000): TimeDisplay {
  const [timeDisplay, setTimeDisplay] = useState<TimeDisplay>(() => formatTimestamp(timestamp));

  useEffect(() => {
    // Update immediately
    setTimeDisplay(formatTimestamp(timestamp));

    // Set up interval for live updates
    const interval = setInterval(() => {
      setTimeDisplay(formatTimestamp(timestamp));
    }, updateInterval);

    return () => clearInterval(interval);
  }, [timestamp, updateInterval]);

  return timeDisplay;
}

/**
 * Hook for multiple live timestamps
 */
export function useLiveTimes(timestamps: string[], updateInterval: number = 60000): TimeDisplay[] {
  const [timeDisplays, setTimeDisplays] = useState<TimeDisplay[]>(() => 
    timestamps.map(timestamp => formatTimestamp(timestamp))
  );

  useEffect(() => {
    // Update immediately
    setTimeDisplays(timestamps.map(timestamp => formatTimestamp(timestamp)));

    // Set up interval for live updates
    const interval = setInterval(() => {
      setTimeDisplays(timestamps.map(timestamp => formatTimestamp(timestamp)));
    }, updateInterval);

    return () => clearInterval(interval);
  }, [timestamps, updateInterval]);

  return timeDisplays;
}
