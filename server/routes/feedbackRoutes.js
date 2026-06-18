const express = require('express');
const router = express.Router();
const { submitFeedback, getFeedback } = require('../controllers/feedbackController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { validateFeedback } = require('../middleware/validationMiddleware');

router.route('/')
    .post(protect, validateFeedback, submitFeedback)
    .get(protect, authorize('admin'), getFeedback);

module.exports = router;
