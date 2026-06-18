const Complaint = require('../models/Complaint');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get dashboard analytics
// @route   GET /api/admin/dashboard
// @access  Private (Admin)
const getDashboardStats = async (req, res, next) => {
    try {
        const totalComplaints = await Complaint.countDocuments();
        const pendingComplaints = await Complaint.countDocuments({ status: 'Pending' });
        const assignedComplaints = await Complaint.countDocuments({ status: 'Assigned' });
        const resolvedComplaints = await Complaint.countDocuments({ status: 'Resolved' });
        const closedComplaints = await Complaint.countDocuments({ status: 'Closed' });

        const agentStats = await User.find({ role: 'agent' }).select('name email workload');

        const categoryStats = await Complaint.aggregate([
            { $group: { _id: '$category', count: { $sum: 1 } } }
        ]);

        res.json({
            summary: {
                total: totalComplaints,
                pending: pendingComplaints,
                assigned: assignedComplaints,
                resolved: resolvedComplaints,
                closed: closedComplaints
            },
            agents: agentStats,
            categories: categoryStats
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all users & agents
// @route   GET /api/admin/users
// @access  Private (Admin)
const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find({}).select('-password');
        res.json(users);
    } catch (error) {
        next(error);
    }
};

// @desc    Update user role
// @route   PUT /api/admin/users/:id
// @access  Private (Admin)
const updateUserRole = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return next(new ErrorResponse('User not found', 404));
        }
        user.role = req.body.role || user.role;
        await user.save();
        res.json(user);
    } catch (error) {
        next(error);
    }
};

// @desc    Delete user/agent
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin)
const deleteUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return next(new ErrorResponse('User not found', 404));
        }
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'User removed successfully' });
    } catch (error) {
        next(error);
    }
};

module.exports = { 
    getDashboardStats,
    getAllUsers,
    updateUserRole,
    deleteUser
};

