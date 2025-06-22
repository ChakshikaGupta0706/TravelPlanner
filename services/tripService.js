const Trip = require('../models/Trip');

async function saveTrip(tripData) {
    try {
        const trip = new Trip(tripData);
        const savedTrip =  await trip.save();
        return savedTrip;
    } catch (error) {
        console.error('Error saving trip:', error);
        throw error;
    }
}

async function getAllTrips() {
    try {
        const trips = await Trip.find().sort( {createdAt: -1});
        return trips;
    } catch (error) {
        console.error('Error retrieving trips:', error);
        throw error;
    }
}

async function getTripById(tripId) {
    try {
        const trip = await Trip.findById(tripId);
        return trip;
    } catch (error) {
        console.error('Error retrieving trip:', error);
        throw error;
    }
}

async function updateTrip(tripId, updateData) {
    try {
        const updateTrip = await Trip.findByIdAndUpdate(tripId, updateData, {new: true});
        return updatedTrip;
    } catch (error) {
        console.error('Error updating Trip:', error);
        throw error;
    }
}

async function deleteTrip(tripId) {
    try {
        const result = await Trip.findByIdAndDelete(tripId);
        return result;
    } catch (error) {
        console.error('Error deleting trip:', error);
        throw error;
    }
}

module.exports = {saveTrip, getAllTrips, getTripById, updateTrip, deleteTrip};