const User = require('../models/User');
const AgentAssignment = require('../models/AgentAssignment');
const classifierService = require('./classifierService');
const { sendAssignmentNotification } = require('./notificationService');

// Map predicted categories to seeded agent emails
const CATEGORY_AGENT_MAP = {
    'Billing': 'billing_agent@ocrms.com',
    'Technical': 'tech_agent@ocrms.com',
    'Service': 'service_agent@ocrms.com',
    'Security': 'security_agent@ocrms.com',
    'Other': 'general_agent@ocrms.com'
};

const autoAssignComplaint = async (complaint) => {
    try {
        // Run AI classification to predict the complaint category/sector
        const predictedCategory = classifierService.classify(complaint.title, complaint.description);
        complaint.category = predictedCategory;

        // Route to the corresponding specialist agent
        const targetEmail = CATEGORY_AGENT_MAP[predictedCategory] || 'general_agent@ocrms.com';
        let selectedAgent = await User.findOne({ email: targetEmail, role: 'agent' });

        // Fallback: If sector agent is not found, assign to the agent with the lowest workload
        if (!selectedAgent) {
            console.warn(`[AI ROUTING WARNING] Specialist agent (${targetEmail}) not found. Falling back to workload-based assignment.`);
            const agents = await User.find({ role: 'agent' }).sort({ workload: 1 });
            if (agents && agents.length > 0) {
                selectedAgent = agents[0];
            }
        }

        if (!selectedAgent) {
            console.log('[AI ROUTING ERROR] No support agents available in the system for auto-assignment.');
            return null;
        }

        // Update complaint with agent ID and status
        complaint.assignedAgentId = selectedAgent._id;
        complaint.status = 'Assigned';
        await complaint.save();

        // Create assignment record
        await AgentAssignment.create({
            complaintId: complaint._id,
            agentId: selectedAgent._id,
            status: 'Active'
        });

        // Increment agent workload
        selectedAgent.workload += 1;
        await selectedAgent.save();

        console.log(`[AI ROUTING SUCCESS] Complaint #${complaint._id.toString().slice(-6).toUpperCase()} classified as "${predictedCategory}" and routed to agent: ${selectedAgent.name} (${selectedAgent.email})`);

        // Send email notification to the customer
        // We trigger it asynchronously without awaiting to keep response fast, errors are handled inside
        sendAssignmentNotification(complaint._id);

        return selectedAgent;
    } catch (error) {
        console.error('[AI ROUTING FAILURE] Auto-assignment routing failed:', error);
        return null;
    }
};

module.exports = { autoAssignComplaint };
