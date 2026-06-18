const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');
            
            if (!req.user) {
                return next(new ErrorResponse('Not authorized, user not found', 401));
            }
            
            return next();
        } catch (error) {
            console.error(error);
            return next(new ErrorResponse('Not authorized, token failed', 401));
        }
    }

    if (!token) {
        return next(new ErrorResponse('Not authorized, no token', 401));
    }
};

const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return next(new ErrorResponse('Not authorized', 401));
        }
        if (!roles.includes(req.user.role)) {
            return next(new ErrorResponse(`User role ${req.user.role} is not authorized to access this route`, 403));
        }
        next();
    };
};

module.exports = { protect, authorize };
