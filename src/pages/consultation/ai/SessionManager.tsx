import { useLocalParticipant, useRoomContext, useTracks, AudioTrack, TrackReference } from '@livekit/components-react';
import { Track } from 'livekit-client';
import { useCallback, useEffect, useState, useRef } from 'react';
import { useAudioContext, useTrackVolume } from '@/lib/hooks';
import { ChatMessage, AgentState } from '@/lib/types/consultation';
import { useConsultationStore } from '@/lib/store/consultation-store';
import { AvatarView } from './AvatarView';
import type { useUnityContext } from 'react-unity-webgl';

interface SessionManagerProps {
  onBack: () => void;
  onShowSummary: () => void;
  unityContext: ReturnType<typeof useUnityContext>;
  conversationStarted: boolean;
  onConversationStart: () => void;
}

export function SessionManager({ onBack, onShowSummary, unityContext, conversationStarted, onConversationStart }: SessionManagerProps) {
  const [avatarMessage, setAvatarMessage] = useState<ChatMessage | undefined>(undefined);
  const [agentState, setAgentState] = useState<AgentState | null>(null);

  const { addMessage, updateMessage } = useConsultationStore();

  const rpcHandlerRegistered = useRef(false);
  const transcriptionHandlerRegistered = useRef(false);

  const { localParticipant } = useLocalParticipant();
  const room = useRoomContext();

  useAudioContext();

  const audioTracks = useTracks([
    { source: Track.Source.Microphone, withPlaceholder: false },
  ], {
    onlySubscribed: true,
  });

  const userMicTrack = localParticipant.getTrackPublication(Track.Source.Microphone)?.track;
  const userVolume = useTrackVolume(userMicTrack);

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
      // Handler will be cleaned up when participant disconnects
    };
  }, [localParticipant]);

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
        let messageAdded = false;

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

          if (!isUserTranscription) {
            setAvatarMessage(updatedMessage);
          }

          // Use store to manage messages
          const currentMessages = useConsultationStore.getState().messages;
          const existingMessage = currentMessages.find(m => m.id === messageId);

          if (existingMessage) {
            updateMessage(messageId, updatedMessage);
          } else if (!messageAdded) {
            addMessage(updatedMessage);
            messageAdded = true;
          } else {
            updateMessage(messageId, updatedMessage);
          }
        }

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

        // Update to final message
        updateMessage(messageId, finalMessage);
      } catch (error) {
        console.error('[SessionManager] Transcription error:', error);
      }
    };

    room.registerTextStreamHandler('lk.transcription', handleTranscription);
    transcriptionHandlerRegistered.current = true;
    console.log('[SessionManager] Transcription handler registered');

    return () => {
      // Handler will be cleaned up when room disconnects
    };
  }, [room, localParticipant]);

  const handleBack = useCallback(() => {
    if (localParticipant) {
      localParticipant.setMicrophoneEnabled(false);
    }
    onBack();
  }, [localParticipant, onBack]);

  const handleShowSummary = useCallback(() => {
    if (localParticipant) {
      localParticipant.setMicrophoneEnabled(false);
    }
    onShowSummary();
  }, [localParticipant, onShowSummary]);

  const handleStartConversation = useCallback(async () => {
    if (!localParticipant || !room) return;

    // Set immediately to transition UI without waiting for RPC
    onConversationStart();

    try {
      const remoteParticipants = Array.from(room.remoteParticipants.values());
      const agentParticipant = remoteParticipants.find(p => p.identity.startsWith('agent'));

      if (agentParticipant) {
        console.log('[SessionManager] Sending start_conversation RPC...');
        await localParticipant.performRpc({
          destinationIdentity: agentParticipant.identity,
          method: 'start_conversation',
          payload: '',
        });
        console.log('[SessionManager] start_conversation RPC sent');
      } else {
        console.warn('[SessionManager] No agent participant found for RPC');
      }
    } catch (error) {
      console.error('[SessionManager] Failed to start conversation:', error);
    }
  }, [localParticipant, room, onConversationStart]);

  return (
    <>
      {audioTracks
        .filter((track) => track.participant.identity.startsWith('agent') && track.publication)
        .map((track) => (
          <AudioTrack key={track.participant.sid} trackRef={track as TrackReference} />
        ))}

      <AvatarView
        lastMessage={avatarMessage}
        agentState={agentState}
        userVolume={userVolume}
        onBack={handleBack}
        onShowSummary={handleShowSummary}
        unityContext={unityContext}
        conversationStarted={conversationStarted}
        onStartConversation={handleStartConversation}
      />
    </>
  );
}
