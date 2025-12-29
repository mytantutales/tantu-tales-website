import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  reviewerName: { type: String, required: true },
  reviewerEmail: { type: String, required: true },
  reviewText: { type: String, required: true, maxLength: 500 },
  approved: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const Review = mongoose.model('Review', reviewSchema);
export default Review;