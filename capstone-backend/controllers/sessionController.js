const ChatSession = require('../models/ChatSession');
const ChatHistory = require('../models/ChatHistory');
const User = require('../models/User');
const axios = require('axios');

const createSession = async (req, res) => {
  try {
    const auth0Id = req.auth.sub;
    const user = await User.findOne({ auth0Id });

    if (!user) return res.status(404).json({ error: 'User not found' });

    const session = await ChatSession.create({ userId: user._id });
    res.status(201).json(session);
  } catch (err) {
    console.error('Error creating session:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getUserSessions = async (req, res) => {
  try {
    const auth0Id = req.auth.sub;
    const user = await User.findOne({ auth0Id });

    if (!user) return res.status(404).json({ error: 'User not found' });

    const sessions = await ChatSession.find({ userId: user._id }).sort({ createdAt: -1 });
    res.json(sessions);
  } catch (err) {
    console.error('Error fetching sessions:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const nameSession = async (req, res) => {
  try {
    const auth0Id = req.auth.sub;
    const user = await User.findOne({ auth0Id });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const { sessionId } = req.params;
    const { firstMessage } = req.body;

    const prompt = `Given this user message, generate a short, descriptive title for the chat session: "${firstMessage}"`;

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4-turbo',
        messages: [{ role: 'system', content: prompt }],
        temperature: 0.5,
        max_tokens: 10,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const rawTitle = response.data.choices[0].message.content.trim();
    const title = rawTitle.replace(/^["']|["']$/g, '');

    const session = await ChatSession.findOneAndUpdate(
      { _id: sessionId, userId: user._id },
      { title },
      { new: true }
    );

    res.json({ title: session.title });
  } catch (err) {
    console.error('Error naming session:', err.response?.data || err.message);
    res.status(500).json({ error: 'Failed to name session' });
  }
};

const renameSession = async (req, res) => {
  try {
    const auth0Id = req.auth.sub;
    const user = await User.findOne({ auth0Id });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const { sessionId } = req.params;
    const { newTitle } = req.body;

    const session = await ChatSession.findOneAndUpdate(
      { _id: sessionId, userId: user._id },
      { title: newTitle },
      { new: true }
    );

    if (!session) return res.status(404).json({ error: 'Session not found' });

    res.json({ title: session.title });
  } catch (err) {
    console.error('Error renaming session:', err.message);
    res.status(500).json({ error: 'Failed to rename session' });
  }
};

const deleteSession = async (req, res) => {
  try {
    const auth0Id = req.auth.sub;
    const user = await User.findOne({ auth0Id });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const deletedSession = await ChatSession.findOneAndDelete({
      _id: req.params.sessionId,
      userId: user._id,
    });

    if (!deletedSession) return res.status(404).json({ error: 'Session not found or unauthorized' });

    await ChatHistory.deleteMany({ sessionId: req.params.sessionId });

    res.status(200).json({ message: 'Session and messages deleted successfully' });
  } catch (err) {
    console.error('Error deleting session:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { 
    createSession, 
    getUserSessions, 
    nameSession,
    renameSession,
    deleteSession, 
};