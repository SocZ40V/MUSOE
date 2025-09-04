const User = require('../models/user');
const Order = require('../models/order');
const errorHelpers = require('../helpers/errorHelpers');

async function getUsers(req, res) {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    errorHelpers.handleError(error, res);
  }
}

async function getUserByUsername(req, res) {
  try {
    const { username } = req.user;
    const user = await User.findByUsername(username);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    errorHelpers.handleError(error, res);
  }
}
async function updateUser(req, res) {
  try {
    const { username } = req.user;
    const { email, image } = req.body;

    const user = await User.findByUsername(username);
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    if (email) {
      await User.updateEmail(username, email);
    }

    if (image) {
      await User.updateImage(username, image);
    }

    res.status(200).json({ message: 'User updated' });
  } catch (error) {
    errorHelpers.handleError(error, res);
  }
}

async function getUserOrders(req, res) {
  try {
    const { id } = req.params;

    if (req.user.id !== parseInt(id)) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const orders = await Order.findByUserId(id);
    if (!orders) {
      return res.status(404).json({ message: 'Orders not found' });
    }

    res.status(200).json(orders);
  } catch (error) {
    errorHelpers.handleError(error, res);
  }
}

module.exports = {
  getUsers,
  getUserByUsername,
  updateUser,
  getUserOrders
};