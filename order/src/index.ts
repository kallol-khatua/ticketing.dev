import dotenv from 'dotenv';
dotenv.config();
import { app } from "./app";
import { connectDB } from "./services/dbConnection"
import { startConsumer } from './kafka/consumer';
import { startProducer } from './kafka/producer';

const PORT = Number(process.env.ORDER_SERVICE_PORT!) || 3002;

// Connection to database and server starting up
(async () => {
    // Check all the env varible exist or not if not exist then do not start the app
    if (!process.env.MONGO_URI || !process.env.JWT_SECRET || !process.env.ORDER_SERVICE_PORT
        || !process.env.KAFKA_BROKER
    ) {
        console.log("Envirnment varible not found, Exiting app!")
        process.exit(1);
    }

    try {
        await startConsumer();
        await startProducer();
    } catch (error) {
        process.exit(1);
    }

    await connectDB();

    app.listen(PORT, () => {
        console.log(`Server is running at port ${PORT}`);
    });
})();
