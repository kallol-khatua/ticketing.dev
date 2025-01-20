import mongoose from "mongoose";

beforeAll(async () => {
    try {
        process.env.JWT_SECRET = "alshakshakh";

        await mongoose.connect("mongodb://localhost:27017/ticketing-test");
    } catch (error) {
        console.error("Error connecting to the database", error);
    }
})

beforeEach(async () => {
    if (mongoose.connection.db) {
        const collections = await mongoose.connection.db.collections();

        for (let collection of collections) {
            try {
                await collection.deleteMany({});
                await collection.dropIndexes();
            } catch (error) {
                console.error(`Error clearing collection`, error);
            }
        }
    }
})

afterAll(async () => {
    try {
        await mongoose.connection.close();
    } catch (error) {
        console.error("Error closing the database connection", error);
    }
})