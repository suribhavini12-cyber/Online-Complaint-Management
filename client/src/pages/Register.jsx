import React, { useState } from 'react';
import { Box, Container, Paper, Typography, TextField, Button, Link as MuiLink, Stack, MenuItem } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        role: 'user'
    });
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(formData);
            toast.success('Registration successful!');
            navigate('/dashboard');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <Box sx={{ 
            minHeight: '100vh',
            background: 'radial-gradient(circle at 50% 50%, rgba(10, 25, 47, 1) 0%, rgba(2, 12, 27, 1) 100%)',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            py: 5
        }}>
            {/* Glowing background decorations */}
            <Box sx={{
                position: 'absolute',
                top: '10%',
                right: '10%',
                width: '450px',
                height: '450px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(100, 255, 218, 0.05) 0%, rgba(0,0,0,0) 70%)',
                filter: 'blur(45px)',
                pointerEvents: 'none'
            }} />
            <Box sx={{
                position: 'absolute',
                bottom: '10%',
                left: '10%',
                width: '500px',
                height: '500px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(23, 42, 69, 0.25) 0%, rgba(0,0,0,0) 70%)',
                filter: 'blur(50px)',
                pointerEvents: 'none'
            }} />

            <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                >
                    <Paper sx={{ 
                        p: 6, 
                        width: '100%', 
                        background: 'rgba(10, 25, 47, 0.4)', 
                        backdropFilter: 'blur(20px) saturate(180%)',
                        border: '1px solid rgba(100, 255, 218, 0.08)',
                        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.4), 0 0 30px rgba(100, 255, 218, 0.03)',
                        borderRadius: 3
                    }}>
                        <Typography variant="h4" gutterBottom align="center" sx={{ color: 'secondary.main', fontWeight: 800, letterSpacing: 0.5 }}>
                            Create Account
                        </Typography>
                        <Typography variant="body2" align="center" sx={{ color: 'text.secondary', mb: 4 }}>
                            Join the OCRMS resolution network
                        </Typography>

                        <form onSubmit={handleSubmit}>
                            <Stack spacing={3}>
                                <TextField
                                    label="Full Name"
                                    fullWidth
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                    sx={{ bgcolor: 'rgba(2, 12, 27, 0.3)' }}
                                />
                                <TextField
                                    label="Email Address"
                                    fullWidth
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                    sx={{ bgcolor: 'rgba(2, 12, 27, 0.3)' }}
                                />
                                <TextField
                                    label="Phone Number"
                                    fullWidth
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    required
                                    sx={{ bgcolor: 'rgba(2, 12, 27, 0.3)' }}
                                />
                                <TextField
                                    label="Password"
                                    type="password"
                                    fullWidth
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required
                                    sx={{ bgcolor: 'rgba(2, 12, 27, 0.3)' }}
                                />
                                <TextField
                                    select
                                    label="Join As"
                                    fullWidth
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    sx={{ bgcolor: 'rgba(2, 12, 27, 0.3)' }}
                                >
                                    <MenuItem value="user">Individual User</MenuItem>
                                    <MenuItem value="agent">Support Agent</MenuItem>
                                </TextField>

                                <Button 
                                    type="submit" 
                                    variant="contained" 
                                    color="secondary" 
                                    size="large" 
                                    sx={{ 
                                        mt: 2,
                                        py: 1.5,
                                        boxShadow: '0 8px 25px rgba(100, 255, 218, 0.2)',
                                        '&:hover': {
                                            boxShadow: '0 12px 30px rgba(100, 255, 218, 0.4)'
                                        }
                                    }}
                                >
                                    Register
                                </Button>
                                <Box sx={{ textAlign: 'center' }}>
                                    <MuiLink component={Link} to="/login" sx={{ color: 'secondary.main', fontSize: '0.9rem', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                                        Already have an account? Login here
                                    </MuiLink>
                                </Box>
                            </Stack>
                        </form>
                    </Paper>
                </motion.div>
            </Container>
        </Box>
    );
};

export default Register;
