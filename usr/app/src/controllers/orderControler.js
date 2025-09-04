const User = require('../models/user');
const Order = require('../models/order');
const Product = require('../models/product');
const errorHelpers = require('../helpers/errorHelpers');

async function getOrders(req, res) {
  try {
    const orders = await Order.findAll();
    res.status(200).json(orders);
  } catch (error) {
    errorHelpers.handleError(error, res);
  }
}

async function getOrderById(req, res) {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json(order);
  } catch (error) {
    errorHelpers.handleError(error, res);
  }
}

async function getDetailOrderById(req, res) {
  try {
    const { id } = req.params;
    const order = await Order.findDetailById(id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json(order);
  } catch (error) {
    errorHelpers.handleError(error, res);
  }
}

async function createOrder(req, res) {
  try {
    const { username } = req.user;
    const { note, product } = req.body;

    const user = await User.findByUsername(username);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!product) {
      return res.status(400).json({ message: 'Bad request' });
    }

    const productExists = await Product.findById(product.id);
    if (!productExists) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.price > user.balance) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    const updatedBalance = user.balance - product.price;

    const order = await Order.createOne(req.user.id, product.id, note);
    if (!order) {
      throw new Error('Internal server error');
    }

    await User.updateBalance(username, updatedBalance);

    let message = 'Order created';

    if (product.id === 1) {
      message = `${process.env.FLAG_4}`;
    }

    res.status(201).json({ message: message, balance: updatedBalance });
  } catch (error) {
    errorHelpers.handleError(error, res);
  }
}

module.exports = {
  getOrders,
  getOrderById,
  getDetailOrderById,
  createOrder
};