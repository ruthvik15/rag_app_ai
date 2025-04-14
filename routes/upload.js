const express = require('express');
const multer = require('multer');
const File = require('../models/File');
const path = require('path');
const { spawn } = require('child_process');

const router = express.Router();

const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// ✅ Function that runs Python script and waits for completion
const runEmbeddingScript = (pdfPath, userId, fileId) => {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(__dirname, '..', 'rag-processor', 'ingest.py');

    const process = spawn('python', [scriptPath, pdfPath, userId, fileId]);

    process.stdout.on('data', (data) => {
      console.log(`✅ Python Output [${fileId}]: ${data}`);
    });

    process.stderr.on('data', (data) => {
      console.warn(`⚠️ Python Error [${fileId}]: ${data}`);
    });

    process.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Embedding script failed with code ${code}`));
      }
    });
  });
};

router.post('/upload', upload.array('pdf', 5), async (req, res) => {
  if (!req.session.userId) return res.status(401).json({ error: 'Unauthorized' });

  const userId = req.session.userId;
  let latestFileId = null;

  try {
    for (const uploadedFile of req.files) {
      const file = new File({
        userId,
        filename: uploadedFile.filename,
        originalname: uploadedFile.originalname,
      });

      await file.save();

      const pdfPath = path.join(__dirname, '..', 'uploads', uploadedFile.filename);
      const fileId = file._id.toString();
      latestFileId = fileId;

      await runEmbeddingScript(pdfPath, userId, fileId); // Wait for embedding
    }

    // Send JSON response back to client
    res.json({ success: true, fileId: latestFileId });

  } catch (err) {
    console.error("❌ Error during embedding:", err);
    res.status(500).json({ success: false, error: 'Error processing your files.' });
  }
});

module.exports = router;
