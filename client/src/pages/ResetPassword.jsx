import React, { useState } from 'react';
import { Box, Container, Paper, Typography, TextField, Button, Link as MuiLink, Stack, InputAdornment, IconButton } from '@mui/material';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import axios from 'axios';
import { toast } from 'react-toastify';

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!token) {
            toast.error('Reset token is missing from the URL.');
            return;
        }

        if (password.length < 6) {
            toast.error('Password must be at least 6 characters long.');
            return;
        }

        if (password !== confirmPassword) {
            toast.error('Passwords do not match.');
            return;
        }

        setLoading(true);
        try {
            const { data } = await axios.post('/api/auth/reset-password', { token, password });
            toast.success(data.message || 'Password reset successful!');
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to reset password. Token may be invalid or expired.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
            <Paper sx={{ p: 6, width: '100%', background: 'rgba(10, 25, 47, 0.8)', backdropFilter: 'blur(10px)' }}>
                <Typography variant="h4" gutterBottom align="center" sx={{ color: 'secondary.main', fontWeight: 700 }}>
                    Reset Password
                </Typography>
                <Typography variant="body2" align="center" sx={{ color: 'text.secondary', mb: 4 }}>
                    Enter your new password to regain access to your account
                </Typography>

                {!token ? (
                    <Box sx={{ textAlign: 'center', py: 2 }}>
                        <Typography color="error" variant="body1" gutterBottom>
                            Invalid or missing password reset token.
                        </Typography>
                        <MuiLink component={Link} to="/forgot-password" sx={{ color: 'secondary.main', fontSize: '0.9rem', display: 'block', mt: 2 }}>
                            Request a new reset link
                        </MuiLink>
                    </Box>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <Stack spacing={3}>
                            <TextField
                                label="New Password"
                                type={showPassword ? 'text' : 'password'}
                                fullWidth
                                variant="outlined"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                disabled={loading}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => setShowPassword(!showPassword)}
                                                edge="end"
                                                sx={{ color: 'text.secondary' }}
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                            />
                            <TextField
                                label="Confirm New Password"
                                type={showPassword ? 'text' : 'password'}
                                fullWidth
                                variant="outlined"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
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
                                {loading ? 'Resetting...' : 'Reset Password'}
                            </Button>
                            <Box sx={{ textAlign: 'center' }}>
                                <MuiLink component={Link} to="/login" sx={{ color: 'secondary.main', fontSize: '0.9rem' }}>
                                    Back to Login
                                </MuiLink>
                            </Box>
                        </Stack>
                    </form>
                )}
            </Paper>
        </Container>
    );
};

export default ResetPassword;
