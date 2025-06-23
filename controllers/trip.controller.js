import mongoose from "mongoose";
import Product from "../models/trip.model.js"
import Trip from "../models/trip.model.js";

export const getAllTrips = async (req, res) => {
	try {
		const trips = await Trip.find({});
		res.status(200).json({ success: true, data: trips });
	} catch (error) {
		console.log("Error in fetching trips:", error.message);
		res.status(500).json({ success: false, message: "Server Error" });
	}
};

export const saveTrip = async (req, res) => {
	const trip = req.body; // user will send this data

	if (!trip.title || !trip.destination || !trip.startDate || !trip.endDate || !trip.budget) {
		return res.status(400).json({ success: false, message: "Please provide all fields" });
	}

	const newTrip = new Trip(trip);

	try {
		await newTrip.save();
		res.status(201).json({ success: true, data: newTrip });
	} catch (error) {
		console.error("Error in Creating Trip:", error.message);
		res.status(500).json({ success: false, message: "Server Error" });
	}
};

export const updateTrip = async (req, res) => {
	const { id } = req.params;

	const trip = req.body;

	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(404).json({ success: false, message: "Invalid Trip Id" });
	}

	try {
		const updatedTrip = await Trip.findByIdAndUpdate(id, trip, { new: true });
		res.status(200).json({ success: true, data: updatedTrip });
	} catch (error) {
		res.status(500).json({ success: false, message: "Server Error" });
	}
};

export const deleteTrip = async (req, res) => {
	const { id } = req.params;

	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(404).json({ success: false, message: "Invalid Trip Id" });
	}

	try {
		await Product.findByIdAndDelete(id);
		res.status(200).json({ success: true, message: "Trip deleted" });
	} catch (error) {
		console.log("error in deleting trip:", error.message);
		res.status(500).json({ success: false, message: "Server Error" });
	}
};