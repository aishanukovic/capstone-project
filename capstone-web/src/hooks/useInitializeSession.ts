import { useEffect, useRef } from 'react';
import {
  getToken,
  fetchSessions,
  loadChatForSession,
  initializeSession,
} from '../utils/sessions';

type Session = {
  id: string;
  date: string;
  title?: string;
};

type ChatMessage = {
  sender: 'user' | 'ai';
  message: string;
  _id?: string;
  timestamp?: string;
};

export function useInitializeSession({
  isAuthenticated,
  getAccessTokenSilently,
  setCurrentSessionId,
  setSessions,
  setChat,
  setLastInteractionTime,
}: {
  isAuthenticated: boolean;
  getAccessTokenSilently: () => Promise<string>;
  setCurrentSessionId: (id: string | null) => void;
  setSessions: (sessions: Session[]) => void;
  setChat: (messages: ChatMessage[]) => void;
  setLastInteractionTime: (time: number) => void;
}) {
  const hasInitialized = useRef(false);

  useEffect(() => {
    const runInitialization = async () => {
      try {
        const { sessionId, token } = await initializeSession(
          () => getToken(getAccessTokenSilently),
          setCurrentSessionId
        );

        const sessions = await fetchSessions(token);
        setSessions(sessions);

        if (sessionId) {
          const messages = await loadChatForSession(sessionId, token);
          setChat(messages);

          if (messages.length > 0 && messages[messages.length - 1].timestamp) {
            const lastTimestamp = new Date(messages[messages.length - 1].timestamp!).getTime();
            setLastInteractionTime(lastTimestamp);
          }
        } else {
          setChat([]);
        }
      } catch (err) {
        console.error('Failed to initialize session:', err);
      }
    };

    if (isAuthenticated && !hasInitialized.current) {
      hasInitialized.current = true;
      runInitialization();
    }
  }, [
    isAuthenticated,
    getAccessTokenSilently,
    setCurrentSessionId,
    setSessions,
    setChat,
    setLastInteractionTime,
  ]);
}