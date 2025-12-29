import express from 'express';
import Newsletter from '../models/Newsletter.js';

const router = express.Router();

router.post('/subscribe', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !email.includes('@')) return res.status(400).json({ error: 'Invalid email' });
    const existing = await Newsletter.findOne({ email });
    if (existing) return res.status(400).json({ error: 'Already subscribed' });
    const subscriber = new Newsletter({ email });
    await subscriber.save();
    res.json({ success: true, message: '✅ Subscribed!' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;