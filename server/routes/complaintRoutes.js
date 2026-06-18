const express = require('express');
const router = express.Router();
const { 
    createComplaint, 
    getComplaints, 
    getComplaintById, 
    updateComplaint 
} = require('../controllers/complaintController');
const { protect } = require('../middleware/authMiddleware');
const { validateComplaint } = require('../middleware/validationMiddleware');

router.route('/')
    .post(protect, validateComplaint, createComplaint)
    .get(protect, getComplaints);

router.route('/:id')
    .get(protect, getComplaintById)
    .put(protect, updateComplaint);

module.exports = router;
