const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Complaint = require('../models/Complaint');
const Feedback = require('../models/Feedback');
const Message = require('../models/Message');
const AgentAssignment = require('../models/AgentAssignment');

dotenv.config({ path: path.join(__dirname, '../.env') }); // Ensure path is correct relative to process

console.log('Attempting to connect to:', process.env.MONGODB_URI ? 'URI found' : 'URI MISSING');

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB Atlas...');
        // Clear existing data
        await User.deleteMany();
        await Complaint.deleteMany();
        await Feedback.deleteMany();
        await Message.deleteMany();
        await AgentAssignment.deleteMany();

        console.log('Database cleared...');

        // Create Admin
        await User.create({
            name: 'System Admin',
            email: 'admin@ocrms.com',
            password: 'password123',
            phone: '1234567890',
            role: 'admin'
        });

        // Create 5 Sector-Specific Agents
        await User.create([
            {
                name: 'Technical Specialist',
                email: 'tech_agent@ocrms.com',
                password: 'password123',
                phone: '1234567891',
                role: 'agent',
                workload: 0
            },
            {
                name: 'Billing Specialist',
                email: 'billing_agent@ocrms.com',
                password: 'password123',
                phone: '1234567892',
                role: 'agent',
                workload: 0
            },
            {
                name: 'Service Specialist',
                email: 'service_agent@ocrms.com',
                password: 'password123',
                phone: '1234567894',
                role: 'agent',
                workload: 0
            },
            {
                name: 'Security Specialist',
                email: 'security_agent@ocrms.com',
                password: 'password123',
                phone: '1234567895',
                role: 'agent',
                workload: 0
            },
            {
                name: 'General Specialist',
                email: 'general_agent@ocrms.com',
                password: 'password123',
                phone: '1234567896',
                role: 'agent',
                workload: 0
            }
        ]);

        // Create Sample User
        await User.create({
            name: 'John Doe',
            email: 'user@ocrms.com',
            password: 'password123',
            phone: '1234567893',
            role: 'user'
        });

        console.log('Sample data seeded successfully!');
        process.exit();
    } catch (error) {
        console.error('Seeding error:', error);
        process.exit(1);
    }
};

seedData();
