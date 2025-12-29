import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import 'dotenv/config';

import connectDB from './config/database.js';
import orderRoutes from './routes/orders.js';
import reviewRoutes from './routes/reviews.js';
import newsletterRoutes from './routes/newsletter.js';
import adminRoutes from './routes/admin.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: '*',
  credentials: true
}));
app.use(bodyParser.json());

// Health check
app.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: '✅ Tantu Tales Backend with MongoDB!',
    database: 'Connected to MongoDB Atlas',
    endpoints: {
      orders: 'POST /api/orders/create',
      reviews: 'POST /api/reviews/create',
      newsletter: 'POST /api/newsletter/subscribe',
      admin: 'POST /api/admin/login'
    }
  });
});

// API Routes
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/admin', adminRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error('❌ Error:', err);
  res.status(500).json({ error: 'Server error' });
});

app.listen(PORT, () => {
  console.log('\n✅✅✅ BACKEND RUNNING AT PORT 3000 ✅✅✅');
  console.log(`📊 MongoDB Connected and Ready!`);
  console.log(`🌐 Visit: http://localhost:${PORT}\n`);
});