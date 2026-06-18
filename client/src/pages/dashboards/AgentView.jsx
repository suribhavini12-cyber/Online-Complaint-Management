import React, { useState, useEffect } from 'react';
import { Grid, Paper, Typography, Box, Table, TableBody, TableCell, TableHead, TableRow, Chip, Button } from '@mui/material';
import axios from 'axios';
import { Link } from 'react-router-dom';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import TaskIcon from '@mui/icons-material/Task';

const StatCard = ({ title, value, icon: Icon, color }) => (
    <Paper sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: `${color}.main`, color: 'white', opacity: 0.8 }}>
            <Icon />
        </Box>
        <Box>
            <Typography variant="body2" color="text.secondary">{title}</Typography>
            <Typography variant="h4" fontWeight={700}>{value}</Typography>
        </Box>
    </Paper>
);

const AgentView = () => {
    const [assigned, setAssigned] = useState([]);
    const [stats, setStats] = useState({ active: 0, resolved: 0, pending: 0 });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await axios.get('/api/complaints');
                setAssigned(data);
                setStats({
                    active: data.filter(c => c.status === 'Assigned' || c.status === 'In Progress').length,
                    resolved: data.filter(c => c.status === 'Resolved' || c.status === 'Closed').length,
                    pending: data.filter(c => c.status === 'Pending').length
                });
            } catch (error) {
                console.error('Error fetching assigned complaints:', error);
            }
        };
        fetchData();
    }, []);

    return (
        <Box>
             <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight={700}>Agent Dashboard</Typography>
                <Typography variant="body1" color="text.secondary">Review and manage your assigned complaints</Typography>
            </Box>

            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={4}>
                    <StatCard title="Active Tasks" value={stats.active} icon={HourglassEmptyIcon} color="info" />
                </Grid>
                <Grid item xs={12} md={4}>
                    <StatCard title="Total Resolved" value={stats.resolved} icon={AssignmentTurnedInIcon} color="success" />
                </Grid>
                <Grid item xs={12} md={4}>
                    <StatCard title="New Requests" value={stats.pending} icon={TaskIcon} color="warning" />
                </Grid>
            </Grid>

            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                <Box sx={{ p: 3, borderBottom: '1px solid rgba(100, 255, 218, 0.1)' }}>
                    <Typography variant="h6">Assigned Complaints</Typography>
                </Box>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Complaint ID</TableCell>
                            <TableCell>Customer</TableCell>
                            <TableCell>Issue</TableCell>
                            <TableCell>Priority</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell align="right">Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {assigned.length > 0 ? assigned.map((complaint) => (
                            <TableRow key={complaint._id}>
                                <TableCell sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>#{complaint._id.slice(-6).toUpperCase()}</TableCell>
                                <TableCell>{complaint.userId?.name}</TableCell>
                                <TableCell>{complaint.title}</TableCell>
                                <TableCell>
                                    <Chip 
                                        label={complaint.priority} 
                                        size="small" 
                                        color={complaint.priority === 'High' ? 'error' : 'default'} 
                                    />
                                </TableCell>
                                <TableCell>
                                    <Chip label={complaint.status} size="small" variant="outlined" color="primary" />
                                </TableCell>
                                <TableCell align="right">
                                    <Button size="small" component={Link} to={`/dashboard/complaint/${complaint._id}`}>
                                        Manage
                                    </Button>
                                </TableCell>
                            </TableRow>
                        )) : (
                            <TableRow>
                                <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                                    No assigned complaints found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </Paper>
        </Box>
    );
};

export default AgentView;
