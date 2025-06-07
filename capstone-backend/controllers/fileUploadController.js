const { Storage } = require('@google-cloud/storage');
const vision = require('@google-cloud/vision');
const streamifier = require('streamifier');
const cloudinary = require('../utils/cloudinary');
const UploadedFile = require('../models/UploadedFile');
const User = require('../models/User');

const visionClient = new vision.ImageAnnotatorClient();
const storage = new Storage();
const bucketName = process.env.GCS_BUCKET_NAME;

const uploadFile = async (req, res) => {
  try {
    const file = req.file;
    const auth0Id = req.body.userId;

    if (!file || !auth0Id) return res.status(400).send("Missing file or userId");

    const user = await User.findOne({ auth0Id });
    if (!user) return res.status(404).send("User not found");

    const userId = user._id;
    const originalName = file.originalname;
    const isPdf = originalName.toLowerCase().endsWith('.pdf');

    const cloudinaryResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'naturopathia' },
        (err, result) => (err ? reject(err) : resolve(result))
      );
      streamifier.createReadStream(file.buffer).pipe(stream);
    });

    let extractedText = '';

    if (isPdf) {
      const gcsFileName = `uploads/${Date.now()}_${originalName}`;
      const bucket = storage.bucket(bucketName);
      const gcsFile = bucket.file(gcsFileName);

      await gcsFile.save(file.buffer, {
        resumable: false,
        contentType: file.mimetype,
      });

      const resultFileId = `${Date.now()}_result.json`;
      const outputUri = `gs://${bucketName}/${process.env.GCS_RESULT_PREFIX}/${resultFileId}`;

      const request = {
        requests: [
          {
            inputConfig: {
              gcsSource: { uri: `gs://${bucketName}/${gcsFileName}` },
              mimeType: 'application/pdf',
            },
            features: [{ type: 'DOCUMENT_TEXT_DETECTION' }],
            outputConfig: {
              gcsDestination: { uri: outputUri },
              batchSize: 1,
            },
          },
        ],
      };

      const [operation] = await visionClient.asyncBatchAnnotateFiles(request);
      console.log('Waiting for OCR operation to finish...');
      await operation.promise();
      console.log('OCR completed.');

      const [files] = await bucket.getFiles({
        prefix: `${process.env.GCS_RESULT_PREFIX}/${resultFileId.split('_')[0]}`,
      });

      for (const file of files) {
        const [contents] = await file.download();
        const json = JSON.parse(contents.toString('utf8'));
        const text = json.responses?.[0]?.fullTextAnnotation?.text || '';
        extractedText += text + '\n';
      }
    } else {
      const [visionResult] = await visionClient.textDetection(cloudinaryResult.secure_url);
      extractedText = visionResult.fullTextAnnotation?.text || '';
    }

    const newFile = await UploadedFile.create({
      userId,
      fileUrl: cloudinaryResult.secure_url,
      originalName,
      extractedText: extractedText.trim(),
    });

    res.status(201).json(newFile);
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: err.message });
  }
};

const getFilesByUser = async (req, res) => {
  try {
    const { userId: auth0Id } = req.params;

    const user = await User.findOne({ auth0Id });
    if (!user) return res.status(404).send('User not found');

    const files = await UploadedFile.find({ userId: user._id }).sort({ uploadedAt: -1 });
    res.json(files);
  } catch (err) {
    console.error('Error fetching files:', err);
    res.status(500).json({ error: err.message });
  }
};

const deleteFile = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await UploadedFile.findByIdAndDelete(id);
    if (!deleted) return res.status(404).send("File not found");
    res.status(204).send();
  } catch (err) {
    console.error('Error deleting file:', err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  uploadFile,
  getFilesByUser,
  deleteFile,
};