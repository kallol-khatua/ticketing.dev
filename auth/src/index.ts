require('dotenv').config();
import { app } from "./app";
import { connectDB } from "./services/dbConnection"

const PORT = 3000;

// Connection to database and server starting up
(async () => {
    // Check all the env varible exist or not if not exist then do not start the app
    if (!process.env.MONGO_URI || !process.env.SALT_ROUNDS || !process.env.JWT_SECRET
        || !process.env.JWT_EXPIRY_TIME
    ) {
        console.log("Envirnment varible not found, Exiting app!")
        process.exit(1);
    }

    await connectDB();

    app.listen(PORT, () => {
        console.log(`Server is running at port ${PORT}`);
    });
})();
