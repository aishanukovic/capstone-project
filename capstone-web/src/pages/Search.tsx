import { useRef, useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { getAIResponse } from '../utils/ai';
import {
  getToken,
  fetchSessions,
  loadChatForSession,
  createNewSession,
} from '../utils/sessions';
import { useInitializeSession } from '../hooks/useInitializeSession';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ChatSessions from '../components/ChatSessions';
import ChatMessageBubble from '../components/ChatMessageBubble';
import ChatInputForm from '../components/ChatInputForm';
import aiPhoto from '/ai.png';
import { motion } from 'framer-motion';
import ThinkingIndicator from '../components/ThinkingIndicator';

type ChatMessage = {
  sender: 'user' | 'ai';
  message: string;
  _id?: string;
  timestamp?: string;
};

type Session = {
  id: string;
  date: string;
  title?: string;
};

export default function Search() {
  const { user, isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();
  const [query, setQuery] = useState('');
  const [chat, setChat] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [lastInteractionTime, setLastInteractionTime] = useState<number | null>(null);
  const [minimizedHeader, setMinimizedHeader] = useState(false);
  const [typingMessage, setTypingMessage] = useState('');
  const [highlightMessageId, setHighlightMessageId] = useState<string | null>(null);
  const [highlightKeyword, setHighlightKeyword] = useState<string | null>(null);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  useInitializeSession({
    isAuthenticated,
    getAccessTokenSilently,
    setCurrentSessionId,
    setSessions,
    setChat,
    setLastInteractionTime,
  });

  useEffect(() => {
    const storedId = localStorage.getItem('highlightMessageId');
    if (storedId) {
      setHighlightMessageId(storedId);
      localStorage.removeItem('highlightMessageId');
    }
  }, []);

  useEffect(() => {
    if (!highlightMessageId || chat.length === 0) return;
    const target = document.querySelector(`[data-msg-id="${highlightMessageId}"]`);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    const timeout = setTimeout(() => setHighlightMessageId(null), 10000);
    return () => clearTimeout(timeout);
  }, [chat, highlightMessageId]);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleNewSession = async (
    sessionId: string,
    highlightId?: string,
    keyword?: string
  ) => {
    setCurrentSessionId(sessionId);
    setChat([]);
    setLastInteractionTime(Date.now());
    setTypingMessage('');
    setMinimizedHeader(false);
    localStorage.setItem('currentSessionId', sessionId);
    setHighlightMessageId(highlightId || null);
    setHighlightKeyword(keyword || null);

    const token = await getToken(getAccessTokenSilently);
    const sessions = await fetchSessions(token);
    setSessions(sessions);

    const messages = await loadChatForSession(sessionId, token);
    setChat(messages);

    if (messages.length > 0) {
      const last = messages[messages.length - 1];
      if (last.timestamp) {
        setLastInteractionTime(new Date(last.timestamp).getTime());
      }
    }

    if (highlightId) {
      setTimeout(() => {
        const target = document.querySelector(`[data-msg-id="${highlightId}"]`);
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || !isAuthenticated || !user?.sub) return;
    const now = Date.now();
    setQuery('');

    const THIRTY_MINUTES = 30 * 60 * 1000;
    if (lastInteractionTime && now - lastInteractionTime > THIRTY_MINUTES) {
      setCurrentSessionId(null);
      localStorage.removeItem('currentSessionId');
      setChat([]);
    }

    let sessionIdToUse = currentSessionId;
    const token = await getToken(getAccessTokenSilently);

    if (!sessionIdToUse) {
      const session = await createNewSession(token);
      sessionIdToUse = session._id;
      if (sessionIdToUse) {
        setCurrentSessionId(sessionIdToUse);
        localStorage.setItem('currentSessionId', sessionIdToUse);
      }

      const sessions = await fetchSessions(token);
      setSessions(sessions);
    }

    const userId = user.sub;

    if (chat.length === 0 && sessionIdToUse) {
      await fetch(`${import.meta.env.VITE_API_URL}/sessions/${sessionIdToUse}/name`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ firstMessage: query }),
      });
      const sessions = await fetchSessions(token);
      setSessions(sessions);
    }

    setChat((prev) => [...prev, { sender: 'user', message: query }]);
    setTimeout(scrollToBottom, 0);
    setLoading(true);
    setLastInteractionTime(now);
    if (!minimizedHeader) setMinimizedHeader(true);

    try {
      const aiReply = await getAIResponse(userId, query, token, sessionIdToUse as string);

      let typed = '';
      let i = 0;
      const chunkSize = 16;
      const delay = 0;

      const typeNextChunk = () => {
        if (i < aiReply.length) {
          typed += aiReply.slice(i, i + chunkSize);
          setTypingMessage(typed);
          scrollToBottom();
          i += chunkSize;
          setTimeout(typeNextChunk, delay);
        } else {
          setChat((prev) => [...prev, { sender: 'ai', message: aiReply }]);
          setTypingMessage('');
          setLoading(false);
          scrollToBottom();
        }
      };

      typeNextChunk();

      await fetch(`${import.meta.env.VITE_API_URL}/chats/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userMessage: query,
          aiMessage: aiReply,
          sessionId: sessionIdToUse,
        }),
      });
    } catch (err) {
      console.error('AI error:', err);
      setChat((prev) => [
        ...prev,
        { sender: 'ai', message: 'An error occurred. Please try again later.' },
      ]);
    } finally {
      setTypingMessage('');
      setLoading(false);
      scrollToBottom();
    }
  };

  if (!isAuthenticated || isLoading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-600">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f9f7fc] text-gray-700">
      <Navbar />
      <div className="flex flex-1 px-4 overflow-hidden">
        <ChatSessions
          sessions={sessions}
          currentSessionId={currentSessionId}
          setCurrentSessionId={setCurrentSessionId}
          onSelectSession={handleNewSession}
          onNewSession={handleNewSession}
          getToken={() => getToken(getAccessTokenSilently)}
        />
        <main className="flex-1 p-6 flex flex-col items-center overflow-hidden">
          <motion.div
            animate={minimizedHeader ? { scale: 0.6, y: -40 } : { scale: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="text-center mb-4 overflow-visible"
          >
            <motion.img
              animate={typingMessage ? { scale: [1, 1.1, 1] } : { scale: 1 }}
              transition={{ repeat: typingMessage ? Infinity : 0, duration: 1 }}
              src={aiPhoto}
              alt="AI Holly"
              className="w-24 h-fit mx-auto"
            />
            <h1 className="text-3xl font-bold text-[#4b306a] mt-2">Ask Holly anything about your health</h1>
          </motion.div>

          <div className={`w-full max-w-5xl flex flex-col flex-1 max-h-[70vh] transition-all duration-300 ${minimizedHeader ? 'mt-[-4.3rem]' : ''}`}>
            <div className="flex-1 overflow-y-auto space-y-3 px-2 mb-4">
              {chat.map((msg, index) => (
                <div key={msg._id || index} data-msg-id={msg._id}>
                  <ChatMessageBubble
                    message={msg}
                    highlightMessageId={highlightMessageId}
                    highlightKeyword={highlightKeyword}
                  />
                </div>
              ))}
              {typingMessage && (
                <ChatMessageBubble message={{ sender: 'ai', message: typingMessage }} />
              )}
              {loading && !typingMessage && <ThinkingIndicator />}
              <div ref={chatEndRef} />
            </div>
            <ChatInputForm
              query={query}
              setQuery={setQuery}
              loading={loading}
              inputRef={inputRef}
              onSubmit={handleSubmit}
            />
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}