const express = require('express');
const router = express.Router();
const checkJwt = require('../middleware/authMiddleware');
const {
  submitQuestionnaire,
  updateQuestionnaire,
  getQuestionnaireByUser,
  deleteQuestionnaire,
} = require('../controllers/questionnaireController');

router.use(checkJwt);

router.post('/:userId', submitQuestionnaire);
router.put('/:userId', updateQuestionnaire);
router.get('/:userId', getQuestionnaireByUser);
router.delete('/me', deleteQuestionnaire);

module.exports = router;