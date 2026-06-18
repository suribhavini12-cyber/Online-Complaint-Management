import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, TextField, Button, Grid, Avatar, Stack, Toolbar, Container } from '@mui/material';
import axios from 'axios';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
    const { user, login } = useAuth(); // We'll update state if token is refreshed
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data } = await axios.get('/api/users/profile');
                setFormData({
                    name: data.name || '',
                    email: data.email || '',
                    phone: data.phone || '',
                    password: '',
                    confirmPassword: ''
                });
            } catch (error) {
                toast.error('Failed to load profile details');
            }
        };
        fetchProfile();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password && formData.password !== formData.confirmPassword) {
            return toast.error('Passwords do not match');
        }

        setLoading(true);
        try {
            const updatePayload = {
                name: formData.name,
                email: formData.email,
                phone: formData.phone
            };
            if (formData.password) {
                updatePayload.password = formData.password;
            }

            const { data } = await axios.put('/api/users/profile', updatePayload);
            toast.success('Profile updated successfully!');
            
            // Update local storage and authorization headers
            localStorage.setItem('userInfo', JSON.stringify(data));
            axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
            
            setFormData(prev => ({
                ...prev,
                password: '',
                confirmPassword: ''
            }));
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
            <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
            <Box component="main" sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - 240px)` } }}>
                <Toolbar />
                <Container maxWidth="md">
                    <Paper sx={{ p: 4, mt: 4 }}>
                        <Stack spacing={3} alignItems="center" sx={{ mb: 4 }}>
                            <Avatar 
                                sx={{ 
                                    width: 100, 
                                    height: 100, 
                                    bgcolor: 'secondary.main', 
                                    color: 'background.default',
                                    fontSize: '2.5rem',
                                    fontWeight: 700
                                }}
                            >
                                {formData.name ? formData.name.charAt(0).toUpperCase() : 'U'}
                            </Avatar>
                            <Box sx={{ textAlign: 'center' }}>
                                <Typography variant="h5" fontWeight={700}>{formData.name}</Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ textTransform: 'capitalize' }}>
                                    Role: {user?.role}
                                </Typography>
                            </Box>
                        </Stack>

                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        label="Full Name"
                                        fullWidth
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        required
                                        disabled={loading}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        label="Email Address"
                                        fullWidth
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                                        required
                                        disabled={loading}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        label="Phone Number"
                                        fullWidth
                                        value={formData.phone}
                                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                        required
                                        disabled={loading}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        label="New Password (Optional)"
                                        type="password"
                                        fullWidth
                                        value={formData.password}
                                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                                        disabled={loading}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        label="Confirm New Password"
                                        type="password"
                                        fullWidth
                                        value={formData.confirmPassword}
                                        onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                                        disabled={loading}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Button 
                                        type="submit" 
                                        variant="contained" 
                                        color="secondary" 
                                        fullWidth 
                                        size="large"
                                        disabled={loading}
                                    >
                                        {loading ? 'Saving...' : 'Update Profile'}
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>
                    </Paper>
                </Container>
            </Box>
        </Box>
    );
};

export default Profile;
