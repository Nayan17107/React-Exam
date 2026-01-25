import express from 'express';
import transporter from '../config/emailConfig.js';
import { getBookingEmailTemplate } from '../templates/bookingEmailTemplate.js';

const router = express.Router();

// Send booking confirmation email
router.post('/send-booking-email', async (req, res) => {
    try {
        const {
            customerName,
            customerEmail,
            roomName,
            roomType,
            roomCapacity,
            roomPrice,
            roomAmenities,
            checkInDate,
            checkOutDate,
            numberOfNights,
            totalCost,
            reservationId,
            hospitalName,
            hospitalPhone,
            hospitalEmail
        } = req.body;

        // Validate required fields
        if (!customerEmail || !customerName || !reservationId) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: customerEmail, customerName, reservationId'
            });
        }

        // Generate email template
        const htmlContent = getBookingEmailTemplate({
            customerName,
            customerEmail,
            roomName,
            roomType,
            roomCapacity,
            roomPrice,
            roomAmenities,
            checkInDate,
            checkOutDate,
            numberOfNights,
            totalCost,
            reservationId,
            hospitalName: hospitalName || 'Hospital Management System',
            hospitalPhone: hospitalPhone || '+1-800-HOSPITAL',
            hospitalEmail: hospitalEmail || 'info@hospital.com'
        });

        // Send email
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: customerEmail,
            subject: `Booking Confirmation - Reservation #${reservationId}`,
            html: htmlContent
        };

        const info = await transporter.sendMail(mailOptions);

        console.log('✅ Email sent successfully:', info.response);
        
        res.status(200).json({
            success: true,
            message: 'Booking confirmation email sent successfully',
            messageId: info.messageId
        });

    } catch (error) {
        console.error('❌ Error sending email:', error);
        
        res.status(500).json({
            success: false,
            message: 'Failed to send booking confirmation email',
            error: error.message
        });
    }
});

export default router;
