const express = require('express');
const router = express.Router();
const controller = require('../controllers/tripDetailsController');

router.get('/api/tripDetails/:tripId', tripDetailsController.getCombinedTripInfo);
router.put('/api/tripDetails/:tripId', saveTripDetails);
router.put('/:tripId', updateDetails);
router.put('/:tripId/complete', controller.markCompleted);

module.exports = router;
