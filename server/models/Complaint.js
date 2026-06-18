const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a title'],
        trim: true,
        maxlength: [100, 'Title cannot be more than 100 characters']
    },
    description: {
        type: String,
        required: [true, 'Please add a description']
    },
    category: {
        type: String,
        required: [true, 'Please select a category'],
        enum: ['Technical', 'Billing', 'Service', 'Security', 'Other']
    },
    status: {
        type: String,
        enum: ['Pending', 'Assigned', 'In Progress', 'Resolved', 'Reopened', 'Closed'],
        default: 'Pending'
    },
    address: {
        type: String,
        required: [true, 'Please add an address']
    },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    attachments: [String],
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    assignedAgentId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        default: 'Medium'
    }
}, {
    timestamps: true
});

// Indexes for query performance optimization
complaintSchema.index({ status: 1 });
complaintSchema.index({ userId: 1 });
complaintSchema.index({ assignedAgentId: 1 });

module.exports = mongoose.model('Complaint', complaintSchema);
