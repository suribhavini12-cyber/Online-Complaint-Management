import React, { useState } from 'react';
import { Box, Paper, Typography, TextField, Button, Grid, MenuItem, Stack, Toolbar, Container } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { motion } from 'framer-motion';

const stateCitiesData = {
    "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur", "Nellore", "Tirupati"],
    "Arunachal Pradesh": ["Itanagar", "Naharlagun", "Pasighat"],
    "Assam": ["Guwahati", "Dibrugarh", "Silchar", "Tezpur", "Jorhat"],
    "Bihar": ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Purnia"],
    "Chhattisgarh": ["Raipur", "Bhilai", "Bilaspur", "Korba", "Durg"],
    "Goa": ["Panaji", "Margao", "Vasco da Gama", "Mapusa"],
    "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Gandhinagar"],
    "Haryana": ["Gurugram", "Faridabad", "Panipat", "Ambala", "Karnal"],
    "Himachal Pradesh": ["Shimla", "Dharamshala", "Solan", "Mandi"],
    "Jharkhand": ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro", "Deoghar"],
    "Karnataka": ["Bengaluru", "Mysuru", "Hubballi-Dharwad", "Mangaluru", "Belagavi"],
    "Kerala": ["Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur", "Kollam"],
    "Madhya Pradesh": ["Bhopal", "Indore", "Jabalpur", "Gwalior", "Ujjain"],
    "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Thane", "Nashik", "Aurangabad"],
    "Manipur": ["Imphal", "Thoubal", "Kakching"],
    "Meghalaya": ["Shillong", "Tura", "Jowai"],
    "Mizoram": ["Aizawl", "Lunglei", "Champhai"],
    "Nagaland": ["Kohima", "Dimapur", "Mokokchung"],
    "Odisha": ["Bhubaneswar", "Cuttack", "Rourkela", "Sambalpur", "Puri"],
    "Punjab": ["Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda"],
    "Rajasthan": ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Bikaner", "Ajmer"],
    "Sikkim": ["Gangtok", "Namchi", "Geyzing"],
    "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Trichy", "Salem", "Tirunelveli"],
    "Telangana": ["Hyderabad", "Warangal", "Nizamabad", "Khammam", "Karimnagar"],
    "Tripura": ["Agartala", "Dharmanagar", "Udaipur"],
    "Uttar Pradesh": ["Lucknow", "Kanpur", "Noida", "Ghaziabad", "Agra", "Varanasi", "Prayagraj"],
    "Uttarakhand": ["Dehradun", "Haridwar", "Rishikesh", "Haldwani"],
    "West Bengal": ["Kolkata", "Howrah", "Durgapur", "Asansol", "Siliguri"],
    "Andaman and Nicobar Islands": ["Port Blair"],
    "Chandigarh": ["Chandigarh"],
    "Dadra and Nagar Haveli and Daman and Diu": ["Daman", "Diu", "Silvassa"],
    "Delhi": ["New Delhi", "Dwarka", "Rohini"],
    "Jammu and Kashmir": ["Srinagar", "Jammu", "Anantnag"],
    "Ladakh": ["Leh", "Kargil"],
    "Lakshadweep": ["Kavaratti"],
    "Puducherry": ["Puducherry", "Karaikal", "Mahe"]
};

const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.8,
            ease: [0.16, 1, 0.3, 1],
            staggerChildren: 0.08
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
    }
};

const inputStyles = {
    bgcolor: 'rgba(10, 25, 47, 0.35)',
    borderRadius: 1,
    '& .MuiInputBase-input': {
        color: '#e6f1ff',
    },
    '& .MuiInputLabel-root': {
        color: '#8892b0',
    },
    '& .MuiInputLabel-root.Mui-focused': {
        color: '#64ffda',
    },
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderColor: 'rgba(100, 255, 218, 0.15)',
            transition: 'border-color 0.25s ease, box-shadow 0.25s ease',
        },
        '&:hover fieldset': {
            borderColor: 'rgba(100, 255, 218, 0.45)',
        },
        '&.Mui-focused fieldset': {
            borderColor: '#64ffda',
            boxShadow: '0 0 15px rgba(100, 255, 218, 0.15)',
        },
    },
    '& .MuiSelect-icon': {
        color: '#8892b0',
    },
};

const CreateComplaint = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'Service',
        address: '',
        city: '',
        state: '',
        pincode: '',
        priority: 'Medium'
    });
    const navigate = useNavigate();

    const handleStateChange = (e) => {
        setFormData({
            ...formData,
            state: e.target.value,
            city: '' // reset city when state changes
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/complaints', formData);
            toast.success('Complaint registered and auto-assigned to an agent!');
            navigate('/dashboard');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to submit complaint');
        }
    };

    return (
        <Box sx={{ display: 'flex', position: 'relative', minHeight: '100vh', overflow: 'hidden' }}>
            {/* Background glowing gradient */}
            <Box sx={{
                position: 'absolute',
                top: '15%',
                right: '10%',
                width: '450px',
                height: '450px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(100, 255, 218, 0.03) 0%, rgba(0,0,0,0) 70%)',
                filter: 'blur(60px)',
                pointerEvents: 'none',
                zIndex: 0
            }} />

            <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
            <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
            <Box component="main" sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - 240px)` }, zIndex: 1 }}>
                <Toolbar />
                <Container maxWidth="md">
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <Paper sx={{ 
                            p: 4, 
                            mt: 4,
                            background: 'rgba(10, 25, 47, 0.4)', 
                            backdropFilter: 'blur(20px) saturate(180%)',
                            border: '1px solid rgba(100, 255, 218, 0.08)',
                            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.4), 0 0 30px rgba(100, 255, 218, 0.03)',
                            borderRadius: 3
                        }}>
                            <Typography variant="h5" fontWeight={800} gutterBottom sx={{ color: 'secondary.main', mb: 3, letterSpacing: 0.5 }}>
                                Register New Complaint
                            </Typography>
                            
                            <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
                                <Stack spacing={3}>
                                    <motion.div variants={itemVariants} style={{ width: '100%' }}>
                                        <TextField
                                            label="Title"
                                            fullWidth
                                            value={formData.title}
                                            onChange={(e) => setFormData({...formData, title: e.target.value})}
                                            required
                                            sx={inputStyles}
                                        />
                                    </motion.div>
                                    
                                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
                                        <Box sx={{ flex: 1 }}>
                                            <motion.div variants={itemVariants} style={{ width: '100%' }}>
                                                <TextField
                                                    select
                                                    label="Category"
                                                    fullWidth
                                                    value={formData.category}
                                                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                                                    sx={inputStyles}
                                                >
                                                    <MenuItem value="Technical">Technical</MenuItem>
                                                    <MenuItem value="Billing">Billing</MenuItem>
                                                    <MenuItem value="Service">Service</MenuItem>
                                                    <MenuItem value="Security">Security</MenuItem>
                                                    <MenuItem value="Other">Other</MenuItem>
                                                </TextField>
                                            </motion.div>
                                        </Box>
                                        <Box sx={{ flex: 1 }}>
                                            <motion.div variants={itemVariants} style={{ width: '100%' }}>
                                                <TextField
                                                    select
                                                    label="Priority"
                                                    fullWidth
                                                    value={formData.priority}
                                                    onChange={(e) => setFormData({...formData, priority: e.target.value})}
                                                    sx={inputStyles}
                                                >
                                                    <MenuItem value="Low">Low</MenuItem>
                                                    <MenuItem value="Medium">Medium</MenuItem>
                                                    <MenuItem value="High">High</MenuItem>
                                                </TextField>
                                            </motion.div>
                                        </Box>
                                    </Stack>
                                    
                                    <motion.div variants={itemVariants} style={{ width: '100%' }}>
                                        <TextField
                                            label="Description"
                                            fullWidth
                                            multiline
                                            rows={4}
                                            value={formData.description}
                                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                                            required
                                            sx={inputStyles}
                                        />
                                    </motion.div>
                                    
                                    <motion.div variants={itemVariants} style={{ width: '100%' }}>
                                        <TextField
                                            label="Address"
                                            fullWidth
                                            value={formData.address}
                                            onChange={(e) => setFormData({...formData, address: e.target.value})}
                                            required
                                            sx={inputStyles}
                                        />
                                    </motion.div>
                                    
                                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
                                        <Box sx={{ flex: 1 }}>
                                            <motion.div variants={itemVariants} style={{ width: '100%' }}>
                                                <TextField
                                                    select
                                                    label="State"
                                                    fullWidth
                                                    value={formData.state}
                                                    onChange={handleStateChange}
                                                    required
                                                    sx={inputStyles}
                                                >
                                                    {Object.keys(stateCitiesData).map((state) => (
                                                        <MenuItem key={state} value={state}>
                                                            {state}
                                                        </MenuItem>
                                                    ))}
                                                </TextField>
                                            </motion.div>
                                        </Box>
                                        <Box sx={{ flex: 1 }}>
                                            <motion.div variants={itemVariants} style={{ width: '100%' }}>
                                                <TextField
                                                    select
                                                    label="City"
                                                    fullWidth
                                                    value={formData.city}
                                                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                                                    required
                                                    disabled={!formData.state}
                                                    sx={inputStyles}
                                                >
                                                    {formData.state && stateCitiesData[formData.state].map((city) => (
                                                        <MenuItem key={city} value={city}>
                                                            {city}
                                                        </MenuItem>
                                                    ))}
                                                </TextField>
                                            </motion.div>
                                        </Box>
                                        <Box sx={{ flex: 1 }}>
                                            <motion.div variants={itemVariants} style={{ width: '100%' }}>
                                                <TextField
                                                    label="Pincode"
                                                    fullWidth
                                                    value={formData.pincode}
                                                    onChange={(e) => setFormData({...formData, pincode: e.target.value})}
                                                    required
                                                    sx={inputStyles}
                                                />
                                            </motion.div>
                                        </Box>
                                    </Stack>
                                    
                                    <motion.div variants={itemVariants} style={{ width: '100%' }}>
                                        <Button 
                                            type="submit" 
                                            variant="contained" 
                                            color="secondary" 
                                            fullWidth 
                                            size="large"
                                            sx={{
                                                py: 1.5,
                                                fontSize: '1.05rem',
                                                boxShadow: '0 8px 25px rgba(100, 255, 218, 0.15)',
                                                '&:hover': {
                                                    boxShadow: '0 12px 30px rgba(100, 255, 218, 0.35)',
                                                }
                                            }}
                                        >
                                            Submit Complaint
                                        </Button>
                                    </motion.div>
                                </Stack>
                            </Box>
                        </Paper>
                    </motion.div>
                </Container>
            </Box>
        </Box>
    );
};

export default CreateComplaint;
