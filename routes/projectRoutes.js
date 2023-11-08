import express from 'express';

import {
  getProjects,
  createProjects,
  getProject,
  updateProject,
  deleteCollaborator,
  deleteProject,
  addCollaborator,
} from '../controllers/projectController.js';

import checkAuth from '../middlewares/checkAuth.js';

const router = express.Router();

router.get('/', checkAuth, getProjects);
router.post('/', checkAuth, createProjects);

router.get('/:id', checkAuth, getProject);
router.put('/:id', checkAuth, updateProject);
router.delete('/:id', checkAuth, deleteProject);

router.post('/add-collaborator/:id', checkAuth, addCollaborator);
router.post('/delete-collaborator/:id', checkAuth, deleteCollaborator);

export default router;
