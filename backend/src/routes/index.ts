import { Router } from 'express';
import userRoutes from './userRoutes';

const router = Router();

// API routes
router.use('/users', userRoutes);

// Test route
router.get('/test', (_req, res) => {
  res.json({
    success: true,
    message: 'API is working!',
    timestamp: new Date().toISOString()
  });
});

export default router;