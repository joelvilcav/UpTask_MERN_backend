import Project from '../models/Project.js';

const getProjects = async (req, res) => {};

const createProjects = async (req, res) => {
  const project = new Project(req.body);
  project.owner = req.user._id;
  try {
    const projectSaved = await project.save();
    res.json(projectSaved);
  } catch (error) {
    console.log(error);
  }
};

const getProject = async (req, res) => {};

const updateProject = async (req, res) => {};

const deleteProject = async (req, res) => {};

const addCollaborator = async (req, res) => {};

const deleteCollaborator = async (req, res) => {};

const getTasks = async (req, res) => {};

export {
  getProjects,
  createProjects,
  getProject,
  updateProject,
  deleteCollaborator,
  deleteProject,
  addCollaborator,
  getTasks,
};
