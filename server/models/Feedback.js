const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    complaintId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Complaint',
        required: true
    },
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    feedback: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Feedback', feedbackSchema);
