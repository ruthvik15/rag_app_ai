const express = require('express');
const router = express.Router();
const File = require('../models/File');
const Chat = require('../models/Chat');
const fs = require('fs');
const path = require('path');

router.post('/delete', async (req, res) => {
  const { fileId } = req.body;
  const userId = req.session.userId;

  try {
    const file = await File.findOne({ _id: fileId, userId });
    if (!file) return res.status(404).send('File not found.');

    const filePath = path.join(__dirname, '..', 'uploads', file.filename);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    await File.deleteOne({ _id: fileId });
    await Chat.deleteMany({ fileId });

    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error deleting file.');
  }
});

module.exports = router;
