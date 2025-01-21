import dotenv from 'dotenv';
import { startConsumer } from "./src/kafka/consumer"
import { startProducer } from "./src/kafka/producer"

// Either load a specific env file for test or hardcore value
dotenv.config({ path: '.env.test' });

(async () => {
    try {
        await startConsumer();
        await startProducer();
    } catch (error) {

    }
})()

// process.env.MONGO_URI = "mongodb://localhost:27017/ticketing-test";
// process.env.JWT_SECRET = "test-jwt-secret-JSAJS6&U^86yagsajsgsds7";