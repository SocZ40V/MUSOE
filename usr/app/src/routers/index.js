const express = require('express');
const fileupload = require('express-fileupload');
const router = express.Router();

router.use(fileupload());

router.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome to the API' });
});

router.use('/api/v1/', require('./v1'));
router.use('/api/v2/', require('./v2'));

module.exports = router;