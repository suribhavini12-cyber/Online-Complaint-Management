import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, TextField, Grid, MenuItem, Button, Table, TableBody, TableCell, TableHead, TableRow, Chip, Toolbar, Container, Stack } from '@mui/material';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';

const MyComplaints = () => {
    const { user } = useAuth();
    const [complaints, setComplaints] = useState([]);
    const [filteredComplaints, setFilteredComplaints] = useState([]);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    
    // Filters
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [priorityFilter, setPriorityFilter] = useState('All');

    useEffect(() => {
        const fetchComplaints = async () => {
            try {
                const { data } = await axios.get('/api/complaints');
                setComplaints(data);
                setFilteredComplaints(data);
            } catch (error) {
                console.error('Error fetching complaints:', error);
            }
        };
        fetchComplaints();
    }, []);

    useEffect(() => {
        let temp = [...complaints];

        if (search) {
            temp = temp.filter(c => 
                c.title.toLowerCase().includes(search.toLowerCase()) || 
                c.description.toLowerCase().includes(search.toLowerCase()) ||
                (c.userId?.name && c.userId.name.toLowerCase().includes(search.toLowerCase()))
            );
        }

        if (statusFilter !== 'All') {
            temp = temp.filter(c => c.status === statusFilter);
        }

        if (categoryFilter !== 'All') {
            temp = temp.filter(c => c.category === categoryFilter);
        }

        if (priorityFilter !== 'All') {
            temp = temp.filter(c => c.priority === priorityFilter);
        }

        setFilteredComplaints(temp);
    }, [search, statusFilter, categoryFilter, priorityFilter, complaints]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending': return 'warning';
            case 'Assigned': return 'info';
            case 'In Progress': return 'primary';
            case 'Resolved': return 'success';
            case 'Closed': return 'default';
            case 'Reopened': return 'error';
            default: return 'primary';
        }
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
            <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
            <Box component="main" sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - 240px)` } }}>
                <Toolbar />
                <Container maxWidth="xl">
                    <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h4" fontWeight={700}>
                            {user?.role === 'admin' ? 'Manage Complaints' : 'My Complaints'}
                        </Typography>
                        {user?.role === 'user' && (
                            <Button component={Link} to="/dashboard/create" variant="contained" color="secondary">
                                File Complaint
                            </Button>
                        )}
                    </Box>

                    {/* Filters Section */}
                    <Paper sx={{ p: 3, mb: 4 }}>
                        <Grid container spacing={2} alignItems="center">
                            <Grid item xs={12} md={4}>
                                <TextField
                                    label="Search Title, Description, or Customer"
                                    fullWidth
                                    size="small"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12} sm={4} md={2}>
                                <TextField
                                    select
                                    label="Status"
                                    fullWidth
                                    size="small"
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                >
                                    <MenuItem value="All">All Statuses</MenuItem>
                                    <MenuItem value="Pending">Pending</MenuItem>
                                    <MenuItem value="Assigned">Assigned</MenuItem>
                                    <MenuItem value="In Progress">In Progress</MenuItem>
                                    <MenuItem value="Resolved">Resolved</MenuItem>
                                    <MenuItem value="Reopened">Reopened</MenuItem>
                                    <MenuItem value="Closed">Closed</MenuItem>
                                </TextField>
                            </Grid>
                            <Grid item xs={12} sm={4} md={3}>
                                <TextField
                                    select
                                    label="Category"
                                    fullWidth
                                    size="small"
                                    value={categoryFilter}
                                    onChange={(e) => setCategoryFilter(e.target.value)}
                                >
                                    <MenuItem value="All">All Categories</MenuItem>
                                    <MenuItem value="Technical">Technical</MenuItem>
                                    <MenuItem value="Billing">Billing</MenuItem>
                                    <MenuItem value="Service">Service</MenuItem>
                                    <MenuItem value="Security">Security</MenuItem>
                                    <MenuItem value="Other">Other</MenuItem>
                                </TextField>
                            </Grid>
                            <Grid item xs={12} sm={4} md={3}>
                                <TextField
                                    select
                                    label="Priority"
                                    fullWidth
                                    size="small"
                                    value={priorityFilter}
                                    onChange={(e) => setPriorityFilter(e.target.value)}
                                >
                                    <MenuItem value="All">All Priorities</MenuItem>
                                    <MenuItem value="Low">Low</MenuItem>
                                    <MenuItem value="Medium">Medium</MenuItem>
                                    <MenuItem value="High">High</MenuItem>
                                </TextField>
                            </Grid>
                        </Grid>
                    </Paper>

                    {/* Complaints Table */}
                    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Complaint ID</TableCell>
                                    {user?.role === 'admin' && <TableCell>Customer</TableCell>}
                                    <TableCell>Title</TableCell>
                                    <TableCell>Category</TableCell>
                                    <TableCell>Priority</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Date Created</TableCell>
                                    <TableCell>Assigned Agent</TableCell>
                                    <TableCell align="right">Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredComplaints.length > 0 ? filteredComplaints.map((complaint) => (
                                    <TableRow key={complaint._id}>
                                        <TableCell sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>
                                            #{complaint._id.slice(-6).toUpperCase()}
                                        </TableCell>
                                        {user?.role === 'admin' && (
                                            <TableCell>{complaint.userId?.name || 'Unknown'}</TableCell>
                                        )}
                                        <TableCell>{complaint.title}</TableCell>
                                        <TableCell>{complaint.category}</TableCell>
                                        <TableCell>
                                            <Chip 
                                                label={complaint.priority} 
                                                size="small" 
                                                color={complaint.priority === 'High' ? 'error' : 'default'} 
                                            />
                                        </TableCell>
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
                                                {user?.role === 'admin' ? 'Manage' : 'View Details'}
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                )) : (
                                    <TableRow>
                                        <TableCell colSpan={user?.role === 'admin' ? 9 : 8} align="center" sx={{ py: 3 }}>
                                            No complaints found matching filters.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </Paper>
                </Container>
            </Box>
        </Box>
    );
};

export default MyComplaints;
