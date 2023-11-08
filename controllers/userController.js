import User from '../models/User.js';
import generateIdToken from '../helpers/generateIdToken.js';

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
    user.token = generateIdToken();
    const userSaved = await user.save();
    res.json(userSaved);
  } catch (error) {
    console.log(error);
  }
};

export { create };
