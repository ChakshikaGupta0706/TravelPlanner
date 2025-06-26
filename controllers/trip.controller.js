import mongoose from "mongoose";
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
	try {
		console.log("Request body:", req.body);
		console.log("Request file:", req.file);
		
		const trip = req.body;
		
		// Handle image upload
		if (req.file) {
			trip.image = `/uploads/${req.file.filename}`;
		}
		
		// Validate required fields
		if (!trip.title || !trip.destination || !trip.startDate || !trip.endDate) {
			return res.status(400).json({ 
				success: false, 
				message: "Please provide title, destination, start date, and end date" 
			});
		}
		
		// Parse activities if it's a string (from FormData)
		if (typeof trip.activities === 'string') {
			try {
				trip.activities = JSON.parse(trip.activities);
			} catch (e) {
				console.log("Error parsing activities:", e);
				trip.activities = [];
			}
		}
		
		// Convert string numbers to actual numbers
		if (trip.budget) {
			trip.budget = parseFloat(trip.budget);
		}
		if (trip.travelers) {
			trip.travelers = parseInt(trip.travelers);
		}
		
		// Convert date strings to Date objects
		trip.startDate = new Date(trip.startDate);
		trip.endDate = new Date(trip.endDate);
		
		console.log("Processed trip data:", trip);
		
		const newTrip = new Trip(trip);
		await newTrip.save();
		
		res.status(201).json({ success: true, data: newTrip });
	} catch (error) {
		console.error("Error in Creating Trip:", error.message);
		console.error("Full error:", error);
		res.status(500).json({ success: false, message: "Server Error: " + error.message });
	}
};

export const updateTrip = async (req, res) => {
	const { id } = req.params;
	const trip = req.body;
	
	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(404).json({ success: false, message: "Invalid Trip Id" });
	}
	
	try {
		// Handle image upload for updates
		if (req.file) {
			trip.image = `/uploads/${req.file.filename}`;
		}
		
		// Parse activities if it's a string (from FormData)
		if (typeof trip.activities === 'string') {
			try {
				trip.activities = JSON.parse(trip.activities);
			} catch (e) {
				// Keep existing activities if parsing fails
			}
		}
		
		// Convert string numbers to actual numbers
		if (trip.budget) {
			trip.budget = parseFloat(trip.budget);
		}
		if (trip.travelers) {
			trip.travelers = parseInt(trip.travelers);
		}
		
		// Convert date strings to Date objects
		if (trip.startDate) {
			trip.startDate = new Date(trip.startDate);
		}
		if (trip.endDate) {
			trip.endDate = new Date(trip.endDate);
		}
		
		const updatedTrip = await Trip.findByIdAndUpdate(id, trip, { new: true });
		res.status(200).json({ success: true, data: updatedTrip });
	} catch (error) {
		console.error("Error in updating trip:", error);
		res.status(500).json({ success: false, message: "Server Error" });
	}
};

export const deleteTrip = async (req, res) => {
	const { id } = req.params;
	
	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(404).json({ success: false, message: "Invalid Trip Id" });
	}
	
	try {
		await Trip.findByIdAndDelete(id);
		res.status(200).json({ success: true, message: "Trip deleted" });
	} catch (error) {
		console.log("error in deleting trip:", error.message);
		res.status(500).json({ success: false, message: "Server Error" });
	}
};