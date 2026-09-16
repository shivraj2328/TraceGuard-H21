const express = require('express');
const cors = require('cors');
const logger = require('./utils/logger');
const v1Routes = require('./routes/v1');

const app = express();

//middlewares
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  logger.info({ method: req.method, url: req.originalUrl }, 'Incoming request');
  next();
});

//versioning
app.use('/api/v1', v1Routes);

app.use((err, req, res, next) => {
  logger.error({ err, method: req.method, url: req.originalUrl }, 'Unhandled error');
  res.status(500).json({ message: 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  logger.info(`Server running at http://localhost:${PORT}`);
});