const mongoose = require('mongoose');
const dns = require('dns');

const connectDB = async () => {
    try {
        // Set Node's DNS resolver to Google DNS and Cloudflare DNS in development
        // to bypass local ISP DNS timeouts on Atlas SRV record resolution
        if (process.env.NODE_ENV === 'development') {
            dns.setServers(['8.8.8.8', '1.1.1.1']);
            console.log('🌐 [DEV] DNS servers set to Google (8.8.8.8) and Cloudflare (1.1.1.1)');
        }

        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`MongoDB Connection Error: ${error.message}`);
        console.log('Server will continue to run without DB connection...');
    }
};

module.exports = connectDB;
