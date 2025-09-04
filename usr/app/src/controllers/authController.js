const bcrypt = require('bcryptjs');
const User = require('../models/user');
const JWTHelpers = require('../helpers/JWTHelpers');
const errorHelpers = require('../helpers/errorHelpers');
const validatorHelpers = require('../helpers/validatorHelpers');

async function register(req, res) {
  try {
    let { username, password, email } = req.body;

    if (!username || !password || !email) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    if (!validatorHelpers.validateEmail(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    const user = await User.findByUsername(username);
    if (user) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const newUser = {
      username,
      password,
      email
    };

    const result = await User.createOne(newUser);
    if (!result) {
      return res.status(500).json({ message: 'Internal server error' });
    }
    res.status(201).json({ message: 'User created' });
  } catch (error) {
    errorHelpers.handleError(error, res);
  }
}

async function login(req, res) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const user = await User.findByUsername(username);
    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const token = JWTHelpers.sign({
      id: user.id,
      username: user.username,
      role: user.role
    });

    res.status(200).json({
      message: 'Login successful',
      token: token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        balance: user.balance,
        email: user.email,
        image: user.image
      }
    });
  } catch (error) {
    errorHelpers.handleError(error, res);
  }
}

async function fogortPassword(req, res) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    if (!validatorHelpers.validateEmail(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(500).json({ message: 'This feature is not implemented yet' });
  } catch (error) {
    errorHelpers.handleError(error, res);
  }
}

module.exports = {
  register,
  login,
  fogortPassword
};