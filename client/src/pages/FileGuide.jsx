import React, { useState } from 'react';
import { Box, Container, Paper, Typography, Grid, Button, Stack, Toolbar, Link as MuiLink } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import PostAddIcon from '@mui/icons-material/PostAdd';
import AltRouteIcon from '@mui/icons-material/AltRoute';
import ForumIcon from '@mui/icons-material/Forum';
import RateReviewIcon from '@mui/icons-material/RateReview';

const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.8,
            ease: [0.16, 1, 0.3, 1],
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
    }
};

const StepCard = ({ number, icon: Icon, title, description }) => (
    <motion.div variants={itemVariants} style={{ width: '100%' }}>
        <Paper sx={{
            p: 4,
            background: 'rgba(10, 25, 47, 0.45)',
            backdropFilter: 'blur(20px) saturate(180%)',
            border: '1px solid rgba(100, 255, 218, 0.08)',
            borderRadius: 3,
            position: 'relative',
            overflow: 'hidden',
            transition: 'all 0.3s ease',
            '&:hover': {
                transform: 'translateY(-5px)',
                borderColor: 'rgba(100, 255, 218, 0.25)',
                boxShadow: '0 12px 30px rgba(100, 255, 218, 0.1)'
            }
        }}>
            {/* Number Indicator */}
            <Box sx={{
                position: 'absolute',
                top: -10,
                right: 10,
                fontSize: '5rem',
                fontWeight: 900,
                color: 'rgba(100, 255, 218, 0.03)',
                userSelect: 'none',
                lineHeight: 1
            }}>
                {number}
            </Box>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} alignItems={{ xs: 'flex-start', sm: 'center' }}>
                <Box sx={{
                    p: 2,
                    borderRadius: 2.5,
                    bgcolor: 'rgba(100, 255, 218, 0.08)',
                    color: 'secondary.main',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <Icon fontSize="large" />
                </Box>
                <Box>
                    <Typography variant="h6" fontWeight={700} color="secondary.main" gutterBottom>
                        Step {number}: {title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                        {description}
                    </Typography>
                </Box>
            </Stack>
        </Paper>
    </motion.div>
);

const FileGuide = () => {
    const { user } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();

    const guideSteps = [
        {
            number: 1,
            icon: HowToRegIcon,
            title: "Account Registration & Login",
            description: "Create an Individual User account on our sign-up page or log in using your registered credentials. You can also sign in instantly using Google OAuth."
        },
        {
            number: 2,
            icon: PostAddIcon,
            title: "Submit Complaint Form",
            description: "Click 'New Complaint' in the sidebar dashboard. Provide a clear Title and descriptive explanation. Select the Category (Technical, Billing, Service, Security, Other), set the Priority Level, and pick your State and City (from active list options)."
        },
        {
            number: 3,
            icon: AltRouteIcon,
            title: "Automated Specialist Routing",
            description: "Our AI classification system instantly analyzes your ticket category and workload distribution. The complaint is dynamically auto-assigned to the dedicated agent specializing in that sector who has the lowest active workload."
        },
        {
            number: 4,
            icon: ForumIcon,
            title: "Real-time Agent Chat",
            description: "Navigate to 'My Complaints' and select your ticket. You will find a built-in messaging box to chat directly with your assigned agent. You can ask for status updates, exchange details, and expedite your ticket."
        },
        {
            number: 5,
            icon: RateReviewIcon,
            title: "Review & Ticket Closure",
            description: "Once the support specialist resolves the issue, you will be notified. Review their resolution, provide a star rating with custom feedback, and mark the complaint as Closed to conclude the lifecycle."
        }
    ];

    // Main layout based on authentication status
    if (user) {
        return (
            <Box sx={{ display: 'flex', minHeight: '100vh', position: 'relative' }}>
                <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
                <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
                <Box component="main" sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - 240px)` } }}>
                    <Toolbar />
                    <Container maxWidth="md" sx={{ py: 4 }}>
                        <motion.div variants={containerVariants} initial="hidden" animate="visible">
                            <Stack spacing={4}>
                                <Box>
                                    <Button 
                                        startIcon={<ArrowBackIcon />} 
                                        onClick={() => navigate('/dashboard')}
                                        sx={{ color: 'secondary.main', mb: 2 }}
                                    >
                                        Back to Dashboard
                                    </Button>
                                    <Typography variant="h4" fontWeight={800} sx={{ color: 'text.primary', mb: 1 }}>
                                        How to File a Complaint
                                    </Typography>
                                    <Typography variant="body1" color="text.secondary">
                                        Follow this simple step-by-step walkthrough to submit, track, and successfully resolve your tickets.
                                    </Typography>
                                </Box>

                                <Stack spacing={3}>
                                    {guideSteps.map((step) => (
                                        <StepCard key={step.number} {...step} />
                                    ))}
                                </Stack>

                                <Paper sx={{ p: 4, borderRadius: 3, bgcolor: 'rgba(23, 42, 69, 0.4)', border: '1px solid rgba(100, 255, 218, 0.1)', textAlign: 'center' }}>
                                    <Typography variant="h6" fontWeight={700} gutterBottom>
                                        Ready to register a new complaint?
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                        Head over to the submission page to get started with your ticket.
                                    </Typography>
                                    <Button component={Link} to="/dashboard/create" variant="contained" color="secondary" size="large">
                                        File New Complaint
                                    </Button>
                                </Paper>
                            </Stack>
                        </motion.div>
                    </Container>
                </Box>
            </Box>
        );
    }

    // Public view for guests
    return (
        <Box sx={{ 
            minHeight: '100vh', 
            background: 'radial-gradient(circle at 50% 50%, rgba(10, 25, 47, 1) 0%, rgba(2, 12, 27, 1) 100%)',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Glowing background decorations */}
            <Box sx={{
                position: 'absolute',
                top: '10%',
                left: '10%',
                width: '400px',
                height: '400px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(100, 255, 218, 0.04) 0%, rgba(0,0,0,0) 70%)',
                filter: 'blur(50px)',
                pointerEvents: 'none'
            }} />

            {/* Header */}
            <Box sx={{ py: 3, borderBottom: '1px solid rgba(100, 255, 218, 0.08)', backdropFilter: 'blur(10px)', position: 'relative', zIndex: 1 }}>
                <Container maxWidth="lg">
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography 
                            component={Link} 
                            to="/" 
                            variant="h6" 
                            sx={{ color: 'secondary.main', fontWeight: 800, letterSpacing: 1.5, textDecoration: 'none' }}
                        >
                            OCRMS
                        </Typography>
                        <Stack direction="row" spacing={2}>
                            <Button component={Link} to="/login" variant="text" color="inherit">Login</Button>
                            <Button component={Link} to="/register" variant="contained" color="secondary">Get Started</Button>
                        </Stack>
                    </Stack>
                </Container>
            </Box>

            {/* Body */}
            <Container maxWidth="md" sx={{ py: 8, position: 'relative', zIndex: 1 }}>
                <motion.div variants={containerVariants} initial="hidden" animate="visible">
                    <Stack spacing={4}>
                        <Box sx={{ textAlign: 'center', mb: 3 }}>
                            <Typography variant="h3" fontWeight={800} sx={{ mb: 2 }}>
                                Complaint Submission <Box component="span" sx={{ color: 'secondary.main' }}>Guide</Box>
                            </Typography>
                            <Typography variant="h6" color="text.secondary" fontWeight={400} sx={{ maxWidth: '600px', mx: 'auto' }}>
                                A guide on how our online registration and automatic routing system works.
                            </Typography>
                        </Box>

                        <Stack spacing={3}>
                            {guideSteps.map((step) => (
                                <StepCard key={step.number} {...step} />
                            ))}
                        </Stack>

                        <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 4 }}>
                            <Button component={Link} to="/" startIcon={<ArrowBackIcon />} variant="outlined" color="inherit" size="large">
                                Home Page
                            </Button>
                            <Button component={Link} to="/register" variant="contained" color="secondary" size="large">
                                Create Account
                            </Button>
                        </Stack>
                    </Stack>
                </motion.div>
            </Container>
        </Box>
    );
};

export default FileGuide;
