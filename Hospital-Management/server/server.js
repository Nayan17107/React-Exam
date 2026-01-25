import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import emailRoutes from './routes/emailRoutes.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/email', emailRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'Server is running',
        timestamp: new Date().toISOString()
    });
});

// Basic route
app.get('/', (req, res) => {
    res.json({
        message: 'Hospital Management System - Email Service API',
        version: '1.0.0',
        endpoints: {
            health: 'GET /api/health',
            sendBookingEmail: 'POST /api/email/send-booking-email'
        }
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint not found'
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════════╗
║   Hospital Management Email Service        ║
║   Server running on port ${PORT}              ║
║   Email: prajapatinayan17107@gmail.com      ║
╚════════════════════════════════════════════╝
    `);
});
