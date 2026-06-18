const mongoose = require('mongoose');

const agentAssignmentSchema = new mongoose.Schema({
    complaintId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Complaint',
        required: true
    },
    agentId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    assignedDate: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['Active', 'Completed', 'Reassigned'],
        default: 'Active'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('AgentAssignment', agentAssignmentSchema);
