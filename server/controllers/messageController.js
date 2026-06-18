const Message = require('../models/Message');

// @desc    Get messages for a complaint
// @route   GET /api/messages/:complaintId
// @access  Private
const getMessages = async (req, res, next) => {
    try {
        const messages = await Message.find({ complaintId: req.params.complaintId })
            .sort('createdAt')
            .populate('senderId', 'name role');
        res.json(messages);
    } catch (error) {
        next(error);
    }
};

module.exports = { getMessages };
