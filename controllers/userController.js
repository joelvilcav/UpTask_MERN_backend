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

const authenticate = async (req, res) => {
  const { email, password } = req.body;

  // Verify if user exists
  const user = await User.findOne({ email });

  if (!user) {
    const error = new Error('User does not exist');
    res.status(404).json({ msg: error.message });
  }

  // Verify if its email is confirmed
  if (!user.confirmed) {
    const error = new Error('User is not confirmed yet');
    res.status(403).json({ msg: error.message });
  }

  // Verify if its password is correct
  if (await user.verifyPassword(password)) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } else {
    const error = new Error('Password is wrong');
    res.status(403).json({ msg: error.message });
  }
};

export { create, authenticate };
