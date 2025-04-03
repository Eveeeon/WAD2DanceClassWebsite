const express = require('express');
const router = express.Router();

// Landing Page Route
router.get('/', (req, res) => {
  const userRole = req.session.userRole || 'guest';

  res.render('index', { userRole });
});

module.exports = router;
