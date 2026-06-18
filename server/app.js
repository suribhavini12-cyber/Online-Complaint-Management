const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const logger = require('./middleware/logger');
const errorHandler = require('./middleware/errorMiddleware');

// Load environment variables
dotenv.config();

// Bypass SSL certificate verification issues in local development environment
if (process.env.NODE_ENV === 'development') {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    console.log('⚠️ [DEV] SSL certificate verification disabled (NODE_TLS_REJECT_UNAUTHORIZED=0)');
}

const app = express();

// Request logging middleware
app.use(logger);

// Security Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api', limiter);

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/complaints', require('./routes/complaintRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/messages', require('./routes/messageRoutes'));
app.use('/api/feedback', require('./routes/feedbackRoutes'));

// Root route
app.get('/', (req, res) => {
    res.send('OCRMS API is running...');
});

// Centralized Error Handling Middleware
app.use(errorHandler);

module.exports = app;
