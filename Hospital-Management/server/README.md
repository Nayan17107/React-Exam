# Hospital Management - Email Service Setup Guide

## Overview
This guide will help you set up the email notification system for booking confirmations.

## What's New
When a customer books a room, they will automatically receive a professional email confirmation with all booking details including:
- Customer name and reservation ID
- Room details (name, type, capacity, amenities, price per night)
- Check-in and check-out dates
- Total cost for the stay
- Hospital contact information

## Server Setup

### 1. Install Dependencies
Navigate to the server folder and install required packages:

```bash
cd Hospital-Management/server
npm install
```

### 2. Set Up Gmail App Password

You need to generate an App Password from your Google Account. Follow these steps:

#### Step 1: Enable 2-Step Verification
1. Go to [myaccount.google.com](https://myaccount.google.com)
2. Click "Security" in the left sidebar
3. Find "2-Step Verification" and click on it
4. Follow the prompts to enable 2-Step Verification

#### Step 2: Generate App Password
1. Go to [App Passwords](https://myaccount.google.com/apppasswords)
2. If you don't see this option, make sure:
   - You have 2-Step Verification enabled
   - You're using a personal Google Account (not a work account)
   - You're signed into the correct account (prajapatinayan17107@gmail.com)
3. Select "Mail" from the first dropdown
4. Select "Windows Computer" from the second dropdown (or your device)
5. Click "Generate"
6. Google will show you a 16-character password
7. Copy this password (including spaces)

#### Step 3: Add to .env File
1. Open `Hospital-Management/server/.env`
2. Find the line: `EMAIL_PASSWORD=YOUR_16_CHARACTER_APP_PASSWORD_HERE`
3. Replace `YOUR_16_CHARACTER_APP_PASSWORD_HERE` with the 16-character password you just copied
4. **Keep the spaces in the password**
5. Save the file

Example:
```
EMAIL_PASSWORD=abcd efgh ijkl mnop
```

### 3. Start the Email Service Server

Run the server in development mode with auto-reload:

```bash
npm run dev
```

Or in production mode:

```bash
npm start
```

You should see:
```
╔════════════════════════════════════════════╗
║   Hospital Management Email Service        ║
║   Server running on port 5000              ║
║   Email: prajapatinayan17107@gmail.com     ║
╚════════════════════════════════════════════╝
```

### 4. Update Frontend Environment (Optional)

If your email server is on a different URL, create a `.env.local` file in the `Hospital-Management` folder:

```
REACT_APP_EMAIL_API_URL=http://localhost:5000/api/email
```

By default, the frontend will try to connect to `http://localhost:5000/api/email`.

## How It Works

1. **Customer Books a Room**
   - Customer fills out the reservation form on the frontend
   - Form is submitted with booking details

2. **Reservation Saved to Database**
   - Data is saved to Firebase Firestore
   - Room is temporarily marked as unavailable

3. **Email Triggered Automatically**
   - Frontend calls the Express backend API
   - Sends: customer details, room information, booking dates, total cost
   - Backend composes professional HTML email
   - Nodemailer sends email via Gmail SMTP

4. **Confirmation Sent to Customer**
   - Email arrives in customer's inbox
   - Contains all booking details and reservation ID
   - Includes hospital contact information

## API Endpoint

### Send Booking Email
**Endpoint:** `POST /api/email/send-booking-email`

**Request Body:**
```json
{
  "customerName": "John Doe",
  "customerEmail": "john@example.com",
  "roomName": "Deluxe Room 101",
  "roomType": "Deluxe",
  "roomCapacity": 2,
  "roomPrice": 150,
  "roomAmenities": ["Wi-Fi", "AC", "TV", "Mini Bar"],
  "checkInDate": "2026-01-30",
  "checkOutDate": "2026-02-02",
  "numberOfNights": 3,
  "totalCost": 450,
  "reservationId": "RES123456",
  "hospitalName": "Hospital Management System",
  "hospitalPhone": "+1-800-HOSPITAL",
  "hospitalEmail": "info@hospital.com"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Booking confirmation email sent successfully",
  "messageId": "<message-id@gmail.com>"
}
```

**Response (Error):**
```json
{
  "success": false,
  "message": "Failed to send booking confirmation email",
  "error": "Error details..."
}
```

## Testing

### Test the Server Connection
Run this in your browser or use Postman:
```
http://localhost:5000/api/health
```

Should return:
```json
{
  "status": "Server is running",
  "timestamp": "2026-01-25T10:30:00.000Z"
}
```

### Test Email Sending
Use Postman or curl:

```bash
curl -X POST http://localhost:5000/api/email/send-booking-email \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "Test User",
    "customerEmail": "your_email@gmail.com",
    "roomName": "Test Room",
    "roomType": "Standard",
    "roomCapacity": 1,
    "roomPrice": 100,
    "roomAmenities": ["Wi-Fi", "AC"],
    "checkInDate": "2026-02-01",
    "checkOutDate": "2026-02-02",
    "numberOfNights": 1,
    "totalCost": 100,
    "reservationId": "TEST123"
  }'
```

## Troubleshooting

### Email Not Sending?

1. **Check if server is running**
   - Open http://localhost:5000/api/health in browser
   - Should show "Server is running"

2. **Check credentials in .env**
   - Email should be: `prajapatinayan17107@gmail.com`
   - Password should be 16 characters (with spaces)
   - No quotes around the password

3. **Check 2-Step Verification**
   - Go to Google Account Security
   - Make sure 2-Step Verification is enabled
   - App Password should be available

4. **Check console errors**
   - Look at terminal where server is running
   - Check browser console for frontend errors
   - Check network tab to see if API call succeeded

5. **Gmail Security**
   - Some Gmail accounts may block "less secure apps"
   - Using App Passwords bypasses this
   - Make sure you're using the correct account

### Server Won't Start?

1. Check if port 5000 is already in use:
   ```bash
   netstat -ano | findstr :5000
   ```

2. If port is in use, either:
   - Stop the process using that port
   - Change PORT in .env to a different number (e.g., 5001)

3. Make sure all dependencies are installed:
   ```bash
   npm install
   ```

### Emails Going to Spam?

- Gmail's SMTP is trusted, emails should go to inbox
- Make sure "From" address is correct
- Subject line and content are clear

## Security Notes

1. **Never commit .env to Git**
   - Add `.env` to your `.gitignore`
   - Only commit `.env.example`

2. **App Password is safe**
   - It's specific to Gmail for apps only
   - Can be revoked anytime
   - Doesn't give access to your actual Google password

3. **CORS is enabled**
   - Currently allows all origins for development
   - In production, restrict to your domain only:
   ```javascript
   cors({
     origin: 'https://yourdomain.com',
     methods: ['POST'],
     allowedHeaders: ['Content-Type']
   })
   ```

## File Structure

```
Hospital-Management/
├── server/
│   ├── config/
│   │   └── emailConfig.js        (Gmail SMTP setup)
│   ├── routes/
│   │   └── emailRoutes.js        (Email API endpoints)
│   ├── templates/
│   │   └── bookingEmailTemplate.js (Email HTML template)
│   ├── .env                       (Gmail credentials)
│   ├── .env.example              (Template for .env)
│   ├── package.json              (Dependencies)
│   └── server.js                 (Main Express app)
└── src/
    └── Services/
        └── Actions/
            └── ReservationActions.js (Updated to send emails)
```

## Support

If you encounter any issues:

1. Check the console logs in both frontend and backend
2. Verify Gmail App Password is correct
3. Make sure 2-Step Verification is enabled
4. Check that the email server is running on port 5000
5. Ensure customer email exists in the reservation data

---

**Email Service Ready!** 🎉

Your hospital management system will now send professional booking confirmations to every customer automatically.
