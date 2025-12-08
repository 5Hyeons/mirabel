'use client';

import { useLocalParticipant, useRoomContext, useTracks, AudioTrack } from '@livekit/components-react';
import { Track } from 'livekit-client';
import { useCallback, useEffect, useState, useRef } from 'react';
import { useAudioContext, useTrackVolume } from '@/lib/hooks';
import { ChatMessage, AgentState } from '@/lib/types/consultation';
import { AvatarView } from './AvatarView';

interface SessionManagerProps {
  onBack: () => void;
}

export function SessionManager({ onBack }: SessionManagerProps) {
  const [, setMessages] = useState<ChatMessage[]>([]);
  const [avatarMessage, setAvatarMessage] = useState<ChatMessage | undefined>(undefined);
  const [agentState, setAgentState] = useState<AgentState | null>(null);

  // Refs to prevent duplicate handler registration (React Strict Mode)
  const rpcHandlerRegistered = useRef(false);
  const transcriptionHandlerRegistered = useRef(false);

  const { localParticipant } = useLocalParticipant();
  const room = useRoomContext();

  // Auto-resume AudioContext on user interaction
  useAudioContext();

  // Subscribe to agent audio tracks
  const audioTracks = useTracks([
    { source: Track.Source.Microphone, withPlaceholder: false },
  ], {
    onlySubscribed: true,
  });

  // Get user's microphone track for volume detection
  const userMicTrack = localParticipant.getTrackPublication(Track.Source.Microphone)?.track;
  const userVolume = useTrackVolume(userMicTrack);

  // Register RPC handler for agent_state_changed
  useEffect(() => {
    if (!localParticipant || rpcHandlerRegistered.current) return;

    const handleRpc = async (data: { payload: string; callerIdentity: string }) => {
      try {
        const payload = JSON.parse(data.payload);
        const newState = payload.new_state as AgentState;
        setAgentState(newState);
        console.log('[SessionManager] Agent state changed:', newState);
      } catch (e) {
        console.error('[SessionManager] Failed to parse RPC payload:', e);
      }
      return '';
    };

    localParticipant.registerRpcMethod('agent_state_changed', handleRpc);
    rpcHandlerRegistered.current = true;
    console.log('[SessionManager] RPC handler registered');

    return () => {
      // Note: LiveKit doesn't provide unregisterRpcMethod
      // Handler will be cleaned up when participant disconnects
    };
  }, [localParticipant]);

  // Subscribe to Agent transcriptions
  useEffect(() => {
    if (!room || transcriptionHandlerRegistered.current) return;

    console.log('[SessionManager] Registering transcription handler...');

    const handleTranscription = async (reader: AsyncIterable<string> & { info?: { attributes?: Record<string, string>; id?: string; timestamp?: number } }, participantIdentity: string | { identity: string }) => {
      try {
        const participantId = typeof participantIdentity === 'string'
          ? participantIdentity
          : participantIdentity?.identity;

        const isTranscription = reader.info?.attributes?.['lk.transcribed_track_id'];
        const isFinal = reader.info?.attributes?.['lk.transcription_final'] === 'true';
        const segmentId = reader.info?.attributes?.['lk.segment_id'];
        const streamId = reader.info?.id;

        const isUserTranscription = participantId === localParticipant.identity;

        if (!isTranscription) return;

        const messageId = segmentId || streamId || `msg_${Date.now()}`;

        let fullText = '';
        for await (const chunk of reader) {
          fullText += chunk;

          const updatedMessage: ChatMessage = {
            id: messageId,
            message: fullText + (isFinal ? '' : ' ...'),
            isUser: isUserTranscription,
            timestamp: reader.info?.timestamp || Date.now(),
            sender: isUserTranscription ? 'You' : 'Agent',
            isFinal: isFinal,
          };

          // Update avatarMessage for agent messages
          if (!isUserTranscription) {
            setAvatarMessage(updatedMessage);
          }

          setMessages((prev) => {
            const existingIndex = prev.findIndex(m => m.id === messageId);
            if (existingIndex >= 0) {
              const newMessages = [...prev];
              newMessages[existingIndex] = updatedMessage;
              return newMessages;
            }
            return [...prev, updatedMessage];
          });
        }

        // 스트림 완료 후 "..." 제거
        const finalMessage: ChatMessage = {
          id: messageId,
          message: fullText,
          isUser: isUserTranscription,
          timestamp: reader.info?.timestamp || Date.now(),
          sender: isUserTranscription ? 'You' : 'Agent',
          isFinal: true,
        };

        if (!isUserTranscription) {
          setAvatarMessage(finalMessage);
        }

        setMessages((prev) => {
          const existingIndex = prev.findIndex(m => m.id === messageId);
          if (existingIndex >= 0) {
            const newMessages = [...prev];
            newMessages[existingIndex] = finalMessage;
            return newMessages;
          }
          return prev;
        });
      } catch (error) {
        console.error('[SessionManager] Transcription error:', error);
      }
    };

    room.registerTextStreamHandler('lk.transcription', handleTranscription);
    transcriptionHandlerRegistered.current = true;
    console.log('[SessionManager] Transcription handler registered');

    return () => {
      // Note: LiveKit doesn't provide unregisterTextStreamHandler
      // Handler will be cleaned up when room disconnects
    };
  }, [room, localParticipant]);

  // Handle back button
  const handleBack = useCallback(() => {
    // Disable microphone before leaving
    if (localParticipant) {
      localParticipant.setMicrophoneEnabled(false);
    }
    onBack();
  }, [localParticipant, onBack]);

  return (
    <>
      {/* Render audio tracks */}
      {audioTracks
        .filter((track) => track.participant.identity.startsWith('agent') && track.publication)
        .map((track) => (
          <AudioTrack key={track.participant.sid} trackRef={track as import('@livekit/components-react').TrackReference} />
        ))}

      {/* Avatar View */}
      <AvatarView
        lastMessage={avatarMessage}
        agentState={agentState}
        userVolume={userVolume}
        onBack={handleBack}
      />
    </>
  );
}
