import React, { useState } from 'react';
import { Box, Container, Paper, Typography, TextField, Button, Link as MuiLink, Stack, Divider } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, googleLogin } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            toast.success('Logged in successfully!');
            navigate('/dashboard');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Login failed');
        }
    };

    return (
        <Box sx={{ 
            minHeight: '100vh',
            background: 'radial-gradient(circle at 50% 50%, rgba(10, 25, 47, 1) 0%, rgba(2, 12, 27, 1) 100%)',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center'
        }}>
            {/* Glowing background decorations */}
            <Box sx={{
                position: 'absolute',
                top: '20%',
                left: '20%',
                width: '400px',
                height: '400px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(100, 255, 218, 0.05) 0%, rgba(0,0,0,0) 70%)',
                filter: 'blur(40px)',
                pointerEvents: 'none'
            }} />
            <Box sx={{
                position: 'absolute',
                bottom: '10%',
                right: '15%',
                width: '500px',
                height: '500px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(23, 42, 69, 0.2) 0%, rgba(0,0,0,0) 70%)',
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
                            Welcome Back
                        </Typography>
                        <Typography variant="body2" align="center" sx={{ color: 'text.secondary', mb: 4 }}>
                            Enter your credentials to access your account
                        </Typography>

                        <form onSubmit={handleSubmit}>
                            <Stack spacing={3}>
                                <TextField
                                    label="Email Address"
                                    fullWidth
                                    variant="outlined"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    sx={{ bgcolor: 'rgba(2, 12, 27, 0.3)' }}
                                />
                                <TextField
                                    label="Password"
                                    type="password"
                                    fullWidth
                                    variant="outlined"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    sx={{ bgcolor: 'rgba(2, 12, 27, 0.3)' }}
                                />
                                <Button 
                                    type="submit" 
                                    variant="contained" 
                                    color="secondary" 
                                    size="large" 
                                    sx={{ 
                                        mt: 1,
                                        py: 1.5,
                                        boxShadow: '0 8px 25px rgba(100, 255, 218, 0.2)',
                                        '&:hover': {
                                            boxShadow: '0 12px 30px rgba(100, 255, 218, 0.4)'
                                        }
                                    }}
                                >
                                    Login
                                </Button>

                                <Divider sx={{ my: 1, borderColor: 'rgba(255, 255, 255, 0.08)' }}>OR</Divider>

                                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                    <GoogleLogin
                                        onSuccess={async (credentialResponse) => {
                                            try {
                                                await googleLogin(credentialResponse.credential);
                                                toast.success('Logged in with Google successfully!');
                                                navigate('/dashboard');
                                            } catch (error) {
                                                toast.error(error.response?.data?.message || 'Google authentication failed');
                                            }
                                        }}
                                        onError={() => {
                                            toast.error('Google Sign-In failed');
                                        }}
                                        theme="filled_blue"
                                        width="100%"
                                    />
                                </Box>

                                <Stack spacing={1} sx={{ textAlign: 'center', mt: 2 }}>
                                    <MuiLink component={Link} to="/register" sx={{ color: 'secondary.main', fontSize: '0.9rem', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                                        Don't have an account? Register here
                                    </MuiLink>
                                    <MuiLink component={Link} to="/forgot-password" sx={{ color: 'text.secondary', fontSize: '0.8rem', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                                        Forgot Password?
                                    </MuiLink>
                                </Stack>
                            </Stack>
                        </form>
                    </Paper>
                </motion.div>
            </Container>
        </Box>
    );
};

export default Login;
