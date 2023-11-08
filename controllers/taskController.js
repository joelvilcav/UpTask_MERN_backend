import Task from '../models/Task.js';
import Project from '../models/Project.js';

const createTask = async (req, res) => {
  const { project } = req.body;
  const projectFound = await Project.findById(project);

  if (!projectFound) {
    const error = new Error('Project not found');
    return res.status(404).json({ msg: error.message });
  }

  if (projectFound.owner.toString() !== req.user._id.toString()) {
    const error = new Error('You are not allowed to add tasks');
    return res.status(403).json({ msg: error.message });
  }

  try {
    const taskSaved = await Task.create(req.body);
    res.json(taskSaved);
  } catch (error) {
    console.log(error);
  }
};

const getTask = async (req, res) => {
  const { id } = req.params;
  const task = await Task.findById(id).populate('project');

  if (!task) {
    const error = new Error('Task not found');
    return res.status(404).json({ msg: error.message });
  }

  if (task.project.owner.toString() !== req.user._id.toString()) {
    const error = new Error('You are not allowed to add tasks');
    return res.status(403).json({ msg: error.message });
  }

  res.json(task);
};

const updateTask = async (req, res) => {};

const deleteTask = async (req, res) => {};

const changeStatus = async (req, res) => {};

export { createTask, getTask, updateTask, deleteTask, changeStatus };
