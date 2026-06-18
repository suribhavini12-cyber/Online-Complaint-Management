const Feedback = require('../models/Feedback');
const Complaint = require('../models/Complaint');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Submit feedback for a resolved complaint
// @route   POST /api/feedback
// @access  Private (User)
const submitFeedback = async (req, res, next) => {
    try {
        const { complaintId, rating, feedback } = req.body;

        const complaint = await Complaint.findById(complaintId);
        if (!complaint) return next(new ErrorResponse('Complaint not found', 404));

        if (complaint.status !== 'Resolved' && complaint.status !== 'Closed') {
            return next(new ErrorResponse('Can only submit feedback for resolved/closed complaints', 400));
        }

        const newFeedback = await Feedback.create({
            complaintId,
            userId: req.user._id,
            rating,
            feedback
        });

        res.status(201).json(newFeedback);
    } catch (error) {
        next(error);
    }
};

// @desc    Get all feedback (Admin)
// @route   GET /api/feedback
// @access  Private (Admin)
const getFeedback = async (req, res, next) => {
    try {
        const feedback = await Feedback.find()
            .populate('complaintId', 'title')
            .populate('userId', 'name');
        res.json(feedback);
    } catch (error) {
        next(error);
    }
};

module.exports = { submitFeedback, getFeedback };
