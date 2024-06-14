// require('dotenv').config({path: './.env'});
import dotenv from "dotenv";
import connectDB from "./db/index.js";

dotenv.config({path: "./env"});

connectDB()
.then(() => {
    app.on('error', (error) => {
        console.log(`Server error: ${error}`);
    });
    app.listten(process.env.PORT || 8000, () => {
        console.log(`Server is running on port ${process.env.PORT || 8000}`);
    });
})
.catch((error) => {
    console.log(`Connection to DB failed: ${error}`);
})
