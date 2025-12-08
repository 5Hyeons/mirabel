import { useEffect, useState, useRef } from 'react';
import { useRoomContext } from '@livekit/components-react';
import { RoomEvent } from 'livekit-client';

export function useAnimationData() {
  const room = useRoomContext();
  const [latestFrame, setLatestFrame] = useState<Uint8Array | null>(null);
  const [frameCount, setFrameCount] = useState(0);
  const [interruptSignal, setInterruptSignal] = useState(0);

  const frameQueue = useRef<Uint8Array[]>([]);

  const firstFrameTime = useRef<number | null>(null);
  const totalFramesReceived = useRef(0);
  const framesDequeued = useRef(0);

  useEffect(() => {
    if (!room) return;

    const handleDataReceived = (payload: Uint8Array, participant: { identity?: string } | undefined) => {
      if (!participant?.identity?.startsWith('agent')) {
        return;
      }

      if (payload.length === 208) {
        const now = performance.now();

        if (firstFrameTime.current === null) {
          firstFrameTime.current = now;
          console.log('[AnimationData] First frame received from Agent');
        }

        totalFramesReceived.current++;

        if (totalFramesReceived.current % 3 === 0) {
          frameQueue.current.push(payload);
        }

        if (totalFramesReceived.current % 60 === 0) {
          const elapsed = now - (firstFrameTime.current || now);
          const avgInterval = elapsed / totalFramesReceived.current;
          const receiveFPS = avgInterval > 0 ? 1000 / avgInterval : 0;

          console.log(`[AnimationData] Received ${totalFramesReceived.current} frames:`, {
            queueSize: frameQueue.current.length,
            queuedFrames: Math.floor(totalFramesReceived.current / 3),
            downsample: '3:1 (60fps->20fps)',
            elapsedMs: Math.round(elapsed),
            receiveFPS: receiveFPS.toFixed(1),
          });
        }
      }
      else {
        try {
          const message = new TextDecoder().decode(payload);

          if (message === 'final') {
            console.log('[AnimationData] Final signal - adding to queue');
            frameQueue.current.push(payload);
          }
          else if (message === 'interrupted') {
            console.log('[AnimationData] Interrupt signal - immediate clear');
            frameQueue.current = [];
            setInterruptSignal(Date.now());
          }
        } catch {
          // Ignore decode errors
        }
      }
    };

    room.on(RoomEvent.DataReceived, handleDataReceived);

    return () => {
      room.off(RoomEvent.DataReceived, handleDataReceived);
    };
  }, [room]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (frameQueue.current.length > 0) {
        const frame = frameQueue.current.shift()!;
        setLatestFrame(frame);
        setFrameCount(prev => prev + 1);
        framesDequeued.current++;

        if (framesDequeued.current % 60 === 0) {
          console.log(`[AnimationData] Dequeued ${framesDequeued.current} frames, queue: ${frameQueue.current.length} remaining`);
        }
      }
    }, 16.67);

    return () => clearInterval(intervalId);
  }, []);

  return {
    latestFrame,
    frameCount,
    interruptSignal,
  };
}
