const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.JWT_SECRET;

function sign(payload) {
  return jwt.sign(payload, SECRET_KEY, { expiresIn: '7d' });
}

function verify(token) {
  return jwt.verify(token, SECRET_KEY);
}

module.exports = {
  sign,
  verify,
};