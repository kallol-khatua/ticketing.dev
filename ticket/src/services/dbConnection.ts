import mongoose from 'mongoose';
const MONGO_URI = process.env.MONGO_URI!;

export const connectDB = async (): Promise<void> => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB successfully');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
};

// Disconnect Function
export const disconnectDB = async (): Promise<void> => {
    try {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
        process.exit(1);
    } catch (error) {
        console.error('Error disconnecting from MongoDB:', error);
    }
};