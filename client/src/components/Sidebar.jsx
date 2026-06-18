import React from 'react';
import { Drawer, List, ListItemButton, ListItemIcon, ListItemText, Toolbar, Box } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PeopleIcon from '@mui/icons-material/People';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import HelpIcon from '@mui/icons-material/Help';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const drawerWidth = 240;

const Sidebar = ({ open, onToggle }) => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard', roles: ['user', 'agent', 'admin'] },
        { text: 'New Complaint', icon: <AddCircleIcon />, path: '/dashboard/create', roles: ['user'] },
        { text: 'Track Complaint', icon: <TrackChangesIcon />, path: '/dashboard/track', roles: ['user', 'agent', 'admin'] },
        { text: user?.role === 'admin' ? 'Manage Complaints' : 'My Complaints', icon: <AssignmentIcon />, path: '/dashboard/complaints', roles: ['user', 'admin'] },
        { text: 'Assigned Tasks', icon: <AssignmentIcon />, path: '/dashboard/assigned', roles: ['agent'] },
        { text: 'Manage Users', icon: <PeopleIcon />, path: '/dashboard/users', roles: ['admin'] },
        { text: 'Analytics', icon: <AnalyticsIcon />, path: '/dashboard/analytics', roles: ['admin'] },
        { text: 'Filing Guide', icon: <HelpIcon />, path: '/guide', roles: ['user', 'agent', 'admin'] },
    ];

    const filteredItems = menuItems.filter(item => item.roles.includes(user?.role));

    return (
        <Drawer
            variant="permanent"
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                [`& .MuiDrawer-paper`]: { 
                    width: drawerWidth, 
                    boxSizing: 'border-box',
                    bgcolor: 'background.paper',
                    borderRight: '1px solid rgba(100, 255, 218, 0.1)'
                },
                display: { xs: open ? 'block' : 'none', sm: 'block' }
            }}
        >
            <Toolbar />
            <Box sx={{ overflow: 'auto', py: 2 }}>
                <List>
                    {filteredItems.map((item) => (
                        <ListItemButton 
                            key={item.text} 
                            onClick={() => navigate(item.path)}
                            selected={location.pathname === item.path}
                            sx={{
                                mb: 1,
                                mx: 1,
                                borderRadius: 1,
                                color: location.pathname === item.path ? 'secondary.main' : 'text.primary',
                                bgcolor: location.pathname === item.path ? 'rgba(100, 255, 218, 0.05)' : 'transparent',
                                '&:hover': {
                                    bgcolor: 'rgba(100, 255, 218, 0.1)',
                                }
                            }}
                        >
                            <ListItemIcon sx={{ color: 'inherit' }}>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText primary={item.text} />
                        </ListItemButton>
                    ))}
                </List>
            </Box>
        </Drawer>
    );
};

export default Sidebar;
