import Project from '../models/Project.js';

const getProjects = async (req, res) => {
  const projects = await Project.find().where('owner').equals(req.user);
  res.json(projects);
};

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

const getProject = async (req, res) => {
  const { id } = req.params;
  const project = await Project.findById(id);

  if (!project) {
    return res.status(404).json({ msg: 'Not found' });
  }

  // Check if the projects belongs to the owner
  if (project.owner.toString() !== req.user._id.toString()) {
    const error = new Error('Invalid action');
    return res.status(401).json({ msg: error.message });
  }

  res.json(project);
};

const updateProject = async (req, res) => {
  const { id } = req.params;
  const project = await Project.findById(id);

  if (!project) {
    return res.status(404).json({ msg: 'Not found' });
  }

  // Check if the projects belongs to the owner
  if (project.owner.toString() !== req.user._id.toString()) {
    const error = new Error('Invalid action');
    return res.status(401).json({ msg: error.message });
  }

  project.name = req.body.name || project.name;
  project.description = req.body.description || project.description;
  project.deadline = req.body.deadline || project.deadline;
  project.client = req.body.client || project.client;

  try {
    const projectSaved = await project.save();
    res.json(projectSaved);
  } catch (error) {
    console.log(error);
  }
};

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
