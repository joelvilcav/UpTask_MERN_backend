import express from 'express';
import dotenv from 'dotenv';

import connectionToDb from './config/db.js';
import userRoutes from './routes/userRoutes.js';

const app = express();
dotenv.config(); //To set our environment variables
connectionToDb(); //Call the connection to the database
app.use(express.json());

// Routing
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
