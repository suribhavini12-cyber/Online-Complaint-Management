const { body, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array()[0].msg });
    }
    next();
};

const validateRegister = [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').trim().isEmail().withMessage('Please enter a valid email address'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('phone').trim().notEmpty().withMessage('Phone number is required'),
    body('role').optional().isIn(['user', 'agent', 'admin']).withMessage('Invalid role'),
    handleValidationErrors
];

const validateLogin = [
    body('email').trim().isEmail().withMessage('Please enter a valid email address'),
    body('password').notEmpty().withMessage('Password is required'),
    handleValidationErrors
];

const validateComplaint = [
    body('title').trim().notEmpty().withMessage('Complaint title is required').isLength({ max: 100 }).withMessage('Title cannot exceed 100 characters'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('category').trim().isIn(['Technical', 'Billing', 'Service', 'Other']).withMessage('Please select a valid category (Technical, Billing, Service, or Other)'),
    body('address').trim().notEmpty().withMessage('Address is required'),
    body('city').trim().notEmpty().withMessage('City is required'),
    body('state').trim().notEmpty().withMessage('State is required'),
    body('pincode').trim().notEmpty().withMessage('Pincode is required'),
    body('priority').trim().isIn(['Low', 'Medium', 'High']).withMessage('Priority must be Low, Medium, or High'),
    handleValidationErrors
];

const validateFeedback = [
    body('complaintId').isMongoId().withMessage('Invalid complaint ID'),
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be an integer between 1 and 5'),
    body('feedback').trim().notEmpty().withMessage('Feedback message is required'),
    handleValidationErrors
];

module.exports = {
    validateRegister,
    validateLogin,
    validateComplaint,
    validateFeedback
};
