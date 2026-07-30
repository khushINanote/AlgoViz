import mongoose from 'mongoose';

let cached = null;

export const connectDB = async () => {
    // Reuse existing connection if available and ready
    if (cached && mongoose.connection.readyState === 1) {
        return cached;
    }

    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            bufferCommands: false,
        });
        cached = conn;
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        return conn;
    } catch (error) {
        console.error(`Error: ${error.message}`);
        throw error;
    }
};
