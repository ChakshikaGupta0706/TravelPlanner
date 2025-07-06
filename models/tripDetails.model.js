import mongoose from 'mongoose';

const tripDetailsSchema = new mongoose.Schema({
    tripId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true },
    mandatoryItems: [String],
    hotelName: String,
    stayReview: String,
    attractions: [String],
    expenses: [{
        item: String,
        spenddate: Date,
        category: String,
        amount: Number
    }],
    itinerary: [{
        day: Number,
        activities: [String]
    }],
    completed: { type: Boolean, default: false }
});

const TripDetails = mongoose.model('TripDetails', tripDetailsSchema);
export default TripDetails;
