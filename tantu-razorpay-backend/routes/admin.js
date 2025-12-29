import express from 'express';

const router = express.Router();

router.post('/login', (req, res) => {
  try {
    const { password } = req.body;
    
    if (!password) {
      return res.status(400).json({ success: false, error: 'Password required' });
    }
    
    if (password === process.env.ADMIN_PASSWORD) {
      return res.json({ success: true, message: '✅ Login successful' });
    }
    
    return res.status(401).json({ success: false, error: 'Wrong password' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;