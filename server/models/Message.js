const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    complaintId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Complaint',
        required: true
    },
    senderId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    senderRole: {
        type: String,
        enum: ['user', 'agent', 'admin'],
        required: true
    },
    message: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Message', messageSchema);
