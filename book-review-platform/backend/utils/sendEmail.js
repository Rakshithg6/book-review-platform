const nodemailer = require('nodemailer');

let transporter;

// Only create transporter if we're in production or if SMTP is configured
if (process.env.NODE_ENV === 'production' && process.env.SMTP_HOST) {
    // Create reusable transporter object using the default SMTP transport
    transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
        auth: {
            user: process.env.SMTP_USERNAME,
            pass: process.env.SMTP_PASSWORD
        },
        // For development with self-signed certificates
        tls: {
            rejectUnauthorized: false
        }
    });

    // Verify connection configuration in production
    transporter.verify(function(error, success) {
        if (error) {
            console.error('SMTP Connection Error:', error);
        } else {
            console.log('SMTP Server is ready to take our messages');
        }
    });
} else {
    console.log('Running in development mode - emails will be logged to console');
}

/**
 * Send an email
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email address
 * @param {string} options.subject - Email subject
 * @param {string} options.text - Plain text message
 * @param {string} [options.html] - HTML message (optional)
 * @returns {Promise} - Promise that resolves when email is sent
 */
const sendEmail = async ({ to, subject, text, html }) => {
    try {
        // Log all email attempts
        console.log('\n--- Email Attempt ---');
        console.log('To:', to);
        console.log('Subject:', subject);
        console.log('Environment:', process.env.NODE_ENV);
        
        // If not in production or no SMTP configured, just log the email
        if (process.env.NODE_ENV !== 'production' || !transporter) {
            console.log('\nEmail content (not sent in development):');
            console.log(text || html);
            console.log('--- End Email Log ---\n');
            return { 
                message: 'Email logged (not sent in development)',
                preview: text || html
            };
        }

        // In production with SMTP configured, send the actual email
        const info = await transporter.sendMail({
            from: `"${process.env.EMAIL_FROM_NAME || 'Book Review Platform'}" <${process.env.EMAIL_FROM_ADDRESS || 'noreply@bookreview.com'}>`,
            to,
            subject,
            text,
            html
        });

        console.log('Message sent: %s', info.messageId);
        return info;
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send email');
    }
};

module.exports = sendEmail;
