import express from 'express';

import { create, authenticate } from '../controllers/userController.js';

const router = express.Router();

// Create, confirm and authenticate users
router.post('/', create); // Create a user
router.post('/login', authenticate); // Authenticate a user

export default router;
