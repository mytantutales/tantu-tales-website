import nodemailer from 'nodemailer';
import 'dotenv/config';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD
    }
});

// Send order confirmation email
export const sendOrderEmail = async (customerEmail, orderNumber, customerName, totalAmount) => {
    try {
        const mailOptions = {
            from: process.env.SMTP_EMAIL,
            to: customerEmail,
            subject: `✨ Order Confirmed - Tantu Tales #${orderNumber}`,
            html: `
                <h2>Thank you for your order! 🎉</h2>
                <p>Hi ${customerName},</p>

                <p>Your order has been placed .</p>

                <h3>Order Details:</h3>
                <p><strong>Order Number:</strong> ${orderNumber}</p>
                <p><strong>Total Amount:</strong> ₹${totalAmount}</p>

                <p>📹 <strong>IMPORTANT:</strong> Please record an unboxing video when you receive your order. This is required for returns.</p>

                <p>We'll confirm your order via WhatsApp shortly.</p>

                <p>Thank you for choosing <strong>Tantu Tales</strong> ✨</p>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log(`✅ Email sent to ${customerEmail}`);
        return true;
    } catch (error) {
        console.error(`❌ Email error: ${error.message}`);
        return false;
    }
};

// Send admin notification
export const sendAdminNotification = async (orderNumber, customerName, totalAmount) => {
    try {
        const mailOptions = {
            from: process.env.SMTP_EMAIL,
            to: process.env.ADMIN_EMAIL,
            subject: `🎨 New Order - ${orderNumber}`,
            html: `
                <h2>New Order Received! 🎉</h2>

                <p><strong>Order Number:</strong> ${orderNumber}</p>
                <p><strong>Customer Name:</strong> ${customerName}</p>
                <p><strong>Total Amount:</strong> ₹${totalAmount}</p>

                <p>Login to the dashboard to view full details.</p>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log(`✅ Admin notification sent`);
        return true;
    } catch (error) {
        console.error(`❌ Admin email error: ${error.message}`);
        return false;
    }
};

// Send newsletter email
export const sendNewsletterEmail = async (subscriberEmail) => {
    try {
        const mailOptions = {
            from: process.env.SMTP_EMAIL,
            to: subscriberEmail,
            subject: `✨ Welcome to Tantu Tales Newsletter!`,
            html: `
                <h2>Welcome! 🎨</h2>

                <p>Thank you for subscribing to <strong>Tantu Tales</strong>!</p>

                <p>You’ll now receive updates about:</p>
                <ul>
                    <li>New collections</li>
                    <li>Exclusive offers</li>
                    <li>Behind-the-scenes content</li>
                </ul>

                <p>Follow us on Instagram: <strong>@mytantu_tales</strong></p>

                
            `
        };

        await transporter.sendMail(mailOptions);
        console.log(`✅ Newsletter email sent to ${subscriberEmail}`);
        return true;
    } catch (error) {
        console.error(`❌ Newsletter email error: ${error.message}`);
        return false;
    }
};
