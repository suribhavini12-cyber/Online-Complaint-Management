import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Box, Container, Paper, Typography, TextField, Grid, MenuItem, Button, Stepper, Step, StepLabel, Chip, Toolbar, Stack, Card, CardContent } from '@mui/material';
import axios from 'axios';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import SearchIcon from '@mui/icons-material/Search';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import BusinessIcon from '@mui/icons-material/Business';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import { motion } from 'framer-motion';

const steps = [
    { label: 'Submitted', description: 'Complaint registered in the database' },
    { label: 'Assigned', description: 'Support agent allocated dynamically' },
    { label: 'In Progress', description: 'Agent working on resolving the issue' },
    { label: 'Resolved', description: 'Solution provided, awaiting confirmation' },
    { label: 'Closed', description: 'Ticket resolved and closed' }
];

const getStepNumber = (status) => {
    switch (status) {
        case 'Pending': return 0;
        case 'Assigned': return 1;
        case 'In Progress':
        case 'Reopened': return 2;
        case 'Resolved': return 3;
        case 'Closed': return 4;
        default: return 0;
    }
};

const getDepartment = (category) => {
    switch (category) {
        case 'Technical': return 'Technical Support Command';
        case 'Billing': return 'Billing & Finance Department';
        case 'Service': return 'Customer Service Operations';
        case 'Security': return 'Security & Privacy Operations';
        case 'Other': return 'General Administration Desk';
        default: return 'General Operations Support';
    }
};

const getSlaInfo = (priority) => {
    switch (priority) {
        case 'High': return 'High SLA Escalation: Active target resolution within 12-24 hours.';
        case 'Medium': return 'Medium SLA Tier: Active target resolution within 24-48 hours.';
        case 'Low': return 'Low SLA Tier: Active target resolution within 72 hours.';
        default: return 'Standard SLA Tier: Target resolution within 48 hours.';
    }
};

const ComplaintTracking = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [searchId, setSearchId] = useState(id || '');
    const [myComplaints, setMyComplaints] = useState([]);
    const [selectedId, setSelectedId] = useState('');
    const [loading, setLoading] = useState(false);
    const [complaint, setComplaint] = useState(null);

    // Fetch user's complaints list for dropdown selection
    useEffect(() => {
        const fetchMyComplaints = async () => {
            try {
                const { data } = await axios.get('/api/complaints');
                // Admins/agents can track any complaint, users track their own
                setMyComplaints(data);
                if (id) {
                    const match = data.find(c => c._id === id);
                    if (match) {
                        setComplaint(match);
                        setSelectedId(id);
                    } else {
                        // If ID not in user list, attempt direct fetch
                        fetchDirectComplaint(id);
                    }
                }
            } catch (error) {
                console.error('Error fetching complaints list:', error);
            }
        };
        fetchMyComplaints();
    }, [id]);

    const fetchDirectComplaint = async (targetId) => {
        if (!targetId.trim()) return;
        setLoading(true);
        try {
            // Verify ID length is standard MongoDB ObjectID
            if (targetId.length !== 24) {
                throw new Error('Please enter a valid 24-character hex ID.');
            }
            const { data } = await axios.get(`/api/complaints/${targetId}`);
            setComplaint(data);
            setSelectedId(data._id);
            toast.success('Ticket found!');
        } catch (error) {
            toast.error(error.message || error.response?.data?.message || 'Complaint ID not found.');
            setComplaint(null);
        } finally {
            setLoading(false);
        }
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        fetchDirectComplaint(searchId);
    };

    const handleDropdownSelect = (e) => {
        const targetId = e.target.value;
        setSelectedId(targetId);
        setSearchId(targetId);
        const match = myComplaints.find(c => c._id === targetId);
        if (match) {
            setComplaint(match);
        }
    };

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
            <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
            <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
            <Box component="main" sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - 240px)` } }}>
                <Toolbar />
                <Container maxWidth="lg" sx={{ py: 2 }}>
                    <Stack spacing={4}>
                        {/* Header */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <TrackChangesIcon color="secondary" sx={{ fontSize: 36 }} />
                            <Box>
                                <Typography variant="h4" fontWeight={800}>
                                    Complaint Tracking
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Monitor the real-time processing stage, handling authority, and assignee details for your complaint.
                                </Typography>
                            </Box>
                        </Box>

                        {/* Selection and Search Area */}
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'center' }}>
                                    <Typography variant="subtitle1" fontWeight={700} gutterBottom sx={{ color: 'secondary.main' }}>
                                        Select from Your Registered Complaints
                                    </Typography>
                                    <TextField
                                        select
                                        label="Select Complaint"
                                        fullWidth
                                        value={selectedId}
                                        onChange={handleDropdownSelect}
                                        helperText="Choose a ticket to display the tracking timeline."
                                    >
                                        {myComplaints.map((c) => (
                                            <MenuItem key={c._id} value={c._id}>
                                                #{c._id.slice(-6).toUpperCase()} - {c.title.substring(0, 30)}... ({c.status})
                                            </MenuItem>
                                        ))}
                                        {myComplaints.length === 0 && (
                                            <MenuItem disabled value="">
                                                No complaints registered yet
                                            </MenuItem>
                                        )}
                                    </TextField>
                                </Paper>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Paper sx={{ p: 3, height: '100%' }}>
                                    <Typography variant="subtitle1" fontWeight={700} gutterBottom sx={{ color: 'secondary.main' }}>
                                        Track via Unique Complaint ID
                                    </Typography>
                                    <Box component="form" onSubmit={handleSearchSubmit}>
                                        <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                                            <TextField
                                                label="Enter 24-character Complaint ID"
                                                fullWidth
                                                value={searchId}
                                                onChange={(e) => setSearchId(e.target.value)}
                                                placeholder="e.g. 65c28a7e0a293f..."
                                                required
                                            />
                                            <Button 
                                                type="submit" 
                                                variant="contained" 
                                                color="secondary" 
                                                disabled={loading}
                                                sx={{ px: 3 }}
                                            >
                                                <SearchIcon />
                                            </Button>
                                        </Stack>
                                    </Box>
                                </Paper>
                            </Grid>
                        </Grid>

                        {/* Live Status Tracker Stepper */}
                        {complaint ? (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                            >
                                <Paper sx={{ p: 4, background: 'rgba(10, 25, 47, 0.4)', backdropFilter: 'blur(20px)', border: '1px solid rgba(100, 255, 218, 0.1)' }}>
                                    {/* Ticket Brief details */}
                                    <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} sx={{ mb: 4, pb: 2, borderBottom: '1px solid rgba(100, 255, 218, 0.1)' }}>
                                        <Box>
                                            <Typography variant="h5" fontWeight={700} sx={{ color: 'text.primary' }}>
                                                {complaint.title}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                ID: {complaint._id} | Filed on: {new Date(complaint.createdAt).toLocaleString()}
                                            </Typography>
                                        </Box>
                                        <Chip 
                                            label={complaint.status} 
                                            color={complaint.status === 'Resolved' || complaint.status === 'Closed' ? 'success' : 'warning'} 
                                            sx={{ mt: { xs: 2, sm: 0 }, fontSize: '0.9rem', fontWeight: 700 }}
                                        />
                                    </Stack>

                                    {/* Visual Stepper */}
                                    <Box sx={{ width: '100%', py: 3, mb: 4 }}>
                                        <Stepper 
                                            activeStep={getStepNumber(complaint.status)} 
                                            alternativeLabel
                                            sx={{
                                                '& .MuiStepIcon-root': { color: 'rgba(100, 255, 218, 0.15)' },
                                                '& .MuiStepIcon-root.Mui-active': { color: 'secondary.main' },
                                                '& .MuiStepIcon-root.Mui-completed': { color: 'secondary.main' },
                                                '& .MuiStepLabel-label': { color: 'text.secondary', fontSize: '0.85rem' },
                                                '& .MuiStepLabel-label.Mui-active': { color: 'secondary.main', fontWeight: 700 },
                                                '& .MuiStepLabel-label.Mui-completed': { color: 'text.primary' }
                                            }}
                                        >
                                            {steps.map((step, idx) => (
                                                <Step key={step.label}>
                                                    <StepLabel optional={<Typography variant="caption" sx={{ display: { xs: 'none', sm: 'block' }, color: 'text.secondary' }}>{step.description}</Typography>}>
                                                        {step.label}
                                                    </StepLabel>
                                                </Step>
                                            ))}
                                        </Stepper>
                                    </Box>

                                    {/* Additional Processing Details Grid */}
                                    <Grid container spacing={3} sx={{ mt: 2 }}>
                                        <Grid item xs={12} md={4}>
                                            <Card sx={{ bgcolor: 'rgba(2, 12, 27, 0.3)', border: '1px solid rgba(100, 255, 218, 0.05)' }}>
                                                <CardContent>
                                                    <Stack direction="row" spacing={2} alignItems="center">
                                                        <BusinessIcon color="secondary" />
                                                        <Box>
                                                            <Typography variant="caption" color="text.secondary">Handling Authority</Typography>
                                                            <Typography variant="body1" fontWeight={600}>
                                                                {getDepartment(complaint.category)}
                                                            </Typography>
                                                        </Box>
                                                    </Stack>
                                                </CardContent>
                                            </Card>
                                        </Grid>

                                        <Grid item xs={12} md={4}>
                                            <Card sx={{ bgcolor: 'rgba(2, 12, 27, 0.3)', border: '1px solid rgba(100, 255, 218, 0.05)' }}>
                                                <CardContent>
                                                    <Stack direction="row" spacing={2} alignItems="center">
                                                        <AccountCircleIcon color="secondary" />
                                                        <Box>
                                                            <Typography variant="caption" color="text.secondary">Assigned Agent</Typography>
                                                            <Typography variant="body1" fontWeight={600}>
                                                                {complaint.assignedAgentId?.name || complaint.assignedAgentId || 'Router Assigning Agent...'}
                                                            </Typography>
                                                        </Box>
                                                    </Stack>
                                                </CardContent>
                                            </Card>
                                        </Grid>

                                        <Grid item xs={12} md={4}>
                                            <Card sx={{ bgcolor: 'rgba(2, 12, 27, 0.3)', border: '1px solid rgba(100, 255, 218, 0.05)' }}>
                                                <CardContent>
                                                    <Stack direction="row" spacing={2} alignItems="center">
                                                        <AccessTimeIcon color="secondary" />
                                                        <Box>
                                                            <Typography variant="caption" color="text.secondary">Priority SLA Tier</Typography>
                                                            <Typography variant="body1" fontWeight={600}>
                                                                {complaint.priority}
                                                            </Typography>
                                                        </Box>
                                                    </Stack>
                                                </CardContent>
                                            </Card>
                                        </Grid>

                                        <Grid item xs={12}>
                                            <Box sx={{ mt: 2, p: 2, bgcolor: 'rgba(100, 255, 218, 0.04)', borderRadius: 2, border: '1px solid rgba(100, 255, 218, 0.08)' }}>
                                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                                    <strong>SLA Notice:</strong> {getSlaInfo(complaint.priority)} If you need updates or want to discuss solutions, open the chat workspace to message the agent directly.
                                                </Typography>
                                            </Box>
                                        </Grid>
                                    </Grid>

                                    {/* Action Links */}
                                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="flex-end" sx={{ mt: 4 }}>
                                        <Button
                                            component={Link}
                                            to={`/dashboard/complaint/${complaint._id}`}
                                            variant="contained"
                                            color="secondary"
                                            endIcon={<ArrowRightAltIcon />}
                                            sx={{ py: 1.2, px: 3 }}
                                        >
                                            Go to Ticket Workspace & Chat
                                        </Button>
                                    </Stack>
                                </Paper>
                            </motion.div>
                        ) : (
                            <Paper sx={{ p: 6, textAlign: 'center', border: '1px dotted rgba(100, 255, 218, 0.2)' }}>
                                <Typography variant="h6" color="text.secondary" gutterBottom>
                                    No Complaint Selected
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Please select a complaint from your dropdown list or enter a unique 24-character ID to monitor its live processing stages.
                                </Typography>
                            </Paper>
                        )}
                    </Stack>
                </Container>
            </Box>
        </Box>
    );
};

export default ComplaintTracking;
