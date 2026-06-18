import React, { useState } from 'react';
import { Box, Toolbar, Container } from '@mui/material';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';

// Dashboards
import UserView from './dashboards/UserView';
import AgentView from './dashboards/AgentView';
import AdminView from './dashboards/AdminView';

const Dashboard = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { user } = useAuth();

    const handleToggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const renderDashboard = () => {
        switch (user?.role) {
            case 'admin': return <AdminView />;
            case 'agent': return <AgentView />;
            case 'user': return <UserView />;
            default: return null;
        }
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <Navbar onToggleSidebar={handleToggleSidebar} />
            <Sidebar open={sidebarOpen} onToggle={handleToggleSidebar} />
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    width: { sm: `calc(100% - 240px)` },
                    minHeight: '100vh',
                    bgcolor: 'background.default'
                }}
            >
                <Toolbar />
                <Container maxWidth="xl">
                    {renderDashboard()}
                </Container>
            </Box>
        </Box>
    );
};

export default Dashboard;
