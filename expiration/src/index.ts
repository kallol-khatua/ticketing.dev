import dotenv from 'dotenv';
dotenv.config();
import { startProducer } from "./kafka/producer"
import { startConsumer } from './kafka/consumer';
import { startWorker } from "./queues/worker"

(async () => {
    // Check all the env varible exist or not if not exist then do not start 
    if (!process.env.REDIS_HOST || !process.env.REDIS_PORT || !process.env.KAFKA_BROKER
        || !process.env.JOB_DELAY
    ) {
        console.log("Envirnment varible not found, Exiting app!")
        process.exit(1);
    }

    try {
        await startConsumer();
        await startProducer();
        await startWorker();
    } catch (error) {
        process.exit(1)
    }

    console.log("Expiration service is running");
})();
