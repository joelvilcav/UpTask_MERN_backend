import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import connectionToDb from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import taskRoutes from './routes/taskRoutes.js';

const app = express();
dotenv.config(); //To set our environment variables
connectionToDb(); //Call the connection to the database
app.use(express.json());

// CORS configuration
const whitelist = [process.env.FRONTEND_URL];
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.includes(origin)) {
      // Can use the API
      callback(null, true);
    } else {
      // Forbidden
      callback(new Error('Cors error'));
    }
  },
};

app.use(cors(corsOptions));

// Routing
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);

const PORT = process.env.PORT || 4000;

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

//Socket io

import { Server } from 'socket.io';

const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: process.env.FRONTEND_URL,
  },
});

io.on('connection', (socket) => {
  console.log('Connected to socket.io');

  //Define the events on socket.io
  socket.on('open project', (project) => {
    socket.join(project);
  });

  socket.on('new task', (task) => {
    const project  = task.project;
    socket.to(project).emit('task added', task);
  });
});
