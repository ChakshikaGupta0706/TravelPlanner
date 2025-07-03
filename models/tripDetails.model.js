const mongoose = require('mongoose');

const tripDetailsSchema = new mongoose.Schema({
    tripId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true },
    mandatoryItems: [String],
    hotelName: String,
    review: String,
    attractions: [String],
    expenses: [{
        item: String,
        date: Date,
        category: String,
        amount: Number
    }],
    itinerary: [{
        day: Number,
        activities: [String]
    }],
    completed: { type: Boolean, default: false }
});

module.exports = mongoose.model('TripDetails', tripDetailsSchema);
