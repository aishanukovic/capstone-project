const mongoose = require('mongoose');

const QuestionnaireSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  answers: { type: Object, required: true },
  completedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Questionnaire', QuestionnaireSchema);