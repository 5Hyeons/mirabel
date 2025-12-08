import { useEffect, useState, useRef } from 'react';
import { useRoomContext } from '@livekit/components-react';
import { RoomEvent } from 'livekit-client';

export function useAnimationData() {
  const room = useRoomContext();
  const [latestFrame, setLatestFrame] = useState<Uint8Array | null>(null);
  const [frameCount, setFrameCount] = useState(0);
  const [interruptSignal, setInterruptSignal] = useState(0);

  // Frame queue for buffering
  const frameQueue = useRef<Uint8Array[]>([]);

  // Timing tracking
  const firstFrameTime = useRef<number | null>(null);
  const totalFramesReceived = useRef(0);
  const framesDequeued = useRef(0);

  // 1. Receive frames from Agent and queue them
  useEffect(() => {
    if (!room) return;

    const handleDataReceived = (payload: Uint8Array, participant: { identity?: string } | undefined) => {
      // Agent만 처리
      if (!participant?.identity?.startsWith('agent')) {
        return;
      }

      // 208 bytes = 애니메이션 데이터 (52 floats × 4 bytes)
      if (payload.length === 208) {
        const now = performance.now();

        // First frame
        if (firstFrameTime.current === null) {
          firstFrameTime.current = now;
          console.log('[AnimationData] First frame received from Agent');
        }

        totalFramesReceived.current++;

        // Downsample: Only add every 3rd frame to queue (60fps → 20fps)
        if (totalFramesReceived.current % 3 === 0) {
          frameQueue.current.push(payload);
        }

        // Log every 60 frames
        if (totalFramesReceived.current % 60 === 0) {
          const elapsed = now - (firstFrameTime.current || now);
          const avgInterval = elapsed / totalFramesReceived.current;
          const receiveFPS = avgInterval > 0 ? 1000 / avgInterval : 0;

          console.log(`[AnimationData] Received ${totalFramesReceived.current} frames:`, {
            queueSize: frameQueue.current.length,
            queuedFrames: Math.floor(totalFramesReceived.current / 3),
            downsample: '3:1 (60fps→20fps)',
            elapsedMs: Math.round(elapsed),
            receiveFPS: receiveFPS.toFixed(1),
          });
        }
      }
      // Control signals (문자열: "final" 또는 "interrupted")
      else {
        try {
          const message = new TextDecoder().decode(payload);

          if (message === 'final') {
            console.log('[AnimationData] Final signal - adding to queue');
            frameQueue.current.push(payload);  // 큐에 추가 (순서 보장)
          }
          else if (message === 'interrupted') {
            console.log('[AnimationData] Interrupt signal - immediate clear');
            frameQueue.current = [];  // 즉시 큐 비우기
            setInterruptSignal(Date.now());  // Unity로 즉시 전파
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

  // 2. Dequeue frames at 60fps and set as latestFrame
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (frameQueue.current.length > 0) {
        const frame = frameQueue.current.shift()!;
        setLatestFrame(frame);
        setFrameCount(prev => prev + 1);
        framesDequeued.current++;

        // Log every 60 frames
        if (framesDequeued.current % 60 === 0) {
          console.log(`[AnimationData] Dequeued ${framesDequeued.current} frames, queue: ${frameQueue.current.length} remaining`);
        }
      }
    }, 16.67);  // 60fps (16.67ms interval)

    return () => clearInterval(intervalId);
  }, []);

  return {
    latestFrame,
    frameCount,
    interruptSignal,
  };
}
