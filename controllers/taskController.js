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
    // Save ID in the project
    projectFound.tasks.push(taskSaved._id);
    await projectFound.save();
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

const updateTask = async (req, res) => {
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

  task.name = req.body.name || task.name;
  task.description = req.body.description || task.description;
  task.priority = req.body.priority || task.priority;
  task.deadline = req.body.deadline || task.deadline;

  try {
    const taskSaved = await task.save();
    res.json(taskSaved);
  } catch (error) {
    console.log(error);
  }
};

const deleteTask = async (req, res) => {
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

  try {
    const project = await Project.findById(task.project);
    project.tasks.pull(task._id);
    await Promise.allSettled([await project.save(), await task.deleteOne()]);
    res.json({ msg: 'Task deleted' });
  } catch (error) {
    console.log(error);
  }
};

const changeStatus = async (req, res) => {
  const { id } = req.params;
  const task = await Task.findById(id).populate('project');

  if (!task) {
    const error = new Error('Task not found');
    return res.status(404).json({ msg: error.message });
  }

  if (
    task.project.owner.toString() !== req.user._id.toString() &&
    !task.project.collaborators.some(
      (collaborator) => collaborator._id.toString() === req.user._id.toString()
    )
  ) {
    const error = new Error('You are not allowed to complete tasks');
    return res.status(403).json({ msg: error.message });
  }

  task.status = !task.status;
  task.finishedBy = req.user._id;
  await task.save();

  const taskSaved = await Task.findById(id)
    .populate('project')
    .populate('finishedBy');

  res.json(taskSaved);
};

export { createTask, getTask, updateTask, deleteTask, changeStatus };
