import express from 'express';
import multer from 'multer';
import {
  getCombinedTripInfo,
  saveTripDetails,
  updateDetails,
  markCompleted
} from '../controllers/tripDetails.controller.js';
import { authenticateUser } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/combined/:tripId', getCombinedTripInfo);
router.put('/:tripId', saveTripDetails);
router.put('/:tripId', updateDetails);
router.put('/:tripId/complete', markCompleted);
router.put('/:tripId', authenticateUser, updateDetails);

export default router;
