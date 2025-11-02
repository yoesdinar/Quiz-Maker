import { useEffect, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import {
  recordAntiCheatEvent,
  addAntiCheatEvent,
  selectCurrentAttempt,
  selectPhase
} from '@store/slices/quizAttemptSlice';
import { AntiCheatEventType } from '@shared/types/api';

export const useAntiCheatTracking = () => {
  const dispatch = useAppDispatch();
  const currentAttempt = useAppSelector(selectCurrentAttempt);
  const phase = useAppSelector(selectPhase);

  // Helper to record an event both locally and to backend
  const recordEvent = useCallback((eventType: AntiCheatEventType, metadata?: Record<string, any>) => {
    if (!currentAttempt || phase !== 'taking') return;

    const timestamp = new Date().toISOString();
    const event = {
      attemptId: currentAttempt.id,
      eventType,
      timestamp,
      metadata,
    };

    // Add to local state immediately
    dispatch(addAntiCheatEvent(event));

    // Send to backend asynchronously
    dispatch(recordAntiCheatEvent({
      attemptId: currentAttempt.id,
      event: eventType,
      timestamp,
      metadata,
    }));
  }, [currentAttempt, phase, dispatch]);

  // Track focus events (tab/window blur and focus)
  useEffect(() => {
    if (phase !== 'taking') return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        recordEvent('focus_lost', { 
          reason: 'page_hidden',
          timestamp: new Date().toISOString() 
        });
      } else {
        recordEvent('focus_gained', { 
          reason: 'page_visible',
          timestamp: new Date().toISOString() 
        });
      }
    };

    const handleWindowBlur = () => {
      recordEvent('focus_lost', { 
        reason: 'window_blur',
        timestamp: new Date().toISOString() 
      });
    };

    const handleWindowFocus = () => {
      recordEvent('focus_gained', { 
        reason: 'window_focus',
        timestamp: new Date().toISOString() 
      });
    };

    // Add event listeners
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);
    window.addEventListener('focus', handleWindowFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
      window.removeEventListener('focus', handleWindowFocus);
    };
  }, [phase, recordEvent]);

  // Create a function to track paste events (to be called by input components)
  const trackPasteEvent = useCallback((inputType: string, pastedContent?: string) => {
    recordEvent('paste_detected', {
      inputType,
      contentLength: pastedContent?.length || 0,
      timestamp: new Date().toISOString(),
    });
  }, [recordEvent]);

  return {
    trackPasteEvent,
  };
};

export default useAntiCheatTracking;