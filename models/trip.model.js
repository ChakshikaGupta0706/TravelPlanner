import mongoose from "mongoose";

const tripSchema = new mongoose.Schema({
    title: { type: String, required: true },
    destination: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    budget: { type: Number },
    image: { type: String },
    activities: [String],
    travelers: { type: Number },
    accommodation: { type: String },
    localTips: String,
});

const Trip = mongoose.model("Trip", tripSchema);

export default Trip;