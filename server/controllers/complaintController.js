const Complaint = require('../models/Complaint');
const User = require('../models/User');
const { autoAssignComplaint } = require('../services/assignmentService');
const { sendAssignmentNotification } = require('../services/notificationService');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Create a new complaint
// @route   POST /api/complaints
// @access  Private (User)
const createComplaint = async (req, res, next) => {
    try {
        const { title, description, category, address, city, state, pincode, priority } = req.body;

        const complaint = await Complaint.create({
            title,
            description,
            category,
            address,
            city,
            state,
            pincode,
            priority,
            userId: req.user._id
        });

        // Trigger auto-assignment
        await autoAssignComplaint(complaint);

        res.status(201).json(complaint);
    } catch (error) {
        next(error);
    }
};

// @desc    Get all complaints
// @route   GET /api/complaints
// @access  Private (Admin/Agent/User)
const getComplaints = async (req, res, next) => {
    try {
        let query;

        if (req.user.role === 'admin') {
            query = Complaint.find().populate('userId assignedAgentId', 'name email');
        } else if (req.user.role === 'agent') {
            query = Complaint.find({ assignedAgentId: req.user._id }).populate('userId', 'name email');
        } else {
            query = Complaint.find({ userId: req.user._id }).populate('assignedAgentId', 'name email');
        }

        const complaints = await query.sort('-createdAt');
        res.json(complaints);
    } catch (error) {
        next(error);
    }
};

// @desc    Get single complaint
// @route   GET /api/complaints/:id
// @access  Private
const getComplaintById = async (req, res, next) => {
    try {
        const complaint = await Complaint.findById(req.params.id)
            .populate('userId assignedAgentId', 'name email phone');

        if (!complaint) {
            return next(new ErrorResponse('Complaint not found', 404));
        }

        // Check ownership
        if (req.user.role !== 'admin' && 
            complaint.userId._id.toString() !== req.user._id.toString() && 
            complaint.assignedAgentId?._id.toString() !== req.user._id.toString()) {
            return next(new ErrorResponse('Not authorized to view this complaint', 401));
        }

        res.json(complaint);
    } catch (error) {
        next(error);
    }
};

// @desc    Update complaint status/details
// @route   PUT /api/complaints/:id
// @access  Private
const updateComplaint = async (req, res, next) => {
    try {
        let complaint = await Complaint.findById(req.params.id);

        if (!complaint) {
            return next(new ErrorResponse('Complaint not found', 404));
        }

        // Apply Role-Based updates
        if (req.user.role === 'user') {
            // Must own the complaint
            if (complaint.userId.toString() !== req.user._id.toString()) {
                return next(new ErrorResponse('Not authorized to update this complaint', 401));
            }

            // Can only update details if Pending or Reopened. Or if they are closing it.
            if (complaint.status !== 'Pending' && complaint.status !== 'Reopened' && req.body.status !== 'Closed') {
                return next(new ErrorResponse('Cannot update complaint details after it has been assigned to an agent', 400));
            }

            // If user is trying to change status, they can only set to 'Closed' or 'Reopened'
            if (req.body.status && !['Closed', 'Reopened'].includes(req.body.status)) {
                return next(new ErrorResponse('Users can only set status to Closed or Reopened', 400));
            }

            // Update allowed fields
            if (req.body.title) complaint.title = req.body.title;
            if (req.body.description) complaint.description = req.body.description;
            if (req.body.category) complaint.category = req.body.category;
            if (req.body.address) complaint.address = req.body.address;
            if (req.body.city) complaint.city = req.body.city;
            if (req.body.state) complaint.state = req.body.state;
            if (req.body.pincode) complaint.pincode = req.body.pincode;
            if (req.body.priority) complaint.priority = req.body.priority;
            if (req.body.status) complaint.status = req.body.status;

        } else if (req.user.role === 'agent') {
            // Must be assigned agent
            if (!complaint.assignedAgentId || complaint.assignedAgentId.toString() !== req.user._id.toString()) {
                return next(new ErrorResponse('Not authorized to update this complaint (not assigned to you)', 401));
            }

            // Agents can only update status
            if (req.body.status) {
                if (!['In Progress', 'Resolved', 'Closed'].includes(req.body.status)) {
                    return next(new ErrorResponse('Invalid status value. Agents can only set status to In Progress, Resolved, or Closed', 400));
                }
                complaint.status = req.body.status;
            } else {
                return next(new ErrorResponse('Agents can only modify the complaint status', 400));
            }

        } else if (req.user.role === 'admin') {
            // Admin can update all fields
            if (req.body.title) complaint.title = req.body.title;
            if (req.body.description) complaint.description = req.body.description;
            if (req.body.category) complaint.category = req.body.category;
            if (req.body.address) complaint.address = req.body.address;
            if (req.body.city) complaint.city = req.body.city;
            if (req.body.state) complaint.state = req.body.state;
            if (req.body.pincode) complaint.pincode = req.body.pincode;
            if (req.body.priority) complaint.priority = req.body.priority;
            if (req.body.status) complaint.status = req.body.status;

            // Handle Agent Reassignment and Workload adjustment
            if (req.body.assignedAgentId !== undefined) {
                const prevAgentId = complaint.assignedAgentId;
                const newAgentId = req.body.assignedAgentId;

                if (newAgentId !== (prevAgentId ? prevAgentId.toString() : '')) {
                    // Decrement workload of previous agent
                    if (prevAgentId) {
                        await User.findByIdAndUpdate(prevAgentId, { $inc: { workload: -1 } });
                    }
                    
                    // Increment workload of new agent
                    if (newAgentId) {
                        const newAgent = await User.findById(newAgentId);
                        if (!newAgent || newAgent.role !== 'agent') {
                            return next(new ErrorResponse('Assigned user must be a valid support agent', 400));
                        }
                        await User.findByIdAndUpdate(newAgentId, { $inc: { workload: 1 } });
                        complaint.assignedAgentId = newAgentId;
                        // Auto update status to Assigned if agent changes and previous status was Pending
                        if (complaint.status === 'Pending') {
                            complaint.status = 'Assigned';
                        }
                        req.shouldNotifyAssignment = true;
                    } else {
                        complaint.assignedAgentId = null;
                        complaint.status = 'Pending';
                    }
                }
            }
        }

        const updatedComplaint = await complaint.save();

        if (req.shouldNotifyAssignment) {
            // Trigger the email notification asynchronously
            sendAssignmentNotification(updatedComplaint._id);
        }

        res.json(updatedComplaint);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createComplaint,
    getComplaints,
    getComplaintById,
    updateComplaint
};
