import express from 'express';
import multer from 'multer';
import {
  getCombinedTripInfo,
  saveTripDetails,
  updateDetails,
  markCompleted
} from '../controllers/tripDetails.controller.js';

const router = express.Router();

router.get('/tripDetails/:tripId', getCombinedTripInfo);
router.put('/:tripId', saveTripDetails);
router.put('/:tripId', updateDetails);
router.put('/:tripId/complete', markCompleted);

export default router;
