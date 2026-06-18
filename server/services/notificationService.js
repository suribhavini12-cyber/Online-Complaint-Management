const Complaint = require('../models/Complaint');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

/**
 * Sends an email notification to the customer when their complaint is assigned/reassigned to an agent.
 * @param {string} complaintId - The ID of the complaint.
 */
const sendAssignmentNotification = async (complaintId) => {
    try {
        const complaint = await Complaint.findById(complaintId)
            .populate('userId', 'name email')
            .populate('assignedAgentId', 'name email phone');

        if (!complaint) {
            console.error(`[NOTIFICATION ERROR] Complaint with ID ${complaintId} not found.`);
            return;
        }

        const customer = complaint.userId;
        const agent = complaint.assignedAgentId;

        if (!customer || !customer.email) {
            console.warn(`[NOTIFICATION WARNING] Customer details missing for complaint #${complaintId}. Cannot send email.`);
            return;
        }

        if (!agent) {
            console.warn(`[NOTIFICATION WARNING] No agent assigned to complaint #${complaintId}. Assignment notification skipped.`);
            return;
        }

        const ticketIdShort = complaint._id.toString().slice(-6).toUpperCase();
        const subject = `[OCRMS] Ticket Assigned: #${ticketIdShort} - ${complaint.title}`;
        
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        const ticketUrl = `${frontendUrl}/dashboard/complaint/${complaint._id}`;

        // Plain Text Fallback
        const textMessage = `
Hello ${customer.name},

Your support ticket #${ticketIdShort} has been assigned to a support representative.

Ticket Details:
- Title: ${complaint.title}
- Description: ${complaint.description}
- Category: ${complaint.category}
- Priority: ${complaint.priority}
- Status: ${complaint.status}

Assigned Agent:
- Name: ${agent.name}
- Email: ${agent.email}
${agent.phone ? `- Phone: ${agent.phone}` : ''}

You can view the ticket details and track its progress online here:
${ticketUrl}

Best regards,
OCRMS Support Team
        `.trim();

        // Premium HTML Template with Glassmorphism / OCRMS dark blue accents
        const htmlMessage = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Support Ticket Assigned</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #0a192f;
            color: #8892b0;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 30px auto;
            background: rgba(17, 34, 64, 0.9);
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            border: 1px solid rgba(100, 255, 218, 0.1);
        }
        .header {
            background-color: #020c1b;
            padding: 30px;
            text-align: center;
            border-bottom: 2px solid #64ffda;
        }
        .header h1 {
            color: #64ffda;
            margin: 0;
            font-size: 24px;
            font-weight: 700;
            letter-spacing: 1px;
        }
        .content {
            padding: 30px;
        }
        .greeting {
            font-size: 18px;
            color: #e6f1ff;
            margin-bottom: 20px;
        }
        .description {
            font-size: 16px;
            line-height: 1.6;
            margin-bottom: 25px;
        }
        .section-title {
            color: #64ffda;
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 10px;
            border-bottom: 1px solid rgba(100, 255, 218, 0.1);
            padding-bottom: 5px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .details-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 25px;
            background: rgba(2, 12, 27, 0.5);
            border-radius: 4px;
            overflow: hidden;
        }
        .details-table td {
            padding: 12px 15px;
            border-bottom: 1px solid rgba(100, 255, 218, 0.05);
            font-size: 14px;
        }
        .details-table td.label {
            width: 30%;
            font-weight: bold;
            color: #ccd6f6;
        }
        .details-table td.value {
            color: #8892b0;
        }
        .agent-card {
            background: rgba(100, 255, 218, 0.05);
            border-left: 4px solid #64ffda;
            padding: 15px;
            margin-bottom: 25px;
            border-radius: 0 4px 4px 0;
        }
        .agent-name {
            font-size: 16px;
            font-weight: bold;
            color: #e6f1ff;
            margin-bottom: 5px;
        }
        .agent-detail {
            font-size: 14px;
            color: #8892b0;
            margin: 3px 0;
        }
        .button-container {
            text-align: center;
            margin: 35px 0 15px 0;
        }
        .btn {
            background-color: #64ffda;
            color: #0a192f !important;
            text-decoration: none;
            padding: 12px 30px;
            font-size: 16px;
            font-weight: bold;
            border-radius: 4px;
            display: inline-block;
            transition: all 0.3s ease;
            box-shadow: 0 2px 10px rgba(100,255,218,0.2);
        }
        .footer {
            background-color: #020c1b;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #8892b0;
            border-top: 1px solid rgba(100, 255, 218, 0.05);
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>OCRMS SUPPORT</h1>
        </div>
        <div class="content">
            <div class="greeting">Hello ${customer.name},</div>
            <div class="description">
                Your support ticket <strong>#${ticketIdShort}</strong> has been successfully assigned to an OCRMS representative. We are actively working to resolve your issue.
            </div>
            
            <div class="section-title">Ticket Details</div>
            <table class="details-table">
                <tr>
                    <td class="label">Title</td>
                    <td class="value">${complaint.title}</td>
                </tr>
                <tr>
                    <td class="label">Category</td>
                    <td class="value">${complaint.category}</td>
                </tr>
                <tr>
                    <td class="label">Priority</td>
                    <td class="value">
                        <span style="color: ${complaint.priority === 'High' ? '#ff4d4d' : complaint.priority === 'Medium' ? '#ffb300' : '#4dff4d'}">
                            ${complaint.priority}
                        </span>
                    </td>
                </tr>
                <tr>
                    <td class="label">Current Status</td>
                    <td class="value"><strong>${complaint.status}</strong></td>
                </tr>
            </table>

            <div class="section-title">Assigned Agent</div>
            <div class="agent-card">
                <div class="agent-name">${agent.name}</div>
                <div class="agent-detail">Email: <a href="mailto:${agent.email}" style="color: #64ffda; text-decoration: none;">${agent.email}</a></div>
                ${agent.phone ? `<div class="agent-detail">Phone: ${agent.phone}</div>` : ''}
            </div>

            <div class="button-container">
                <a href="${ticketUrl}" class="btn">View & Track Ticket</a>
            </div>
        </div>
        <div class="footer">
            This is an automated notification. Please do not reply directly to this email.<br>
            &copy; 2026 OCRMS (Online Complaint Registry & Management System). All rights reserved.
        </div>
    </div>
</body>
</html>
        `;

        await sendEmail({
            email: customer.email,
            subject,
            message: textMessage,
            html: htmlMessage
        });

        console.log(`[NOTIFICATION SUCCESS] Ticket assignment notification dispatched to customer ${customer.email} for ticket #${ticketIdShort}`);
    } catch (error) {
        console.error('[NOTIFICATION FAILURE] Failed to send ticket assignment email:', error);
    }
};

module.exports = { sendAssignmentNotification };
