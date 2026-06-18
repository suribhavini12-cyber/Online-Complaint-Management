import React, { useState, useEffect } from 'react';
import { Grid, Paper, Typography, Box, Table, TableBody, TableCell, TableHead, TableRow, Chip, LinearProgress } from '@mui/material';
import axios from 'axios';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const AdminView = () => {
    const [stats, setStats] = useState(null);

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

    if (!stats) return <LinearProgress color="secondary" />;

    const barData = {
        labels: stats.categories.map(c => c._id),
        datasets: [{
            label: 'Complaints by Category',
            data: stats.categories.map(c => c.count),
            backgroundColor: 'rgba(100, 255, 218, 0.6)',
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
        <Box>
            <Typography variant="h4" fontWeight={700} sx={{ mb: 4 }}>Admin Analytics</Typography>

            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={3}>
                    <Paper sx={{ p: 3, textAlign: 'center' }}>
                        <Typography variant="h3" color="secondary">{stats.summary.total}</Typography>
                        <Typography variant="body2" color="text.secondary">Total Complaints</Typography>
                    </Paper>
                </Grid>
                 <Grid item xs={12} md={3}>
                    <Paper sx={{ p: 3, textAlign: 'center' }}>
                        <Typography variant="h3" color="warning.main">{stats.summary.pending}</Typography>
                        <Typography variant="body2" color="text.secondary">Pending</Typography>
                    </Paper>
                </Grid>
                 <Grid item xs={12} md={3}>
                    <Paper sx={{ p: 3, textAlign: 'center' }}>
                        <Typography variant="h3" color="info.main">{stats.summary.assigned}</Typography>
                        <Typography variant="body2" color="text.secondary">Assigned</Typography>
                    </Paper>
                </Grid>
                 <Grid item xs={12} md={3}>
                    <Paper sx={{ p: 3, textAlign: 'center' }}>
                        <Typography variant="h3" color="success.main">{stats.summary.resolved}</Typography>
                        <Typography variant="body2" color="text.secondary">Resolved</Typography>
                    </Paper>
                </Grid>
            </Grid>

            <Grid container spacing={4} sx={{ mb: 4 }}>
                <Grid item xs={12} md={7}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>Complaints by Category</Typography>
                        <Bar data={barData} options={{ responsive: true, scales: { y: { beginAtZero: true } } }} />
                    </Paper>
                </Grid>
                <Grid item xs={12} md={5}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>Status Distribution</Typography>
                        <Pie data={pieData} />
                    </Paper>
                </Grid>
            </Grid>

            <Paper sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>Agent Performance (Auto-Assignment Workload)</Typography>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Agent Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell align="center">Current Workload</TableCell>
                            <TableCell>Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {stats.agents.map((agent) => (
                            <TableRow key={agent._id}>
                                <TableCell>{agent.name}</TableCell>
                                <TableCell>{agent.email}</TableCell>
                                <TableCell align="center">
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center' }}>
                                        <Typography variant="body2">{agent.workload}</Typography>
                                        <LinearProgress 
                                            variant="determinate" 
                                            value={Math.min(agent.workload * 10, 100)} 
                                            sx={{ width: 100, height: 8, borderRadius: 4 }}
                                            color={agent.workload > 5 ? 'error' : 'success'}
                                        />
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <Chip label={agent.workload > 10 ? 'Busy' : 'Available'} size="small" variant="outlined" />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>
        </Box>
    );
};

export default AdminView;
