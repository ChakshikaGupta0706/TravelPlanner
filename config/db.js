import mongoose from "mongoose";

export const connectDB = async () => {
    console.log('MONGODB_URI:', process.env.MONGODB_URI);
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB Connected Successfully to: ${conn.connection.name || 'MongoDB Atlas'}`);

    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};