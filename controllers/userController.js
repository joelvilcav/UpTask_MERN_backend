import User from '../models/User.js';
import generateIdToken from '../helpers/generateIdToken.js';
import generateJwt from '../helpers/generateJwt.js';

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
      tokenJwt: generateJwt(user._id),
    });
  } else {
    const error = new Error('Password is wrong');
    res.status(403).json({ msg: error.message });
  }
};

const confirm = async (req, res) => {
  const { token } = req.params;
  const userFound = await User.findOne({ token });

  if (!userFound) {
    const error = new Error('Token is invalid');
    res.status(403).json({ msg: error.message });
  }

  try {
    userFound.confirmed = true;
    userFound.token = '';
    await userFound.save();
    res.json({msg: "User correctly confirmed"});
  } catch (error) {
    console.log(error);
  }
};

export { create, authenticate, confirm };
