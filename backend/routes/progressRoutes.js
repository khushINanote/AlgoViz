import express from 'express';
import { getDashboardData, updateProgress, saveQuizScore } from '../controllers/progressController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.route('/').get(protect, getDashboardData);
router.route('/update').post(protect, updateProgress);
router.route('/quiz').post(protect, saveQuizScore);

export default router;
