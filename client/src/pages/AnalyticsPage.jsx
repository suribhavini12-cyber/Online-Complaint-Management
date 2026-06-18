import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, Grid, LinearProgress, Toolbar, Container } from '@mui/material';
import axios from 'axios';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const AnalyticsPage = () => {
    const [stats, setStats] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await axios.get('/api/admin/dashboard');
                setStats(data);
            } catch (error) {
                console.error('Error fetching admin stats:', error);
            }
        };
        fetchStats();
    }, []);

    if (!stats) return <LinearProgress color="secondary" sx={{ width: '100vw' }} />;

    const barData = {
        labels: stats.categories.map(c => c._id),
        datasets: [{
            label: 'Complaints by Category',
            data: stats.categories.map(c => c.count),
            backgroundColor: 'rgba(100, 255, 218, 0.6)',
            borderColor: '#64ffda',
            borderWidth: 1
        }]
    };

    const pieData = {
        labels: ['Pending', 'Assigned', 'Resolved', 'Closed'],
        datasets: [{
            data: [stats.summary.pending, stats.summary.assigned, stats.summary.resolved, stats.summary.closed],
            backgroundColor: ['#ff9800', '#2196f3', '#4caf50', '#9e9e9e'],
        }]
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
            <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
            <Box component="main" sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - 240px)` } }}>
                <Toolbar />
                <Container maxWidth="xl">
                    <Typography variant="h4" fontWeight={700} sx={{ mb: 4 }}>System Analytics</Typography>

                    {/* Summary Cards */}
                    <Grid container spacing={3} sx={{ mb: 4 }}>
                        <Grid item xs={12} sm={6} md={3}>
                            <Paper sx={{ p: 3, textAlign: 'center' }}>
                                <Typography variant="h3" color="secondary">{stats.summary.total}</Typography>
                                <Typography variant="body2" color="text.secondary">Total Complaints</Typography>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Paper sx={{ p: 3, textAlign: 'center' }}>
                                <Typography variant="h3" color="warning.main">{stats.summary.pending}</Typography>
                                <Typography variant="body2" color="text.secondary">Pending</Typography>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Paper sx={{ p: 3, textAlign: 'center' }}>
                                <Typography variant="h3" color="info.main">{stats.summary.assigned}</Typography>
                                <Typography variant="body2" color="text.secondary">Assigned</Typography>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Paper sx={{ p: 3, textAlign: 'center' }}>
                                <Typography variant="h3" color="success.main">{stats.summary.resolved}</Typography>
                                <Typography variant="body2" color="text.secondary">Resolved</Typography>
                            </Paper>
                        </Grid>
                    </Grid>

                    {/* Chart Visuals */}
                    <Grid container spacing={4}>
                        <Grid item xs={12} md={7}>
                            <Paper sx={{ p: 3, height: '100%' }}>
                                <Typography variant="h6" gutterBottom>Complaints by Category</Typography>
                                <Box sx={{ minHeight: 300 }}>
                                    <Bar data={barData} options={{ responsive: true, scales: { y: { beginAtZero: true } } }} />
                                </Box>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} md={5}>
                            <Paper sx={{ p: 3, height: '100%' }}>
                                <Typography variant="h6" gutterBottom>Status Distribution</Typography>
                                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
                                    <Pie data={pieData} />
                                </Box>
                            </Paper>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </Box>
    );
};

export default AnalyticsPage;
