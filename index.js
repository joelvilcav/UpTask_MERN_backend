import express from 'express';
import dotenv from 'dotenv';
import connectionToDb from './config/db.js';

const app = express();
dotenv.config(); //To set our environment variables
connectionToDb(); // Call the connection to the database

const PORT = process.env.PORT || 4000;

app.listen(() => {
  console.log(`Server running on port ${PORT}`);
});
