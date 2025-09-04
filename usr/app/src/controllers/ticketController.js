const User = require('../models/user');
const Ticket = require('../models/ticket');
const errorHelpers = require('../helpers/errorHelpers');

async function getTickets(req, res) {
  try {
    const tickets = await Ticket.findAll();
    res.status(200).json(tickets);
  } catch (error) {
    errorHelpers.handleError(error, res);
  }
}

async function getTicketById(req, res) {
  try {
    const { id } = req.params;
    const ticket = await Ticket.findById(id);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }
    res.status(200).json(ticket);
  } catch (error) {
    errorHelpers.handleError(error, res);
  }
}

async function getDetailTicketById(req, res) {
  try {
    const { id } = req.params;
    const ticket = await Ticket.findDetailById(id);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }
    res.status(200).json(ticket);
  } catch (error) {
    errorHelpers.handleError(error, res);
  }
}

async function createTicket(req, res) {
  try {
    const { username } = req.user;
    const { subject, description } = req.body;

    const user = await User.findByUsername(username);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!subject || !description) {
      return res.status(400).json({ message: 'Bad request' });
    }

    if (subject.length > 32 || description.length > 255) {
      return res.status(400).json({ message: 'Bad request' });
    }

    const ticket = await Ticket.createOne(req.user.id, subject, description);

    if (!ticket) {
      throw new Error('Internal server error');
    }

    res.status(201).json({ message: 'Ticket created' });
  } catch (error) {
    errorHelpers.handleError(error, res);
  }
}

module.exports = {
  getTickets,
  getTicketById,
  getDetailTicketById,
  createTicket
};