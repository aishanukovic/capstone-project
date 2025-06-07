const Questionnaire = require('../models/Questionnaire');
const User = require('../models/User');

const submitQuestionnaire = async (req, res) => {
  try {
    const user = await User.findOne({ auth0Id: req.params.userId });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const existing = await Questionnaire.findOne({ userId: user._id });
    if (existing) {
      existing.answers = req.body.answers;
      existing.completedAt = new Date();
      await existing.save();
      return res.status(200).json(existing);
    }

    const newEntry = await Questionnaire.create({
      userId: user._id,
      answers: req.body.answers,
    });

    res.status(201).json(newEntry);
  } catch (err) {
    console.error('Error submitting questionnaire:', err);
    res.status(400).json({ error: err.message });
  }
};

const updateQuestionnaire = async (req, res) => {
  try {
    const user = await User.findOne({ auth0Id: req.params.userId });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const updated = await Questionnaire.findOneAndUpdate(
      { userId: user._id },
      {
        answers: req.body.answers,
        completedAt: new Date(),
      },
      { new: true }
    );

    if (!updated) return res.status(404).json({ error: 'No existing questionnaire to update' });

    res.status(200).json(updated);
  } catch (err) {
    console.error('Error updating questionnaire:', err);
    res.status(400).json({ error: err.message });
  }
};

const getQuestionnaireByUser = async (req, res) => {
  try {
    const user = await User.findOne({ auth0Id: req.params.userId });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const questionnaire = await Questionnaire.findOne({ userId: user._id });
    if (!questionnaire) return res.status(404).json({ error: 'Not found' });
    res.json(questionnaire);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteQuestionnaire = async (req, res) => {
  try {
    const auth0Id = req.auth.sub;

    const user = await User.findOne({ auth0Id });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const deleted = await Questionnaire.findOneAndDelete({ userId: user._id });
    if (!deleted) return res.status(404).json({ error: 'No questionnaire to delete' });

    res.json({ message: 'Questionnaire deleted successfully.' });
  } catch (err) {
    console.error('Error deleting questionnaire:', err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  submitQuestionnaire,
  updateQuestionnaire,
  getQuestionnaireByUser,
  deleteQuestionnaire,
};