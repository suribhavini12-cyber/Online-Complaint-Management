const express = require('express');
const router = express.Router();
const { registerUser, loginUser, forgotPassword, resetPassword, googleLogin } = require('../controllers/authController');
const { validateRegister, validateLogin } = require('../middleware/validationMiddleware');

router.post('/register', validateRegister, registerUser);
router.post('/login', validateLogin, loginUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/google', googleLogin);

module.exports = router;
