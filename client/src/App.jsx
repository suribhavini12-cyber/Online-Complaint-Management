import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import theme from './theme';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Pages (to be created)
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import CreateComplaint from './pages/CreateComplaint';
import ComplaintDetails from './pages/ComplaintDetails';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Profile from './pages/Profile';
import MyComplaints from './pages/MyComplaints';
import AssignedTasks from './pages/AssignedTasks';
import ManageUsers from './pages/ManageUsers';
import AnalyticsPage from './pages/AnalyticsPage';
import FileGuide from './pages/FileGuide';
import ComplaintTracking from './pages/ComplaintTracking';
import Chatbot from './components/Chatbot';

const ProtectedRoute = ({ children, roles }) => {
    const { user, loading } = useAuth();

    if (loading) return null;
    if (!user) return <Navigate to="/login" />;
    if (roles && !roles.includes(user.role)) return <Navigate to="/" />;

    return children;
};

function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <AuthProvider>
                <Router>
                    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/guide" element={<FileGuide />} />
                            <Route 
                                path="/dashboard/track" 
                                element={
                                    <ProtectedRoute>
                                        <ComplaintTracking />
                                    </ProtectedRoute>
                                } 
                            />
                            <Route 
                                path="/dashboard/track/:id" 
                                element={
                                    <ProtectedRoute>
                                        <ComplaintTracking />
                                    </ProtectedRoute>
                                } 
                            />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/forgot-password" element={<ForgotPassword />} />
                            <Route path="/reset-password" element={<ResetPassword />} />
                            <Route 
                                path="/dashboard" 
                                element={
                                    <ProtectedRoute>
                                        <Dashboard />
                                    </ProtectedRoute>
                                } 
                            />
                            <Route 
                                path="/dashboard/profile" 
                                element={
                                    <ProtectedRoute>
                                        <Profile />
                                    </ProtectedRoute>
                                } 
                            />
                            <Route 
                                path="/dashboard/create" 
                                element={
                                    <ProtectedRoute roles={['user']}>
                                        <CreateComplaint />
                                    </ProtectedRoute>
                                } 
                            />
                            <Route 
                                path="/dashboard/complaints" 
                                element={
                                    <ProtectedRoute roles={['user', 'admin']}>
                                        <MyComplaints />
                                    </ProtectedRoute>
                                } 
                            />
                            <Route 
                                path="/dashboard/assigned" 
                                element={
                                    <ProtectedRoute roles={['agent']}>
                                        <AssignedTasks />
                                    </ProtectedRoute>
                                } 
                            />
                            <Route 
                                path="/dashboard/users" 
                                element={
                                    <ProtectedRoute roles={['admin']}>
                                        <ManageUsers />
                                    </ProtectedRoute>
                                } 
                            />
                            <Route 
                                path="/dashboard/analytics" 
                                element={
                                    <ProtectedRoute roles={['admin']}>
                                        <AnalyticsPage />
                                    </ProtectedRoute>
                                } 
                            />
                            <Route 
                                path="/dashboard/complaint/:id" 
                                element={
                                    <ProtectedRoute>
                                        <ComplaintDetails />
                                    </ProtectedRoute>
                                } 
                            />
                        </Routes>
                    </Box>
                    <Chatbot />
                    <ToastContainer position="bottom-right" theme="dark" />
                </Router>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;
