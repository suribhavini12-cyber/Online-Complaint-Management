import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, TextField, MenuItem, Button, Table, TableBody, TableCell, TableHead, TableRow, Chip, Toolbar, Container, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Select, FormControl, InputLabel, Stack, Grid } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import axios from 'axios';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('All');
    
    // Edit Role Dialog State
    const [selectedUser, setSelectedUser] = useState(null);
    const [editRole, setEditRole] = useState('');
    const [dialogOpen, setDialogOpen] = useState(false);

    const fetchUsers = async () => {
        try {
            const { data } = await axios.get('/api/admin/users');
            setUsers(data);
            setFilteredUsers(data);
        } catch (error) {
            toast.error('Failed to retrieve user list');
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        let temp = [...users];

        if (search) {
            temp = temp.filter(u => 
                u.name.toLowerCase().includes(search.toLowerCase()) || 
                u.email.toLowerCase().includes(search.toLowerCase()) ||
                u.phone.toLowerCase().includes(search.toLowerCase())
            );
        }

        if (roleFilter !== 'All') {
            temp = temp.filter(u => u.role === roleFilter);
        }

        setFilteredUsers(temp);
    }, [search, roleFilter, users]);


    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;
        try {
            await axios.delete(`/api/admin/users/${id}`);
            toast.success('User deleted successfully');
            fetchUsers();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete user');
        }
    };

    const handleOpenEdit = (user) => {
        setSelectedUser(user);
        setEditRole(user.role);
        setDialogOpen(true);
    };

    const handleSaveRole = async () => {
        try {
            await axios.put(`/api/admin/users/${selectedUser._id}`, { role: editRole });
            toast.success('User role updated successfully');
            setDialogOpen(false);
            fetchUsers();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update user role');
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
                        <Typography variant="h4" fontWeight={700}>Manage Users</Typography>
                        <Typography variant="body1" color="text.secondary">Review all registered customers, agents, and administrators</Typography>
                    </Box>

                    {/* Filters */}
                    <Paper sx={{ p: 3, mb: 4 }}>
                        <Grid container spacing={2} alignItems="center">
                            <Grid item xs={12} md={8}>
                                <TextField
                                    label="Search by Name, Email, or Phone"
                                    fullWidth
                                    size="small"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    select
                                    label="Filter by Role"
                                    fullWidth
                                    size="small"
                                    value={roleFilter}
                                    onChange={(e) => setRoleFilter(e.target.value)}
                                >
                                    <MenuItem value="All">All Roles</MenuItem>
                                    <MenuItem value="user">Individual User</MenuItem>
                                    <MenuItem value="agent">Support Agent</MenuItem>
                                    <MenuItem value="admin">Administrator</MenuItem>
                                </TextField>
                            </Grid>
                        </Grid>
                    </Paper>

                    {/* Users Table */}
                    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Email</TableCell>
                                    <TableCell>Phone</TableCell>
                                    <TableCell>Role</TableCell>
                                    <TableCell>Workload (Agents Only)</TableCell>
                                    <TableCell align="right">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredUsers.length > 0 ? filteredUsers.map((u) => (
                                    <TableRow key={u._id}>
                                        <TableCell sx={{ fontWeight: 600 }}>{u.name}</TableCell>
                                        <TableCell>{u.email}</TableCell>
                                        <TableCell>{u.phone}</TableCell>
                                        <TableCell>
                                            <Chip 
                                                label={u.role.toUpperCase()} 
                                                size="small" 
                                                color={u.role === 'admin' ? 'error' : u.role === 'agent' ? 'secondary' : 'default'} 
                                            />
                                        </TableCell>
                                        <TableCell>
                                            {u.role === 'agent' ? (
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <Typography variant="body2">{u.workload || 0}</Typography>
                                                    <Chip 
                                                        label={u.workload > 5 ? 'High' : 'Low'} 
                                                        size="small" 
                                                        variant="outlined" 
                                                        color={u.workload > 5 ? 'error' : 'success'} 
                                                    />
                                                </Box>
                                            ) : '-'}
                                        </TableCell>
                                        <TableCell align="right">
                                            <Stack direction="row" spacing={1} justifyContent="flex-end">
                                                <IconButton color="secondary" onClick={() => handleOpenEdit(u)}>
                                                    <EditIcon sx={{ fontSize: 20 }} />
                                                </IconButton>
                                                <IconButton 
                                                    color="error" 
                                                    onClick={() => handleDelete(u._id)}
                                                    disabled={u.role === 'admin'} // Protect admins
                                                >
                                                    <DeleteIcon sx={{ fontSize: 20 }} />
                                                </IconButton>
                                            </Stack>
                                        </TableCell>
                                    </TableRow>
                                )) : (
                                    <TableRow>
                                        <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                                            No users found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </Paper>
                </Container>
            </Box>

            {/* Edit Role Dialog */}
            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
                <DialogTitle>Edit User Role</DialogTitle>
                <DialogContent sx={{ minWidth: 300, pt: 2 }}>
                    <Stack spacing={2} sx={{ mt: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                            Modify role for user: <strong>{selectedUser?.name}</strong>
                        </Typography>
                        <FormControl fullWidth>
                            <InputLabel id="role-select-label">Role</InputLabel>
                            <Select
                                labelId="role-select-label"
                                value={editRole}
                                label="Role"
                                onChange={(e) => setEditRole(e.target.value)}
                            >
                                <MenuItem value="user">User</MenuItem>
                                <MenuItem value="agent">Agent</MenuItem>
                                <MenuItem value="admin">Admin</MenuItem>
                            </Select>
                        </FormControl>
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleSaveRole} variant="contained" color="secondary">Save Changes</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ManageUsers;
