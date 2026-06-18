import React from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Box, Tooltip } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ onToggleSidebar }) => {
    const { logout, user } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, bgcolor: 'background.paper' }}>
            <Toolbar>
                <IconButton
                    color="inherit"
                    edge="start"
                    onClick={onToggleSidebar}
                    sx={{ mr: 2, display: { sm: 'none' } }}
                >
                    <MenuIcon />
                </IconButton>
                <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, color: 'secondary.main', fontWeight: 800 }}>
                    OCRMS
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {user?.name} ({user?.role})
                    </Typography>
                    <Tooltip title="Profile Settings">
                        <IconButton color="secondary" onClick={() => navigate('/dashboard/profile')}>
                            <AccountCircleIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Logout">
                        <IconButton color="secondary" onClick={handleLogout}>
                            <LogoutIcon />
                        </IconButton>
                    </Tooltip>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
