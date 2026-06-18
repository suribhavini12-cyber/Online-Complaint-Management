import React from 'react';
import { Box, Container, Typography, Button, Grid, Paper, Stack, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { Link } from 'react-router-dom';
import SecurityIcon from '@mui/icons-material/Security';
import SpeedIcon from '@mui/icons-material/Speed';
import ChatIcon from '@mui/icons-material/Chat';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { motion } from 'framer-motion';
import heroImage from '../assets/hero.png';

const FeatureCard = ({ icon: Icon, title, description, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
        style={{ height: '100%' }}
    >
        <Paper 
            sx={{ 
                p: 4, 
                height: '100%', 
                background: 'rgba(10, 25, 47, 0.4)',
                backdropFilter: 'blur(16px) saturate(120%)',
                border: '1px solid rgba(100, 255, 218, 0.08)',
                boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
                transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                '&:hover': { 
                    transform: 'translateY(-10px) scale(1.02)',
                    borderColor: 'rgba(100, 255, 218, 0.3)',
                    boxShadow: '0 20px 40px rgba(100, 255, 218, 0.15)',
                }
            }}
        >
            <Icon sx={{ fontSize: 40, color: 'secondary.main', mb: 2 }} />
            <Typography variant="h5" gutterBottom sx={{ color: 'text.primary', fontWeight: 600 }}>{title}</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>{description}</Typography>
        </Paper>
    </motion.div>
);

const Home = () => {
    return (
        <Box sx={{ 
            flexGrow: 1, 
            minHeight: '100vh',
            background: 'radial-gradient(circle at 10% 20%, rgba(10, 25, 47, 1) 0%, rgba(2, 12, 27, 1) 90%)',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Background glowing decorations */}
            <Box sx={{
                position: 'absolute',
                top: '-10%',
                right: '-10%',
                width: '500px',
                height: '500px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(100, 255, 218, 0.08) 0%, rgba(0,0,0,0) 70%)',
                filter: 'blur(50px)',
                zIndex: 0,
                pointerEvents: 'none'
            }} />
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '-10%',
                width: '600px',
                height: '600px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(23, 42, 69, 0.3) 0%, rgba(0,0,0,0) 70%)',
                filter: 'blur(60px)',
                zIndex: 0,
                pointerEvents: 'none'
            }} />

            {/* Header */}
            <Box sx={{ py: 3, borderBottom: '1px solid rgba(100, 255, 218, 0.08)', backdropFilter: 'blur(10px)', position: 'relative', zIndex: 10 }}>
                <Container maxWidth="lg">
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="h6" sx={{ color: 'secondary.main', fontWeight: 800, letterSpacing: 1.5, textDecoration: 'none' }} component={Link} to="/">
                            OCRMS
                        </Typography>
                        <Stack direction="row" spacing={2} alignItems="center">
                            <Button component={Link} to="/guide" variant="text" color="inherit" sx={{ display: { xs: 'none', sm: 'inline-flex' } }}>
                                How it Works
                            </Button>
                            <Button component={Link} to="/login" variant="text" color="inherit">Login</Button>
                            <Button component={Link} to="/register" variant="outlined" color="secondary">Get Started</Button>
                        </Stack>
                    </Stack>
                </Container>
            </Box>

            {/* Hero Section */}
            <Container maxWidth="lg" sx={{ pt: { xs: 8, md: 12 }, pb: 8, position: 'relative', zIndex: 1 }}>
                <Grid container spacing={6} alignItems="center">
                    <Grid item xs={12} md={6}>
                        <motion.div 
                            initial={{ opacity: 0, x: -60 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <Typography variant="h1" sx={{ mb: 2, fontSize: { xs: '3rem', md: '4.2rem' }, lineHeight: 1.1, fontWeight: 800 }}>
                                Resolution <Box component="span" sx={{ 
                                    background: 'linear-gradient(45deg, #64ffda 30%, #b1f9eb 90%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent'
                                }}>Simplified.</Box>
                            </Typography>
                            <Typography variant="h5" sx={{ color: 'text.secondary', mb: 5, fontWeight: 400, lineHeight: 1.6, fontSize: '1.25rem' }}>
                                Enterprise-grade complaint registration and management system with workload-balanced auto-routing, real-time agent chats, and live stepper tracking.
                            </Typography>
                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                                <Button 
                                    component={Link} 
                                    to="/register" 
                                    variant="contained" 
                                    color="secondary" 
                                    size="large"
                                    sx={{ 
                                        px: 4, 
                                        py: 1.8, 
                                        fontSize: '1rem',
                                        boxShadow: '0 8px 30px rgba(100, 255, 218, 0.25)',
                                        '&:hover': {
                                            boxShadow: '0 12px 35px rgba(100, 255, 218, 0.45)'
                                        }
                                    }}
                                >
                                    Register a Complaint
                                </Button>
                                <Button 
                                    component={Link} 
                                    to="/guide" 
                                    variant="outlined" 
                                    color="secondary" 
                                    size="large"
                                    endIcon={<KeyboardArrowRightIcon />}
                                    sx={{ 
                                        px: 4, 
                                        py: 1.8, 
                                        fontSize: '1rem',
                                    }}
                                >
                                    Filing Guide
                                </Button>
                            </Stack>
                        </motion.div>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        >
                             <Box 
                                sx={{ 
                                    width: '100%', 
                                    borderRadius: 4,
                                    overflow: 'hidden',
                                    border: '1px solid rgba(100, 255, 218, 0.15)',
                                    boxShadow: '0 20px 50px rgba(0,0,0,0.5), 0 0 30px rgba(100,255,218,0.1)',
                                    transition: 'transform 0.5s ease',
                                    '&:hover': {
                                        transform: 'scale(1.02)'
                                    }
                                }}
                            >
                                <Box 
                                    component="img" 
                                    src={heroImage} 
                                    alt="OCRMS Dashboard Preview" 
                                    sx={{ 
                                        width: '100%', 
                                        height: 'auto', 
                                        display: 'block',
                                    }}
                                />
                             </Box>
                        </motion.div>
                    </Grid>
                </Grid>
            </Container>

            {/* Statistics Section */}
            <Box sx={{ py: 8, bgcolor: 'rgba(10, 25, 47, 0.3)', borderY: '1px solid rgba(100, 255, 218, 0.08)' }}>
                <Container maxWidth="lg">
                    <Grid container spacing={4} justifyContent="center" sx={{ textAlign: 'center' }}>
                        <Grid item xs={6} md={3}>
                            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
                                <Typography variant="h3" fontWeight={800} color="secondary.main">1,250+</Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>Complaints Resolved</Typography>
                            </motion.div>
                        </Grid>
                        <Grid item xs={6} md={3}>
                            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
                                <Typography variant="h3" fontWeight={800} color="secondary.main">99.4%</Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>SLA Compliance Rate</Typography>
                            </motion.div>
                        </Grid>
                        <Grid item xs={6} md={3}>
                            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
                                <Typography variant="h3" fontWeight={800} color="secondary.main">&lt; 2 Hrs</Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>Avg Response Time</Typography>
                            </motion.div>
                        </Grid>
                        <Grid item xs={6} md={3}>
                            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.3 }}>
                                <Typography variant="h3" fontWeight={800} color="secondary.main">100%</Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>Auto-Routed Tickets</Typography>
                            </motion.div>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* Features Showcase */}
            <Container maxWidth="lg" sx={{ py: 10, position: 'relative', zIndex: 1 }}>
                <Typography variant="h3" fontWeight={800} align="center" gutterBottom sx={{ mb: 6 }}>
                    Engineered for <Box component="span" sx={{ color: 'secondary.main' }}>Speed</Box>
                </Typography>
                <Grid container spacing={4}>
                    <Grid item xs={12} md={4}>
                        <FeatureCard 
                            icon={SecurityIcon} 
                            title="Secure & Reliable" 
                            description="Encrypted user authentication and role-based support routes ensure complaints and communications remain fully confidential."
                            delay={0.1}
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <FeatureCard 
                            icon={SpeedIcon} 
                            title="Auto-Routing Router" 
                            description="Smart NLP classifiers analyze complaint categories and assign tickets instantly to the support agent with the lowest active workload."
                            delay={0.2}
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <FeatureCard 
                            icon={ChatIcon} 
                            title="Real-time Workspace" 
                            description="Interactive user and agent chat box with dynamic state status triggers, feedback updates, and persistent history."
                            delay={0.3}
                        />
                    </Grid>
                </Grid>
            </Container>

            {/* FAQs Accordion Section */}
            <Container maxWidth="md" sx={{ pb: 12, position: 'relative', zIndex: 1 }}>
                <Typography variant="h3" fontWeight={800} align="center" gutterBottom sx={{ mb: 6 }}>
                    Frequently Asked <Box component="span" sx={{ color: 'secondary.main' }}>Questions</Box>
                </Typography>
                <Stack spacing={2}>
                    <Accordion sx={{ bgcolor: 'rgba(10, 25, 47, 0.4)', border: '1px solid rgba(100, 255, 218, 0.08)', borderRadius: '8px !important', '&:before': { display: 'none' } }}>
                        <AccordionSummary expandMoreIcon={<ExpandMoreIcon sx={{ color: 'secondary.main' }} />}>
                            <Typography fontWeight={600} color="text.primary">How does the auto-assignment system work?</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                                When you file a complaint, our backend service analyzes the category (Technical, Billing, Service, Security, Other) and instantly routes it to the specialized support agent who has the lowest active workload in that sector. This ensures zero downtime and speeds up resolution.
                            </Typography>
                        </AccordionDetails>
                    </Accordion>

                    <Accordion sx={{ bgcolor: 'rgba(10, 25, 47, 0.4)', border: '1px solid rgba(100, 255, 218, 0.08)', borderRadius: '8px !important', '&:before': { display: 'none' } }}>
                        <AccordionSummary expandMoreIcon={<ExpandMoreIcon sx={{ color: 'secondary.main' }} />}>
                            <Typography fontWeight={600} color="text.primary">Can I talk directly to the specialist handling my ticket?</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                                Absolutely! Under "My Complaints" in your dashboard, clicking "View Details" opens a dedicated real-time chat workspace where you can message your assigned support agent directly, share clarifications, and follow updates.
                            </Typography>
                        </AccordionDetails>
                    </Accordion>

                    <Accordion sx={{ bgcolor: 'rgba(10, 25, 47, 0.4)', border: '1px solid rgba(100, 255, 218, 0.08)', borderRadius: '8px !important', '&:before': { display: 'none' } }}>
                        <AccordionSummary expandMoreIcon={<ExpandMoreIcon sx={{ color: 'secondary.main' }} />}>
                            <Typography fontWeight={600} color="text.primary">How do I track my ticket processing stage?</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                                You can track the progress stage of your tickets in real time using the "Track Complaint" workspace. Select your ticket from the dropdown or type in your 24-character complaint ID to see a visual step-by-step progress stepper (Pending, Assigned, In Progress, Resolved, Closed) and find out which department is handling it.
                            </Typography>
                        </AccordionDetails>
                    </Accordion>
                </Stack>
            </Container>
        </Box>
    );
};

export default Home;
