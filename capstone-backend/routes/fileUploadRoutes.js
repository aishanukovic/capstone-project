const express = require('express');
const multer = require('multer');
const router = express.Router();
const upload = multer();

const checkJwt = require('../middleware/authMiddleware');

const {
  uploadFile,
  deleteFile,
  getFilesByUser,
} = require('../controllers/fileUploadController');

router.post('/', checkJwt, upload.single('file'), uploadFile);
router.get('/:userId', checkJwt, getFilesByUser);
router.delete('/:id', checkJwt, deleteFile);

module.exports = router;