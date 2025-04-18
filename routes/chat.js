
const express = require('express');
const router = express.Router();
const Chat = require('../models/Chat');
const { chatWithPDF } = require('../utils/chatWithPdf');

// 🧠 Chat POST route
router.post('/chat', async (req, res) => {
  try {
    const { question, fileId } = req.body;
    const userId = req.session.userId;

    if (!question || !fileId) {
      return res.status(400).json({ error: 'Missing question or fileId' });
    }

    const answer = await chatWithPDF(userId, fileId, question);

    const chat = new Chat({
      userId,
      fileId,
      question,
      answer,
      timestamp: new Date()
    });

    const savedChat = await chat.save(); 

 
    res.json({ answer, chatId: savedChat._id });

  } catch (err) {
    console.error('❌ Chat error:', err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});



router.delete('/chat/delete', async (req, res) => {
  const { fileId } = req.body;
  const userId = req.session.userId;

  try {
    await Chat.deleteMany({ userId, fileId });
    res.json({ success: true, message: 'Chat history deleted.' });
  } catch (error) {
    console.error('❌ Error deleting chat:', error);
    res.status(500).json({ success: false, message: 'Failed to delete chat history.' });
  }
});
router.delete('/chat/:chatId', async (req, res) => {
  const chatId = req.params.chatId;
  const userId = req.session.userId;

  try {
    const result = await Chat.deleteOne({ _id: chatId, userId });
    if (result.deletedCount === 1) {
      res.json({ success: true });
    } else {
      res.status(404).json({ success: false, message: "Chat not found" });
    }
  } catch (err) {
    console.error('Error deleting chat:', err);
    res.status(500).json({ success: false });
  }
});

module.exports = router;

