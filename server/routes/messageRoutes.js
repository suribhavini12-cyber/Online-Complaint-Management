const express = require('express');
const router = express.Router();
const { getMessages } = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');

router.get('/:complaintId', protect, getMessages);

module.exports = router;
