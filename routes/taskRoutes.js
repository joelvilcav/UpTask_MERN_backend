import express from 'express';

import {
  createTask,
  getTask,
  updateTask,
  deleteTask,
  changeStatus,
} from '../controllers/taskController.js';

import checkAuth from '../middlewares/checkAuth.js';

const router = express.Router();

router.post('/', checkAuth, createTask);
router.get('/:id', checkAuth, getTask);
router.put('/:id', checkAuth, updateTask);
router.delete('/:id', checkAuth, deleteTask);

router.post('/status/:id', checkAuth, changeStatus);

export default router;
