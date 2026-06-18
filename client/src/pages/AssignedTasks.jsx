import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, TextField, Grid, MenuItem, Button, Table, TableBody, TableCell, TableHead, TableRow, Chip, Toolbar, Container } from '@mui/material';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const AssignedTasks = () => {
    const [tasks, setTasks] = useState([]);
    const [filteredTasks, setFilteredTasks] = useState([]);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    
    // Filters
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [priorityFilter, setPriorityFilter] = useState('All');

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const { data } = await axios.get('/api/complaints');
                setTasks(data);
                setFilteredTasks(data);
            } catch (error) {
                console.error('Error fetching assigned tasks:', error);
            }
        };
        fetchTasks();
    }, []);

    useEffect(() => {
        let temp = [...tasks];

        if (search) {
            temp = temp.filter(t => 
                t.title.toLowerCase().includes(search.toLowerCase()) || 
                t.description.toLowerCase().includes(search.toLowerCase()) ||
                (t.userId?.name && t.userId.name.toLowerCase().includes(search.toLowerCase()))
            );
        }

        if (statusFilter !== 'All') {
            temp = temp.filter(t => t.status === statusFilter);
        }

        if (priorityFilter !== 'All') {
            temp = temp.filter(t => t.priority === priorityFilter);
        }

        setFilteredTasks(temp);
    }, [search, statusFilter, priorityFilter, tasks]);

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
                    <Box sx={{ mb: 4 }}>
                        <Typography variant="h4" fontWeight={700}>Assigned Tasks</Typography>
                        <Typography variant="body1" color="text.secondary">Filter, search, and update your assigned complaints</Typography>
                    </Box>

                    {/* Filters Section */}
                    <Paper sx={{ p: 3, mb: 4 }}>
                        <Grid container spacing={2} alignItems="center">
                            <Grid item xs={12} md={6}>
                                <TextField
                                    label="Search by Title, Description, or Customer"
                                    fullWidth
                                    size="small"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <TextField
                                    select
                                    label="Status"
                                    fullWidth
                                    size="small"
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                >
                                    <MenuItem value="All">All Statuses</MenuItem>
                                    <MenuItem value="Assigned">Assigned</MenuItem>
                                    <MenuItem value="In Progress">In Progress</MenuItem>
                                    <MenuItem value="Resolved">Resolved</MenuItem>
                                    <MenuItem value="Reopened">Reopened</MenuItem>
                                    <MenuItem value="Closed">Closed</MenuItem>
                                </TextField>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
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

                    {/* Tasks Table */}
                    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Complaint ID</TableCell>
                                    <TableCell>Customer</TableCell>
                                    <TableCell>Issue Title</TableCell>
                                    <TableCell>Category</TableCell>
                                    <TableCell>Priority</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Assigned Date</TableCell>
                                    <TableCell align="right">Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredTasks.length > 0 ? filteredTasks.map((complaint) => (
                                    <TableRow key={complaint._id}>
                                        <TableCell sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>
                                            #{complaint._id.slice(-6).toUpperCase()}
                                        </TableCell>
                                        <TableCell>{complaint.userId?.name || 'Anonymous'}</TableCell>
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
                                        <TableCell>{new Date(complaint.updatedAt).toLocaleDateString()}</TableCell>
                                        <TableCell align="right">
                                            <Button size="small" component={Link} to={`/dashboard/complaint/${complaint._id}`}>
                                                Manage Task
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                )) : (
                                    <TableRow>
                                        <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                                            No assigned tasks found matching the criteria.
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

export default AssignedTasks;
