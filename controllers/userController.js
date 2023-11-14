import User from '../models/User.js';
import generateIdToken from '../helpers/generateIdToken.js';
import generateJwt from '../helpers/generateJwt.js';
import { registerEmail, recoverPassword } from '../helpers/email.js';

const create = async (req, res) => {
  // Avoid duplicated email
  const { email } = req.body;
  const userExisted = await User.findOne({ email });

  if (userExisted) {
    const error = new Error('User already exists');
    return res.status(400).send({ msg: error.message });
  }

  try {
    const user = new User(req.body);
    user.token = generateIdToken();
    await user.save();

    // Sent confirmation email
    registerEmail({
      name: user.name,
      email: user.email,
      token: user.token,
    });

    res.json({
      msg: 'User created propertly, check your email to confirm your account',
    });
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
    return res.status(404).json({ msg: error.message });
  }

  // Verify if its email is confirmed
  if (!user.confirmed) {
    const error = new Error('User is not confirmed yet');
    return res.status(403).json({ msg: error.message });
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
    return res.status(403).json({ msg: error.message });
  }
};

// To confirm if token is valid
const confirm = async (req, res) => {
  const { token } = req.params;
  const userFound = await User.findOne({ token });

  if (!userFound) {
    const error = new Error('Token is invalid');
    return res.status(403).json({ msg: error.message });
  }

  try {
    userFound.confirmed = true; // Change the status to true
    userFound.token = ''; // Reset the token
    await userFound.save();
    res.json({ msg: 'User correctly confirmed' });
  } catch (error) {
    console.log(error);
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  // Verify if user exists
  const user = await User.findOne({ email });

  if (!user) {
    const error = new Error('User does not exist');
    return res.status(404).json({ msg: error.message });
  }

  try {
    user.token = generateIdToken();
    await user.save();

    // Sent email
    recoverPassword({
      name: user.name,
      email: user.email,
      token: user.token,
    })

    res.json({ msg: 'Email sent with steps to follow' });
  } catch (error) {
    console.log(error);
  }
};

const verifyToken = async (req, res) => {
  const { token } = req.params;
  const tokenValid = await User.findOne({ token });

  if (!tokenValid) {
    const error = new Error('Token is not valid');
    return res.status(404).json({ msg: error.message });
  } else {
    res.json({ msg: 'Token is valid and the user exists' });
  }
};

const newPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const user = await User.findOne({ token });
  if (user) {
    user.password = password;
    user.token = '';
    try {
      await user.save();
      res.json({ msg: 'Password changed successfully' });
    } catch (error) {
      console.log(error);
    }
  } else {
    const error = new Error('Token is not valid');
    res.status(404).json({ msg: error.message });
  }
};

const profile = async (req, res) => {
  const { user } = req;
  res.json(user);
};

export {
  create,
  authenticate,
  confirm,
  forgotPassword,
  verifyToken,
  newPassword,
  profile,
};
