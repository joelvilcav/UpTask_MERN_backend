import Project from '../models/Project.js';
import User from '../models/User.js';

const getProjects = async (req, res) => {
  const projects = await Project.find({
    $or: [{ collaborators: { $in: req.user } }, { owner: { $in: req.user } }],
  }).select('-tasks');
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
  const project = await Project.findById(id)
    .populate({
      path: 'tasks',
      populate: { path: 'finishedBy', select: 'name' },
    })
    .populate('collaborators', 'name email');

  if (!project) {
    return res.status(404).json({ msg: 'Not found' });
  }

  // Check if the projects belongs to the owner
  if (
    project.owner.toString() !== req.user._id.toString() &&
    !project.collaborators.some(
      (collaborator) => collaborator._id.toString() === req.user._id.toString()
    )
  ) {
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

const deleteProject = async (req, res) => {
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

  try {
    await project.deleteOne();
    res.json({ msg: 'Project deleted' });
  } catch (error) {
    console.log(error);
  }
};

const searchCollaborator = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email }).select(
    '-confirmed -createdAt -updatedAt -password -token -__v'
  );

  if (!user) {
    const error = new Error('User not found');
    return res.status(404).json({ msg: error.message });
  }

  res.json(user);
};

const addCollaborator = async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    const error = new Error('Project not found');
    return res.status(404).json({ msg: error.message });
  }

  if (project.owner.toString() !== req.user._id.toString()) {
    const error = new Error('Invalid action');
    return res.status(404).json({ msg: error.message });
  }

  const { email } = req.body;
  const user = await User.findOne({ email }).select(
    '-confirmed -createdAt -updatedAt -password -token -__v'
  );

  if (!user) {
    const error = new Error('User not found');
    return res.status(404).json({ msg: error.message });
  }

  // Avoid owner being collaborator
  if (project.owner.toString() === user._id.toString()) {
    const error = new Error('Project owner can not be a collaborator');
    return res.status(404).json({ msg: error.message });
  }

  // Check if a collaborator is not already added
  if (project.collaborators.includes(user._id)) {
    const error = new Error('User is already added to the project');
    return res.status(404).json({ msg: error.message });
  }

  project.collaborators.push(user._id);
  await project.save();
  res.json({ msg: 'Collaborator Propertly Added' });
};

const deleteCollaborator = async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    const error = new Error('Project not found');
    return res.status(404).json({ msg: error.message });
  }

  if (project.owner.toString() !== req.user._id.toString()) {
    const error = new Error('Invalid action');
    return res.status(404).json({ msg: error.message });
  }

  project.collaborators.pull(req.body.id);
  await project.save();
  res.json({ msg: 'Collaborator Propertly Deleted' });
};

export {
  getProjects,
  createProjects,
  getProject,
  updateProject,
  deleteCollaborator,
  deleteProject,
  addCollaborator,
  searchCollaborator,
};
