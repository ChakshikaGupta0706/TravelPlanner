import mongoose from "mongoose";
import Trip from "../models/trip.model.js";
import TripDetails from "../models/tripDetails.model.js";

export const getCombinedTripInfo = async (req, res) => {
    try {
        const {tripId} = req.params;
        const trip = await Trip.findById(tripId);
        const tripDetails = await TripDetails.findOne({ tripId: new mongoose.Types.ObjectId(tripId) });

        console.log("Fetching combined tripinfo for tripId:", tripId);

        if (!trip) {
            return res.status(404).json({ success: false, message: 'Trip not found' })
        };

         return res.json({ success: true, data: { trip, tripDetails: tripDetails || {} } });
    } catch (err) {
        console.error('Error fetching combined trip info:', err);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

export const saveTripDetails = async (req, res) => {
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
export const createDetails = async (req, res) => {
    try {
        const newDetails = new TripDetails(req.body);
        await newDetails.save();
        res.status(201).json(newDetails);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get details by tripId
export const getDetails = async (req, res) => {
    try {
        const details = await TripDetails.findOne({ tripId: req.params.tripId });
        if (!details) return res.status(404).json({ message: "Not found" });
        res.json(details);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update tripDetails
export const updateDetails = async (req, res) => {
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
export const markCompleted = async (req, res) => {
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
