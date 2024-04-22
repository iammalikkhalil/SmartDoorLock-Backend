import nodemailer from "nodemailer";


// Function to send email
const sendEmail = async (receiverEmail, subject, body, next) => {
    try {
        // Create transporter
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            auth: {
                user: process.env.GMAIL,
                pass: process.env.GMAIL_APPKEY,
            },
        });
        // Compose email

        let otpBody = `Please enter the OTP below to proceed signing in.\n\n${body}\n\nRegards,\nMuhammad Sajid`;

        const mailOptions = {
            from: process.env.GMAIL,
            to: receiverEmail,
            subject: subject.length < 2 ? `${body} OTP for verification - Sajid` : subject,
            text: subject.length < 8 ? otpBody : body,
        };

        // Send email
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);
        return { success: true, message: 'Email sent successfully' };
    } catch (error) {
        next(error)
    }
};

export default sendEmail;
