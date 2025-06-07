const mongoose = require('mongoose');

const UploadedFileSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  fileUrl: String,
  originalName: String,
  extractedText: String,
  uploadedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('UploadedFile', UploadedFileSchema);