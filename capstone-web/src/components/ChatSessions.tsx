import { useEffect, useState } from 'react';
import {
  FaPlus, FaSearch, FaBars, FaEllipsisV, FaTrash, FaEdit, FaCheck, FaTimes
} from 'react-icons/fa';
import ChatSearch from './ChatSearch';

type ChatSession = {
  id: string;
  date: string;
  title?: string;
};

type Props = {
  sessions: ChatSession[];
  currentSessionId: string | null;
  setCurrentSessionId: (id: string | null) => void;
  onSelectSession: (sessionId: string, messageId?: string, keyword?: string) => void;
  onNewSession: (id: string) => void;
  getToken: () => Promise<string>;
};

export default function ChatSessions({ sessions, currentSessionId, setCurrentSessionId, onSelectSession, onNewSession, getToken }: Props) {
  const [collapsed, setCollapsed] = useState(false);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [sessionList, setSessionList] = useState(sessions);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    setSessionList(sessions);
  }, [sessions]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setCollapsed(true);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleNewChat = async () => {
    try {
      const token = await getToken();
      const res = await fetch(`${import.meta.env.VITE_API_URL}/sessions`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const session = await res.json();
      onNewSession(session._id);
    } catch (err) {
      console.error('Could not start new session:', err);
    }
  };

  const handleDeleteSession = async (sessionId: string) => {
    try {
      const token = await getToken();
      const res = await fetch(`${import.meta.env.VITE_API_URL}/sessions/${sessionId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('Failed to delete session');

      setSessionList((prev) => prev.filter((s) => s.id !== sessionId));

      if (sessionId === currentSessionId) {
        setCurrentSessionId(null);
        localStorage.removeItem('currentSessionId');
      }
    } catch (err) {
      console.error('Could not delete session:', err);
    }
  };

  const handleRenameSession = async (sessionId: string) => {
    try {
      const token = await getToken();
      const res = await fetch(`${import.meta.env.VITE_API_URL}/sessions/${sessionId}/rename`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ newTitle }),
      });

      if (!res.ok) throw new Error('Failed to rename session');
      setRenamingId(null);
      setNewTitle('');
      const updated = await res.json();

      setSessionList((prev) =>
        prev.map((s) => (s.id === sessionId ? { ...s, title: updated.title } : s))
      );
    } catch (err) {
      console.error('Could not rename session:', err);
    }
  };

  return (
    <div className="transition-all duration-300">
      {collapsed ? (
        <div className="p-2">
          <button
            onClick={() => setCollapsed(false)}
            className="bg-[#612bcd] text-white p-2 rounded-md shadow hover:bg-[#4e23a1] transition-colors"
            aria-label="Expand chat sidebar"
          >
            <FaBars />
          </button>
        </div>
      ) : (
        <div className="bg-[#612bcd] text-white w-64 rounded-xl p-4 m-4 shadow-lg flex flex-col space-y-4 h-fit max-h-[calc(100vh-8rem)]">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold">Chat History</h2>
            <button
              onClick={() => setCollapsed(true)}
              className="text-white hover:text-gray-200 transition"
              aria-label="Collapse chat sidebar"
            >
              ✕
            </button>
          </div>

          <div className="flex flex-col gap-2 text-sm">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleNewChat();
              }}
              className="flex items-center gap-2 hover:underline"
            >
              <FaPlus /> New Chat
            </a>

            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setShowSearch((prev) => !prev);
              }}
              className="flex items-center gap-2 hover:underline"
            >
              <FaSearch /> Search Chats
            </a>

            {showSearch && (
              <ChatSearch
                getToken={getToken}
                onSearchSelect={(sessionId, messageId, keyword) => {
                  onSelectSession(sessionId, messageId, keyword);
                  setShowSearch(false);
                }}
              />
            )}
          </div>

          <div className="space-y-2 pr-1 flex-1 overflow-y-auto">
            {sessionList
              .filter((session) => session.id)
              .map((session) => (
              <div key={session.id} className="relative">
                {renamingId === session.id ? (
                  <div className="flex items-center gap-2 px-2">
                    <input
                      type="text"
                      className="text-black px-1 py-0.5 rounded w-full text-sm"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleRenameSession(session.id);
                        }
                      }}
                      autoFocus
                    />
                    <button
                      className="text-green-600"
                      onClick={() => handleRenameSession(session.id)}
                    >
                      <FaCheck />
                    </button>
                    <button
                      className="text-gray-500"
                      onClick={() => {
                        setRenamingId(null);
                        setNewTitle('');
                      }}
                    >
                      <FaTimes />
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => onSelectSession(session.id)}
                    className="cursor-pointer hover:bg-[#5b2e75] rounded-md px-2 py-1 text-sm pr-8"
                  >
                    {session.title ? (
                      session.title
                    ) : (
                      <em>New Chat</em>
                    )}
                  </div>
                )}

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpenId(menuOpenId === session.id ? null : session.id);
                  }}
                  className="absolute top-1 right-1 text-white hover:text-gray-300"
                >
                  <FaEllipsisV />
                </button>

                {menuOpenId === session.id && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="absolute top-6 right-1 bg-white text-black rounded shadow-md z-50 w-28 text-sm"
                  >
                    <button
                      onClick={() => handleDeleteSession(session.id)}
                      className="flex items-center gap-2 w-full px-3 py-2 hover:bg-gray-100"
                    >
                      <FaTrash /> Delete
                    </button>
                    <button
                      onClick={() => {
                        setRenamingId(session.id);
                        setNewTitle(session.title || '');
                        setMenuOpenId(null);
                      }}
                      className="flex items-center gap-2 w-full px-3 py-2 hover:bg-gray-100"
                    >
                      <FaEdit /> Rename
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}