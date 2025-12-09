import { useEffect, useState } from 'react';

/**
 * Hook to automatically resume AudioContext on first user interaction
 * Resolves browser autoplay policy issues for LiveKit audio
 */
export function useAudioContext() {
  const [resumed, setResumed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!('AudioContext' in window || 'webkitAudioContext' in window)) {
      console.warn('[useAudioContext] AudioContext not supported in this browser');
      return;
    }

    let resumeAttempted = false;

    const attemptResume = async () => {
      if (resumeAttempted) return;
      resumeAttempted = true;

      try {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;

        const testContext = new AudioContextClass();

        if (testContext.state === 'suspended') {
          await testContext.resume();
          console.log('[useAudioContext] AudioContext resumed');
        }

        testContext.close();

        setResumed(true);

        cleanup();
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Unknown error';
        console.error('[useAudioContext] Failed to resume AudioContext:', errorMsg);
        setError(errorMsg);
      }
    };

    const handleInteraction = () => {
      attemptResume();
    };

    const events = ['click', 'touchstart', 'keydown'];

    events.forEach(event => {
      document.addEventListener(event, handleInteraction, { once: true, passive: true });
    });

    const cleanup = () => {
      events.forEach(event => {
        document.removeEventListener(event, handleInteraction);
      });
    };

    return cleanup;
  }, []);

  return { resumed, error };
}
