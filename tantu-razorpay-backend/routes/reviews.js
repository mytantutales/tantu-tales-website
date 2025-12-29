import express from 'express';
import Review from '../models/Review.js';

const router = express.Router();

router.post('/create', async (req, res) => {
  try {
    const { productId, rating, reviewerName, reviewerEmail, reviewText } = req.body;
    if (!rating || rating < 1 || rating > 5) return res.status(400).json({ error: 'Invalid rating' });
    const review = new Review({ productId, rating, reviewerName, reviewerEmail, reviewText });
    await review.save();
    res.json({ success: true, message: '✅ Review submitted!' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/product/:productId', async (req, res) => {
  try {
    const reviews = await Review.find({ productId: req.params.productId, approved: true }).sort({ createdAt: -1 });
    const avgRating = reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : 0;
    res.json({ success: true, reviews, averageRating: avgRating });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;