const sharp = require('sharp');
const { getUri } = require('get-uri');
const mime = require('mime-types');
const errorHelpers = require('../helpers/errorHelpers');

async function resize(req, res) {
  try {
    const { image, size } = req.query;

    if (!image) {
      return res.status(400).json({ message: 'image is required' });
    }

    const validSizes = ['small', 'medium', 'large', 'default'];
    const requestedSize = size ? size.toLowerCase() : 'default';

    if (!validSizes.includes(requestedSize)) {
      return res.status(400).json({ message: "Invalid size (choose from: 'small', 'medium', 'large', 'default')" });
    }

    const sizeDimensions = {
      small: { width: 100, height: 100 },
      medium: { width: 300, height: 300 },
      large: { width: 600, height: 600 },
      default: { width: null, height: null },
    };

    const { width, height } = sizeDimensions[requestedSize];

    const imageStream = await getUri(image);

    const contentType = mime.lookup(image);
    res.writeHead(200, { 'Content-Type': contentType });

    if (width && height) {
      imageStream.pipe(sharp().resize(width, height)).pipe(res);
    } else {
      imageStream.pipe(res);
    }
  } catch (error) {
    errorHelpers.handleError(error, res);
  }
}

module.exports = { resize };