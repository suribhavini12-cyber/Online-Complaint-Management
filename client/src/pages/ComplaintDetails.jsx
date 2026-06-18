import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Container, Grid, Paper, Typography, Chip, Button, Stack, Toolbar, MenuItem, TextField, Rating } from '@mui/material';
import axios from 'axios';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import ChatBox from '../components/ChatBox';
import { useAuth } from '../context/AuthContext';

const ComplaintDetails = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [complaint, setComplaint] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [status, setStatus] = useState('');
    
    // Feedback State
    const [feedbackRating, setFeedbackRating] = useState(5);
    const [feedbackComment, setFeedbackComment] = useState('');
    const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

    // Admin Agent Assignment States
    const [agents, setAgents] = useState([]);
    const [assignedAgentId, setAssignedAgentId] = useState('');

    useEffect(() => {
        const fetchComplaint = async () => {
            try {
                const { data } = await axios.get(`/api/complaints/${id}`);
                setComplaint(data);
                setStatus(data.status);
                setAssignedAgentId(data.assignedAgentId?._id || data.assignedAgentId || '');
            } catch (error) {
                toast.error('Error fetching complaint details');
                navigate('/dashboard');
            }
        };
        fetchComplaint();
    }, [id, navigate]);

    useEffect(() => {
        if (user?.role === 'admin') {
            const fetchAgents = async () => {
                try {
                    const { data } = await axios.get('/api/admin/dashboard');
                    setAgents(data.agents || []);
                } catch (error) {
                    console.error('Error fetching agents:', error);
                }
            };
            fetchAgents();
        }
    }, [user]);

    const handleStatusUpdate = async () => {
        try {
            const updatePayload = { status };
            if (user?.role === 'admin') {
                updatePayload.assignedAgentId = assignedAgentId || null;
            }
            await axios.put(`/api/complaints/${id}`, updatePayload);
            toast.success('Complaint updated successfully');
            
            // Re-fetch complaint data to ensure populated values are up to date
            const { data } = await axios.get(`/api/complaints/${id}`);
            setComplaint(data);
            setStatus(data.status);
            setAssignedAgentId(data.assignedAgentId?._id || data.assignedAgentId || '');
        } catch (error) {
            toast.error('Failed to update complaint details');
        }
    };

    const handleUserAction = async (newStatus) => {
        try {
            await axios.put(`/api/complaints/${id}`, { status: newStatus });
            toast.success(`Complaint status set to ${newStatus}`);
            setComplaint({ ...complaint, status: newStatus });
            setStatus(newStatus);
        } catch (error) {
            toast.error(`Failed to update status to ${newStatus}`);
        }
    };

    const handleFeedbackSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/feedback', {
                complaintId: id,
                rating: feedbackRating,
                feedback: feedbackComment
            });
            toast.success('Thank you for your feedback!');
            setFeedbackSubmitted(true);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to submit feedback');
        }
    };

    if (!complaint) return null;

    const isOwner = complaint.userId?._id === user._id || complaint.userId === user._id;

    return (
        <Box sx={{ display: 'flex' }}>
            <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
            <Sidebar open={sidebarOpen} />
            <Box component="main" sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - 240px)` } }}>
                <Toolbar />
                <Container maxWidth="lg">
                    <Grid container spacing={4}>
                        <Grid item xs={12} md={7}>
                            <Paper sx={{ p: 4, mb: 4 }}>
                                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                                    <Typography variant="h4" fontWeight={700}>{complaint.title}</Typography>
                                    <Chip label={complaint.status} color="primary" variant="outlined" />
                                </Stack>

                                <Grid container spacing={2} sx={{ mb: 4 }}>
                                    <Grid item xs={6}>
                                        <Typography variant="caption" color="text.secondary">Category</Typography>
                                        <Typography variant="body1">{complaint.category}</Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="caption" color="text.secondary">Priority</Typography>
                                        <Typography variant="body1" color={complaint.priority === 'High' ? 'error.main' : 'inherit'}>
                                            {complaint.priority}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="caption" color="text.secondary">Location</Typography>
                                        <Typography variant="body1">{complaint.city}, {complaint.state}</Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="caption" color="text.secondary">Created At</Typography>
                                        <Typography variant="body1">{new Date(complaint.createdAt).toLocaleString()}</Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="caption" color="text.secondary">Assigned Agent</Typography>
                                        <Typography variant="body1" sx={{ color: complaint.assignedAgentId ? 'secondary.main' : 'inherit', fontWeight: complaint.assignedAgentId ? 600 : 400 }}>
                                            {complaint.assignedAgentId?.name || 'Unassigned'}
                                        </Typography>
                                    </Grid>
                                </Grid>

                                <Typography variant="h6" gutterBottom>Description</Typography>
                                <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4, whiteSpace: 'pre-wrap' }}>
                                    {complaint.description}
                                </Typography>

                                {/* Agent / Admin Action Box */}
                                {user.role !== 'user' && (
                                    <Box sx={{ mt: 4, pt: 4, borderTop: '1px solid rgba(100, 255, 218, 0.1)' }}>
                                        <Typography variant="h6" gutterBottom>Manage Status & Assignment</Typography>
                                        <Stack direction="row" spacing={2} alignItems="center">
                                            <TextField
                                                select
                                                label="Status"
                                                size="small"
                                                value={status}
                                                onChange={(e) => setStatus(e.target.value)}
                                                sx={{ minWidth: 200 }}
                                            >
                                                <MenuItem value="Assigned">Assigned</MenuItem>
                                                <MenuItem value="In Progress">In Progress</MenuItem>
                                                <MenuItem value="Resolved">Resolved</MenuItem>
                                                <MenuItem value="Closed">Closed</MenuItem>
                                            </TextField>
                                            {user.role === 'admin' && (
                                                <TextField
                                                    select
                                                    label="Assign Agent"
                                                    size="small"
                                                    value={assignedAgentId}
                                                    onChange={(e) => setAssignedAgentId(e.target.value)}
                                                    sx={{ minWidth: 200 }}
                                                >
                                                    <MenuItem value="">Unassigned</MenuItem>
                                                    {agents.map((agent) => (
                                                        <MenuItem key={agent._id} value={agent._id}>
                                                            {agent.name} (Workload: {agent.workload})
                                                        </MenuItem>
                                                    ))}
                                                </TextField>
                                            )}
                                            <Button variant="contained" color="secondary" onClick={handleStatusUpdate}>
                                                Update Status
                                            </Button>
                                        </Stack>
                                    </Box>
                                )}

                                {/* User Action Box (Reopen / Close & Feedback) */}
                                {user.role === 'user' && isOwner && (
                                    <Box sx={{ mt: 4, pt: 4, borderTop: '1px solid rgba(100, 255, 218, 0.1)' }}>
                                        <Typography variant="h6" gutterBottom>Actions</Typography>
                                        <Stack direction="row" spacing={2} sx={{ mb: 4 }}>
                                            {(complaint.status === 'Resolved' || complaint.status === 'Closed') && (
                                                <Button 
                                                    variant="contained" 
                                                    color="error" 
                                                    onClick={() => handleUserAction('Reopened')}
                                                >
                                                    Reopen Complaint
                                                </Button>
                                            )}
                                            {complaint.status !== 'Closed' && complaint.status !== 'Resolved' && (
                                                <Button 
                                                    variant="outlined" 
                                                    color="secondary" 
                                                    onClick={() => handleUserAction('Closed')}
                                                >
                                                    Close Complaint
                                                </Button>
                                            )}
                                        </Stack>

                                        {/* Feedback Submission Panel */}
                                        {(complaint.status === 'Resolved' || complaint.status === 'Closed') && !feedbackSubmitted && (
                                            <Box sx={{ mt: 3, p: 3, borderRadius: 2, bgcolor: 'primary.light' }}>
                                                <Typography variant="h6" gutterBottom sx={{ color: 'secondary.main' }}>
                                                    Submit Feedback
                                                </Typography>
                                                <form onSubmit={handleFeedbackSubmit}>
                                                    <Stack spacing={2}>
                                                        <Box>
                                                            <Typography component="legend" variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>Rating</Typography>
                                                            <Rating 
                                                                name="complaint-rating" 
                                                                value={feedbackRating} 
                                                                onChange={(event, newValue) => setFeedbackRating(newValue)} 
                                                            />
                                                        </Box>
                                                        <TextField
                                                            label="Your Feedback Message"
                                                            fullWidth
                                                            multiline
                                                            rows={3}
                                                            value={feedbackComment}
                                                            onChange={(e) => setFeedbackComment(e.target.value)}
                                                            required
                                                        />
                                                        <Button type="submit" variant="contained" color="secondary">
                                                            Submit Feedback
                                                        </Button>
                                                    </Stack>
                                                </form>
                                            </Box>
                                        )}
                                    </Box>
                                )}
                            </Paper>
                        </Grid>

                        <Grid item xs={12} md={5}>
                            <ChatBox complaintId={id} />
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </Box>
    );
};

export default ComplaintDetails;
