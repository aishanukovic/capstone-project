const express = require('express');
const router = express.Router();
const checkJwt = require('../middleware/authMiddleware');
const { createUser, getUser, syncUser } = require('../controllers/userController');

router.post('/', checkJwt, syncUser, (req, res) => {
  console.log('POST /api/users hit');
  res.send('This is the POST route');
});

router.get('/:id', checkJwt, getUser);

router.get('/secure-data/test', checkJwt, (req, res) => {
  res.json({
    message: 'This is protected data from Auth0!',
    user: req.auth,
  });
});

module.exports = router;