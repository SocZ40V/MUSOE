function handleError(error, res) {
  switch (error.name) {
    case 'JsonWebTokenError':
      return res.status(401).json({ message: 'Invalid token' });
    case 'TokenExpiredError':
      return res.status(401).json({ message: 'Token expired' });
    default:
      console.error(error);
      return res.status(500).json({ message: 'Internal server error', error: error.stack });
  }
}

module.exports = {
  handleError,
};