const ChatHistory = require('../models/ChatHistory');
const ChatSession = require('../models/ChatSession');
const User = require('../models/User');

const getMessagesBySession = async (req, res) => {
  const { sessionId } = req.params;

  try {
    const messages = await ChatHistory.find({ sessionId }).sort({ timestamp: 1 });
    res.json(messages);
  } catch (err) {
    console.error('Error loading session messages:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const addChatMessage = async (req, res) => {
  const { userMessage, aiMessage, sessionId } = req.body;
  const auth0Id = req.params.userId;

  try {
    const user = await User.findOne({ auth0Id });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const session = await ChatSession.findOne({ _id: sessionId, userId: user._id });
    if (!session) return res.status(400).json({ error: 'Invalid session for user' });

    const messages = [
      {
        sessionId,
        userId: user._id,
        role: 'user',
        content: userMessage,
        timestamp: new Date(),
      },
      {
        sessionId,
        userId: user._id,
        role: 'assistant',
        content: aiMessage,
        timestamp: new Date(),
      },
    ];

    await ChatHistory.insertMany(messages);

    res.status(201).json({ success: true });
  } catch (err) {
    console.error('Error saving chat:', err.message);
    res.status(400).json({ error: err.message });
  }
};

const searchChats = async (req, res) => {
  const auth0Id = req.auth.sub;

  try {
    const user = await User.findOne({ auth0Id });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const allMessages = await ChatHistory.find({ userId: user._id }).sort({ timestamp: 1 });

    const query = req.query.q?.toLowerCase();
    if (!query) return res.status(400).json({ error: 'Missing query string' });

    const matches = [];

    allMessages.forEach((msg) => {
      if (msg.content && msg.content.toLowerCase().includes(query)) {
        matches.push({
          sessionId: msg.sessionId,
          messageId: msg._id,
          message: msg.content.slice(0, 100),
        });
      }
    });

    res.json({ matches });
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({ error: 'Search failed' });
  }
};

module.exports = {
  getMessagesBySession,
  addChatMessage,
  searchChats,
};