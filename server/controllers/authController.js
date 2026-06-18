const crypto = require('crypto');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');
const { generateToken } = require('../utils/auth');
const sendEmail = require('../utils/sendEmail');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res, next) => {
    const { name, email, password, phone, role } = req.body;

    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            return next(new ErrorResponse('User already exists', 400));
        }

        const user = await User.create({
            name,
            email,
            password,
            phone,
            role: role || 'user'
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id)
            });
        } else {
            return next(new ErrorResponse('Invalid user data', 400));
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email }).select('+password');

        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id)
            });
        } else {
            return next(new ErrorResponse('Invalid email or password', 401));
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Forgot Password (Nodemailer email link)
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res, next) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return next(new ErrorResponse('There is no user with that email', 404));
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(20).toString('hex');

        // Set resetPasswordToken and resetPasswordExpire
        user.resetPasswordToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');

        // Set expire to 10 minutes
        user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

        await user.save();

        // Create reset URL pointing to the frontend ResetPassword page
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        const resetUrl = `${frontendUrl}/reset-password?token=${resetToken}`;

        const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please use this token to reset your password:\n\nToken: ${resetToken}\n\nAlternatively, you can use the link below to reset your password:\n${resetUrl}\n\nIf you did not request this, please ignore this email.`;

        try {
            await sendEmail({
                email: user.email,
                subject: 'Password Reset Token',
                message
            });

            res.status(200).json({ message: 'Password reset email sent successfully' });
        } catch (err) {
            console.error(err);
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save();

            return next(new ErrorResponse('Email could not be sent', 500));
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Reset Password
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = async (req, res, next) => {
    // Get token from query parameter or request body
    const token = req.query.token || req.body.token;

    if (!token) {
        return next(new ErrorResponse('Reset token is required', 400));
    }

    // Hash token
    const resetPasswordToken = crypto
        .createHash('sha256')
        .update(token)
        .digest('hex');

    try {
        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            return next(new ErrorResponse('Invalid or expired reset token', 400));
        }

        // Set new password
        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        res.status(200).json({ message: 'Password reset successful' });
    } catch (error) {
        next(error);
    }
};

// @desc    Login/Register using Google ID Token
// @route   POST /api/auth/google
// @access  Public
const googleLogin = async (req, res, next) => {
    const { token } = req.body;

    if (!token) {
        return next(new ErrorResponse('Google ID token is required', 400));
    }

    try {
        const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
        
        let payload;
        try {
            const ticket = await client.verifyIdToken({
                idToken: token,
                audience: process.env.GOOGLE_CLIENT_ID
            });
            payload = ticket.getPayload();
        } catch (verifyErr) {
            console.error('[GOOGLE AUTH ERROR] Failed to verify Google ID token:', verifyErr.message);
            return next(new ErrorResponse('Invalid Google ID token', 400));
        }

        const { email, name, picture, email_verified } = payload;

        // Verify that the Google account's email is verified
        if (!email_verified) {
            return next(new ErrorResponse('Google account email is not verified by Google', 400));
        }

        // Check if user already exists
        let user = await User.findOne({ email });

        if (!user) {
            // Register new user since it's their first time
            // Generate a random secure password since they use Google SSO
            const randomPassword = crypto.randomBytes(16).toString('hex');
            
            user = await User.create({
                name: name || 'Google User',
                email,
                password: randomPassword,
                phone: 'N/A (Google SSO)', // Set fallback phone since it is required in model validation
                role: 'user', // Default role for Google login users
                profileImage: picture || 'no-photo.jpg'
            });
        }

        // Return JWT
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            profileImage: user.profileImage,
            token: generateToken(user._id)
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    registerUser,
    loginUser,
    forgotPassword,
    resetPassword,
    googleLogin
};
