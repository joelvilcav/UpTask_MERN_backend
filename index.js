import express from 'express';
import dotenv from 'dotenv';
import connectionToDb from './config/db.js';

const app = express();
dotenv.config();
connectionToDb();

const PORT = process.env.PORT || 4000;

app.listen(() => {
  console.log(`Server running on port ${PORT}`);
});
