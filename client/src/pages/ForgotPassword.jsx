import React, { useState } from 'react';
import { Box, Container, Paper, Typography, TextField, Button, Link as MuiLink, Stack } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await axios.post('/api/auth/forgot-password', { email });
            toast.success(data.message || 'Password reset link sent!');
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to send reset email');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
            <Paper sx={{ p: 6, width: '100%', background: 'rgba(10, 25, 47, 0.8)', backdropFilter: 'blur(10px)' }}>
                <Typography variant="h4" gutterBottom align="center" sx={{ color: 'secondary.main', fontWeight: 700 }}>
                    Forgot Password
                </Typography>
                <Typography variant="body2" align="center" sx={{ color: 'text.secondary', mb: 4 }}>
                    Enter your email address to receive a simulated password reset link
                </Typography>

                <form onSubmit={handleSubmit}>
                    <Stack spacing={3}>
                        <TextField
                            label="Email Address"
                            type="email"
                            fullWidth
                            variant="outlined"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={loading}
                        />
                        <Button 
                            type="submit" 
                            variant="contained" 
                            color="secondary" 
                            size="large" 
                            sx={{ mt: 2 }}
                            disabled={loading}
                        >
                            {loading ? 'Sending...' : 'Send Reset Link'}
                        </Button>
                        <Box sx={{ textAlign: 'center' }}>
                            <MuiLink component={Link} to="/login" sx={{ color: 'secondary.main', fontSize: '0.9rem' }}>
                                Back to Login
                            </MuiLink>
                        </Box>
                    </Stack>
                </form>
            </Paper>
        </Container>
    );
};

export default ForgotPassword;
