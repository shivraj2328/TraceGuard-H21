const router = require('express').Router();

router.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', version: 'v1' });
});
const authRoutes = require('./auth.routes');
router.use('/auth', authRoutes);

module.exports = router;