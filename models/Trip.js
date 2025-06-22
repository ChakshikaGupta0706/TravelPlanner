const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
    title: { type: String, required: true },
    destination: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    budget: { type: Number },
    activities: [String],
    notes: String,
    createdAt: { type: Date, default: Date.now }

});

module.exports = mongoose.model('Trip', tripSchema);