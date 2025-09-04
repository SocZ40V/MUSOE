const express = require('express');
const cors = require('cors');
const app = express();
const { handleError } = require('./helpers/errorHelpers');

require('dotenv').config({ path: '/usr/app/src/.env' });

const corsOptions = {
  origin: process.env.ORIGIN || 'http://localhost',
  optionsSuccessStatus: 200
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));
app.use('/', require('./routes'));

app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  handleError(err, res);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});