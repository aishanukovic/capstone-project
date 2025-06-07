const express = require('express');
const { createSession, getUserSessions, deleteSession } = require('../controllers/sessionController');
const checkJwt = require('../middleware/authMiddleware');
const { nameSession } = require('../controllers/sessionController');
const { renameSession } = require('../controllers/sessionController');

const router = express.Router();

router.post('/', checkJwt, createSession);
router.get('/', checkJwt, getUserSessions);
router.post('/:sessionId/name', checkJwt, nameSession);
router.patch('/:sessionId/rename', checkJwt, renameSession);
router.delete('/:sessionId', checkJwt, deleteSession);

module.exports = router;