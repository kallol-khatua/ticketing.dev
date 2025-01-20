import dotenv from 'dotenv';

// Either load a specific env file for test or hardcore value
dotenv.config({ path: '.env.test' });

// process.env.MONGO_URI = "mongodb://localhost:27017/ticketing-test";
// process.env.JWT_SECRET = "test-jwt-secret-JSAJS6&U^86yagsajsgsds7";