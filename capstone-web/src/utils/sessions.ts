import { getMessagesBySession } from './ai';

type SessionResponse = {
  _id: string;
  createdAt: string;
  title?: string;
};

export async function getToken(
  getAccessTokenSilently: (opts: { authorizationParams: { audience: string } }) => Promise<string>
) {
  return await getAccessTokenSilently({
    authorizationParams: { audience: 'https://capstone-api' },
  });
}

export async function createNewSession(token: string) {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/sessions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error('Failed to create session');
  return res.json();
}

export async function fetchSessions(token: string) {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/sessions`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error('Failed to fetch sessions');

  const data: SessionResponse[] = await res.json();
  return data.map((s) => ({
    id: s._id,
    date: s.createdAt,
    title: s.title,
  }));
}

export async function loadChatForSession(sessionId: string, token: string) {
  const messages = await getMessagesBySession(sessionId, token);
  return messages;
}

export async function initializeSession(
  getTokenFn: () => Promise<string>,
  setCurrentSessionId: (id: string | null) => void
) {
  const token = await getTokenFn();
  const sessionId = localStorage.getItem('currentSessionId');
  let sessionValid = false;

  if (sessionId) {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/sessions`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const sessions: SessionResponse[] = await res.json();
    sessionValid = sessions.some((s) => s._id === sessionId);
  }

  if (!sessionValid) {
    localStorage.removeItem('currentSessionId');
    setCurrentSessionId(null);
    return { sessionId: null, token };
  }

  setCurrentSessionId(sessionId);
  return { sessionId, token };
}