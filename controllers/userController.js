import User from '../models/User.js';

const create = async (req, res) => {
  // Avoid duplicated email
  const { email } = req.body;
  const userExisted = await User.findOne({ email });

  if (userExisted) {
    const error = new Error('User already exists');
    res.status(400).send({ msg: error.message });
  }

  try {
    const user = new User(req.body);
    const userSaved = await user.save();
    res.json(userSaved);
  } catch (error) {
    console.log(error);
  }
};

export { create };
