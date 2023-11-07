import express from 'express';

import { create } from '../controllers/userController.js';

const router = express.Router();

// Create, confirm and authenticate users
router.post('/', create); // Create a user

export default router;
