import User from '../models/User.js';

const create = async (req, res) => {
  try {
    const user = new User(req.body);
    const userSaved = await user.save();
    res.json(userSaved);
  } catch (error) {
    console.log(error);
  }
};

export { create };
