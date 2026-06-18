import React, { useState, useEffect } from 'react';
import { Grid, Paper, Typography, Box, Button, Table, TableBody, TableCell, TableHead, TableRow, Chip } from '@mui/material';
import axios from 'axios';
import { Link } from 'react-router-dom';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AddIcon from '@mui/icons-material/Add';

const StatCard = ({ title, value, icon: Icon }) => (
    <Paper sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'rgba(100, 255, 218, 0.1)', color: 'secondary.main' }}>
            <Icon />
        </Box>
        <Box>
            <Typography variant="body2" color="text.secondary">{title}</Typography>
            <Typography variant="h4" fontWeight={700}>{value}</Typography>
        </Box>
    </Paper>
);

const UserView = () => {
    const [complaints, setComplaints] = useState([]);
    const [stats, setStats] = useState({ total: 0, pending: 0, resolved: 0 });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await axios.get('/api/complaints');
                setComplaints(data);
                setStats({
                    total: data.length,
                    pending: data.filter(c => c.status === 'Pending' || c.status === 'Assigned').length,
                    resolved: data.filter(c => c.status === 'Resolved' || c.status === 'Closed').length
                });
            } catch (error) {
                console.error('Error fetching complaints:', error);
            }
        };
        fetchData();
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending': return 'warning';
            case 'Assigned': return 'info';
            case 'In Progress': return 'primary';
            case 'Resolved': return 'success';
            case 'Closed': return 'default';
            default: return 'primary';
        }
    };

    return (
        <Box>
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h4" fontWeight={700}>User Dashboard</Typography>
                <Button component={Link} to="/dashboard/create" variant="contained" color="secondary" startIcon={<AddIcon />}>
                    New Complaint
                </Button>
            </Box>

            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={4}>
                    <StatCard title="Total Complaints" value={stats.total} icon={AssignmentIcon} />
                </Grid>
                <Grid item xs={12} md={4}>
                    <StatCard title="Active" value={stats.pending} icon={AssignmentIcon} />
                </Grid>
                <Grid item xs={12} md={4}>
                    <StatCard title="Resolved" value={stats.resolved} icon={AssignmentIcon} />
                </Grid>
            </Grid>

            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                <Box sx={{ p: 3, borderBottom: '1px solid rgba(100, 255, 218, 0.1)' }}>
                    <Typography variant="h6">Recent Complaints</Typography>
                </Box>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Title</TableCell>
                            <TableCell>Category</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Date Created</TableCell>
                            <TableCell>Assigned Agent</TableCell>
                            <TableCell align="right">Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {complaints.length > 0 ? complaints.map((complaint) => (
                            <TableRow key={complaint._id}>
                                <TableCell>{complaint.title}</TableCell>
                                <TableCell>{complaint.category}</TableCell>
                                <TableCell>
                                    <Chip 
                                        label={complaint.status} 
                                        size="small" 
                                        color={getStatusColor(complaint.status)} 
                                    />
                                </TableCell>
                                <TableCell>{new Date(complaint.createdAt).toLocaleDateString()}</TableCell>
                                <TableCell>{complaint.assignedAgentId?.name || 'Unassigned'}</TableCell>
                                <TableCell align="right">
                                    <Button size="small" component={Link} to={`/dashboard/complaint/${complaint._id}`}>
                                        View Details
                                    </Button>
                                </TableCell>
                            </TableRow>
                        )) : (
                            <TableRow>
                                <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                                    No complaints found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </Paper>
        </Box>
    );
};

export default UserView;
