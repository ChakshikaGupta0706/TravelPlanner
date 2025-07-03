const Trip = require('../models/trip.model.js')
const TripDetails = require('../models/tripDetails.model.js');

exports.getCombinedTripInfo = async (req, res) => {
    const {tripId} = req.params;
    try {
        const trip = await Trip.findById(tripId);
        const tripDetails = await TripDetails.findOne({ tripId });

        if (!trip) return res.status(404).json({ success: false, message: "Trip not found"});
        const combined = {
            ...trip.toObject(),
            ...(tripDetails ? tripDetails.toObject() : {})
        };
        res.json({ success: true, data: combined });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

exports.saveTripDetails = async (req, res) => {
    const { tripId } = req.params;

    try {
        const updated = await TripDetails.findOneAndUpdate(
            { tripId },
            req.body,
            { new: true, upsert: true }
        );
        res.json({ success: true, data: updated });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Create new details
exports.createDetails = async (req, res) => {
    try {
        const newDetails = new TripDetails(req.body);
        await newDetails.save();
        res.status(201).json(newDetails);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get details by tripId
exports.getDetails = async (req, res) => {
    try {
        const details = await TripDetails.findOne({ tripId: req.params.tripId });
        if (!details) return res.status(404).json({ message: "Not found" });
        res.json(details);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update tripDetails
exports.updateDetails = async (req, res) => {
    try {
        const updated = await TripDetails.findOneAndUpdate(
            { tripId: req.params.tripId },
            req.body,
            { new: true, upsert: true }
        );
        res.json(updated);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Mark trip as completed
exports.markCompleted = async (req, res) => {
    try {
        const updated = await TripDetails.findOneAndUpdate(
            { tripId: req.params.tripId },
            { completed: true },
            { new: true }
        );
        res.json(updated);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

