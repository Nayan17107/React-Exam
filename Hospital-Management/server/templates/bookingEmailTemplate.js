export const getBookingEmailTemplate = (bookingData) => {
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
        hospitalName = "Hospital Management System",
        hospitalPhone = "+1-800-HOSPITAL",
        hospitalEmail = "info@hospital.com"
    } = bookingData;

    const amenitiesList = Array.isArray(roomAmenities) 
        ? roomAmenities.map(amenity => `<li style="margin: 5px 0;">${amenity}</li>`).join('')
        : '<li>Standard amenities</li>';

    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Booking Confirmation</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                background-color: #f5f5f5;
            }
            .container {
                max-width: 600px;
                margin: 20px auto;
                background-color: #ffffff;
                border-radius: 8px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                overflow: hidden;
            }
            .header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 30px;
                text-align: center;
            }
            .header h1 {
                margin: 0;
                font-size: 28px;
            }
            .content {
                padding: 30px;
            }
            .greeting {
                font-size: 18px;
                color: #333;
                margin-bottom: 20px;
            }
            .confirmation-badge {
                background-color: #e8f5e9;
                border-left: 4px solid #4caf50;
                padding: 15px;
                margin-bottom: 20px;
                border-radius: 4px;
            }
            .confirmation-badge p {
                margin: 0;
                color: #2e7d32;
                font-weight: 500;
            }
            .section {
                margin-bottom: 25px;
            }
            .section-title {
                font-size: 16px;
                font-weight: bold;
                color: #667eea;
                border-bottom: 2px solid #667eea;
                padding-bottom: 10px;
                margin-bottom: 15px;
            }
            .detail-row {
                display: flex;
                justify-content: space-between;
                padding: 10px 0;
                border-bottom: 1px solid #eee;
            }
            .detail-label {
                font-weight: 600;
                color: #555;
            }
            .detail-value {
                color: #333;
            }
            .room-details {
                background-color: #f9f9f9;
                padding: 15px;
                border-radius: 4px;
                margin-bottom: 15px;
            }
            .room-name {
                font-size: 18px;
                font-weight: bold;
                color: #667eea;
                margin-bottom: 10px;
            }
            .amenities-list {
                list-style-position: inside;
                padding-left: 0;
            }
            .amenities-list li {
                color: #555;
            }
            .total-section {
                background-color: #667eea;
                color: white;
                padding: 20px;
                border-radius: 4px;
                text-align: center;
                margin: 20px 0;
            }
            .total-amount {
                font-size: 32px;
                font-weight: bold;
                margin: 10px 0;
            }
            .cta-button {
                display: inline-block;
                background-color: #667eea;
                color: white;
                padding: 12px 30px;
                text-decoration: none;
                border-radius: 4px;
                margin: 15px 0;
                font-weight: 600;
            }
            .footer {
                background-color: #f5f5f5;
                padding: 20px;
                text-align: center;
                font-size: 12px;
                color: #666;
            }
            .important-note {
                background-color: #fff3cd;
                border: 1px solid #ffc107;
                padding: 15px;
                border-radius: 4px;
                margin-bottom: 20px;
            }
            .important-note strong {
                color: #856404;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <!-- Header -->
            <div class="header">
                <h1>🏥 Booking Confirmation</h1>
                <p>Your reservation has been confirmed</p>
            </div>

            <!-- Content -->
            <div class="content">
                <!-- Greeting -->
                <div class="greeting">
                    Dear <strong>${customerName}</strong>,
                </div>
                
                <p>Thank you for choosing our hospital for your room reservation. We're delighted to confirm your booking. Here are all the details of your reservation:</p>

                <!-- Confirmation Badge -->
                <div class="confirmation-badge">
                    <p>✓ Your booking has been confirmed</p>
                </div>

                <!-- Reservation Details -->
                <div class="section">
                    <div class="section-title">📋 Reservation Details</div>
                    <div class="detail-row">
                        <span class="detail-label">Reservation ID:</span>
                        <span class="detail-value"><strong>${reservationId}</strong></span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Booking Email:</span>
                        <span class="detail-value">${customerEmail}</span>
                    </div>
                </div>

                <!-- Room Details -->
                <div class="section">
                    <div class="section-title">🛏️ Room Details</div>
                    <div class="room-details">
                        <div class="room-name">${roomName}</div>
                        
                        <div class="detail-row">
                            <span class="detail-label">Room Type:</span>
                            <span class="detail-value">${roomType}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Capacity:</span>
                            <span class="detail-value">${roomCapacity} ${roomCapacity > 1 ? 'persons' : 'person'}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Price per Night:</span>
                            <span class="detail-value">$${roomPrice}</span>
                        </div>
                        
                        <div style="margin-top: 15px;">
                            <strong style="color: #667eea;">Amenities Included:</strong>
                            <ul class="amenities-list">
                                ${amenitiesList}
                            </ul>
                        </div>
                    </div>
                </div>

                <!-- Stay Details -->
                <div class="section">
                    <div class="section-title">📅 Stay Details</div>
                    <div class="detail-row">
                        <span class="detail-label">Check-in Date:</span>
                        <span class="detail-value">${checkInDate}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Check-out Date:</span>
                        <span class="detail-value">${checkOutDate}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Number of Nights:</span>
                        <span class="detail-value">${numberOfNights} ${numberOfNights > 1 ? 'nights' : 'night'}</span>
                    </div>
                </div>

                <!-- Total Cost -->
                <div class="total-section">
                    <p style="margin: 0; font-size: 14px;">Total Cost for Your Stay</p>
                    <div class="total-amount">\$${totalCost}</div>
                </div>

                <!-- Important Note -->
                <div class="important-note">
                    <strong>⚠️ Important:</strong> Please keep this confirmation email for your records. You'll need your Reservation ID (${reservationId}) at check-in.
                </div>

                <!-- Next Steps -->
                <div class="section">
                    <div class="section-title">📌 What's Next?</div>
                    <p>1. A confirmation link has been sent to your email</p>
                    <p>2. You may be asked to complete payment before check-in</p>
                    <p>3. If you need to make any changes, contact us immediately</p>
                </div>

                <!-- Contact Information -->
                <div class="section">
                    <div class="section-title">📞 Contact Information</div>
                    <p>If you have any questions or need to modify your reservation, please don't hesitate to contact us:</p>
                    <div class="detail-row">
                        <span class="detail-label">Hospital Name:</span>
                        <span class="detail-value">${hospitalName}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Phone:</span>
                        <span class="detail-value">${hospitalPhone}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Email:</span>
                        <span class="detail-value">${hospitalEmail}</span>
                    </div>
                </div>

                <p style="color: #666; font-size: 14px; margin-top: 20px;">
                    We look forward to welcoming you soon!
                </p>
            </div>

            <!-- Footer -->
            <div class="footer">
                <p style="margin: 0;">© 2026 Hospital Management System. All rights reserved.</p>
                <p style="margin: 5px 0;">This is an automated email. Please do not reply to this message.</p>
            </div>
        </div>
    </body>
    </html>
    `;
};
