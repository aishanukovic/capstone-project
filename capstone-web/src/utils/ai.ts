export const getAIResponse = async (
  userId: string,
  userMessage: string,
  accessToken: string,
  sessionId: string
): Promise<string> => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/chats/${userId}/ask-ai`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        sessionId,
        messages: [{ role: 'user', content: userMessage }],
      }),
    });

    const data = await response.json();
    return data?.content || 'Sorry, the AI did not return a response.';
  } catch (error) {
    console.error('AI API Error:', error);
    return 'Sorry, something went wrong while contacting the AI.';
  }
};

export const getMessagesBySession = async (sessionId: string, token: string) => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/chats/session/${sessionId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error('Failed to fetch messages');

  const data = await res.json();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return data.map((msg: any) => ({
    _id: msg._id,
    sender: msg.role === 'user' ? 'user' : 'ai',
    message: msg.content,
  }));
};