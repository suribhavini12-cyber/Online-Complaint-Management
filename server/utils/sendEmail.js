const nodemailer = require('nodemailer');
const { Resend } = require('resend');

const sendEmail = async (options) => {
    // If RESEND_API_KEY is set, use Resend Transactional Email API
    if (process.env.RESEND_API_KEY) {
        try {
            const resend = new Resend(process.env.RESEND_API_KEY);
            const { data, error } = await resend.emails.send({
                from: `${process.env.FROM_NAME || 'OCRMS Support'} <${process.env.FROM_EMAIL || 'onboarding@resend.dev'}>`,
                to: options.email,
                subject: options.subject,
                html: options.html || options.message.replace(/\n/g, '<br>'),
                text: options.message
            });

            if (error) {
                console.error('[EMAIL ERROR] Resend API error:', error);
            } else {
                console.log(`[EMAIL LOG] Email sent successfully via Resend API: ${data.id}`);
                return { messageId: data.id };
            }
        } catch (error) {
            console.error('[EMAIL ERROR] Failed to send email via Resend API:', error.message);
            // Fall back to console logging if Resend API fails
        }
    } else {
        // Fall back to SMTP nodemailer
        try {
            // Check if SMTP credentials are the placeholder values
            const isPlaceholder = !process.env.SMTP_USER || 
                                  process.env.SMTP_USER === 'your_user' || 
                                  process.env.SMTP_USER.includes('placeholder');
            
            if (isPlaceholder) {
                throw new Error('SMTP credentials are not configured or are placeholders');
            }

            const transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST || 'smtp.mailtrap.io',
                port: parseInt(process.env.SMTP_PORT) || 2525,
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS
                }
            });

            const message = {
                from: `${process.env.FROM_NAME || 'OCRMS Support'} <${process.env.FROM_EMAIL || 'noreply@ocrms.com'}>`,
                to: options.email,
                subject: options.subject,
                text: options.message,
                html: options.html || options.message.replace(/\n/g, '<br>')
            };

            const info = await transporter.sendMail(message);
            console.log(`[EMAIL LOG] Message sent via SMTP: ${info.messageId}`);
            return info;
        } catch (error) {
            console.warn(`[EMAIL WARNING] SMTP transport failed (${error.message}). Falling back to console logging.`);
        }
    }

    // Default Fallback: Console Logging
    console.log(`\n========================================`);
    console.log(`[SIMULATED EMAIL NOTIFICATION]`);
    console.log(`TO: ${options.email}`);
    console.log(`SUBJECT: ${options.subject}`);
    console.log(`BODY (TEXT):`);
    console.log(options.message);
    if (options.html) {
        console.log(`\nBODY (HTML AVAILABLE): [HTML Template Embedded]`);
    }
    console.log(`========================================\n`);
    return { messageId: 'simulated-id-log' };
};

module.exports = sendEmail;
