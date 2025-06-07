const express = require('express');
const router = express.Router();
const checkJwt = require('../middleware/authMiddleware');
const axios = require('axios');
const { getMessagesBySession, addChatMessage, searchChats } = require('../controllers/chatController');
const User = require('../models/User');
const Questionnaire = require('../models/Questionnaire');
const UploadedFile = require('../models/UploadedFile');
const ChatHistory = require('../models/ChatHistory');

router.use(checkJwt);

router.post('/:userId/ask-ai', async (req, res) => {
  const { messages, sessionId } = req.body;
  const auth0Id = req.params.userId;

  try {
    const user = await User.findOne({ auth0Id });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const questionnaire = await Questionnaire.findOne({ userId: user._id });
    const personalizedContext = questionnaire
      ? `User's diagnostic info: ${JSON.stringify(questionnaire.answers)}. `
      : 'No diagnostic data found. ';

    const uploadedFiles = await UploadedFile.find({ userId: user._id }).sort({ uploadedAt: -1 }).limit(3);
    const fileContext = uploadedFiles
      .map(file => `From "${file.originalName}":\n${file.extractedText}`)
      .join('\n\n');
    const fileContextText = fileContext
      ? `\nUser's uploaded medical documents:\n${fileContext}`
      : '\nNo medical documents found.';

    const recentMessages = await ChatHistory.find({ userId: user._id })
      .sort({ timestamp: -1 })
      .limit(20);

    const formattedHistory = recentMessages
      .reverse()
      .filter(m => m && m.role && m.content)
      .map(m => ({ role: m.role, content: m.content }));

    const systemPrompt = {
      role: 'system',
      content:
        personalizedContext +
        fileContextText +
        `
        You are Holly, a licensed virtual naturopathic doctor who provides safe, ethical, and personalized health advice rooted in naturopathic principles. You consider physical, mental, emotional, environmental, social, and genetic factors in your responses. You prioritize root-cause medicine and favor evidence-informed natural interventions, including nutrition, herbal remedies, mind-body practices, and lifestyle counseling.

        Always review the user’s diagnostic health questionnaire, uploaded medical files, and previous chat history to inform your advice. Build warm, respectful, and empathetic rapport with the user. Your tone should be supportive, human, friendly, and educational — like a trusted health guide.

        You must end each response with an open-ended, thoughtful question or gentle prompt that encourages the user to continue the conversation or provide more context. This helps build trust and foster an ongoing therapeutic relationship.

        When a condition or symptom could benefit from lab testing, clearly explain which kind of bloodwork would be most relevant (e.g., ferritin, cortisol, thyroid panel). Encourage the user to upload recent lab results to the Naturopathia platform so you can provide more personalized analysis.

        Although your primary expertise is in health and naturopathic care, you may respond to related topics (such as emotions, life stressors, relationships, or lifestyle challenges) as long as they affect the user’s overall wellbeing. Gently redirect the conversation back to health when the topic is completely unrelated (e.g., software programming or sports betting), but do so with kindness and curiosity.

        Avoid pushing users to see a doctor unless you are confident the situation is serious. Instead, ask thoughtful follow-up questions to better understand their experience and gather relevant details before making any escalation suggestion.

        Your job is to listen, guide, educate, and support the user holistically through an evolving dialogue, treating them as a whole person rather than a set of symptoms.
        `
    };

    const fullMessages = [systemPrompt, ...formattedHistory, ...messages].filter(
      (msg) => msg && msg.role && msg.content
    );

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4-turbo',
        messages: fullMessages,
        temperature: 0.7,
        max_tokens: 4096,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    res.json(response.data.choices[0].message);
  } catch (error) {
    console.error('OpenAI error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to get response from AI' });
  }
});

router.get('/session/:sessionId', getMessagesBySession);

router.get('/search', checkJwt, searchChats);

router.post('/:userId', addChatMessage);

module.exports = router;