import express from 'express';

import {
  create,
  authenticate,
  confirm,
  forgotPassword,
  verifyToken,
  newPassword
} from '../controllers/userController.js';

const router = express.Router();

// Create, confirm and authenticate users
router.post('/', create); // Create a user
router.post('/login', authenticate); // Authenticate a user
router.get('/confirm/:token', confirm); // To confirm accounts through token sent by email
router.post('/forgot-password', forgotPassword); // To confirm accounts through token sent by email
router.get('/forgot-password/:token', verifyToken); // To verify if token is valid
router.post('/forgot-password/:token', newPassword); // To change the password

export default router;
