import React, { useState, useRef, useEffect } from 'react';
import { Box, Paper, Typography, IconButton, TextField, Stack, Button, Badge, Collapse } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import { motion, AnimatePresence } from 'framer-motion';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            id: 1,
            sender: 'bot',
            text: 'Hello! I am your OCRMS Virtual Assistant. How can I help you today? Feel free to ask a question or select a quick option below.'
        }
    ]);
    const [input, setInput] = useState('');
    const [hasUnread, setHasUnread] = useState(true);
    const chatEndRef = useRef(null);

    const quickOptions = [
        { label: 'How to file a complaint?', value: 'file' },
        { label: 'How to track a complaint?', value: 'track' },
        { label: 'What is the resolution SLA?', value: 'sla' },
        { label: 'How does auto-assignment work?', value: 'assign' }
    ];

    useEffect(() => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isOpen]);

    const handleToggle = () => {
        setIsOpen(!isOpen);
        if (hasUnread) setHasUnread(false);
    };

    const getBotResponse = (query) => {
        const text = query.toLowerCase().trim();
        
        // Help / menu / options / guide
        if (text === 'help' || text === 'menu' || text === 'options' || text === 'guide' || text === 'start' || text === 'info') {
            return 'You can ask me questions about:\n1. Filing a complaint ("how to file a complaint", "raise a ticket", "give a complaint")\n2. Tracking a complaint ("track status", "view progress", "check status")\n3. Response & resolution time ("resolution SLA", "how long will it take")\n4. How agents are assigned ("auto-assignment", "who is handling my ticket")\n5. Talking to your agent ("chat with agent", "send message")\n6. Resetting your password ("forgot password")';
        }

        // Greetings
        if (text === 'hi' || text === 'hello' || text === 'hey' || text === 'greetings' || text.startsWith('hi ') || text.startsWith('hello ') || text.startsWith('hey ')) {
            return 'Hi there! How can I assist you with OCRMS today? You can ask about filing or tracking complaints, SLA times, agent assignment, or direct messaging.';
        }

        // Track / status / progress / check / check status / history / where is my
        if (
            text.includes('track') || 
            text.includes('status') || 
            text.includes('progress') || 
            text.includes('stage') || 
            text.includes('history') ||
            (text.includes('where') && text.includes('complaint')) ||
            (text.includes('check') && (text.includes('complaint') || text.includes('ticket') || text.includes('status')))
        ) {
            return 'To track your complaint:\n1. Open the "Track Complaint" page from the sidebar.\n2. Select your complaint from the dropdown or enter its unique ticket ID.\n3. You will see a live progress stepper showing if it is Pending, Assigned, In Progress, Resolved, or Closed, along with the handling department and agent name.';
        }

        // File / register / submit / give / raise / create / report / lodge / post / make a complaint
        if (
            text.includes('file') || 
            text.includes('register') || 
            text.includes('new') || 
            text.includes('submit') || 
            text.includes('give') || 
            text.includes('raise') || 
            text.includes('report') || 
            text.includes('create') || 
            text.includes('post') || 
            text.includes('add') || 
            text.includes('lodge') ||
            (text.includes('make') && text.includes('complaint')) ||
            text.includes('complaint') // default to filing guide if general complaint keyword is used without track/status
        ) {
            return 'To file a complaint:\n1. Log in to your account.\n2. Navigate to "New Complaint" in the sidebar.\n3. Fill in the Title, Description, Category, Priority, and Location details.\n4. Click "Submit Complaint". The system will automatically route your ticket to a dedicated support specialist.';
        }

        // SLA / time / duration / days / hours / when
        if (text.includes('sla') || text.includes('time') || text.includes('duration') || text.includes('days') || text.includes('hours') || text.includes('when')) {
            return 'Resolution SLA guidelines:\n* High Priority: Escalated immediately and typically resolved within 12-24 hours.\n* Medium/Low Priority: Actioned within 24 hours; complete resolution within 2-3 business days.\n* You can check live updates in your Ticket details or chat directly with your assigned agent.';
        }

        // Assign / router / agent / who / specialist
        if (text.includes('assign') || text.includes('router') || text.includes('agent') || text.includes('who') || text.includes('specialist')) {
            return 'OCRMS uses an intelligent workload-balancing classifier service. When you file a complaint, the router checks the category (Technical, Billing, Service, Security, Other) and assigns the ticket to the support agent specializing in that sector who has the lowest active workload.';
        }

        // Login / password / reset / forgot
        if (text.includes('login') || text.includes('password') || text.includes('reset') || text.includes('forgot') || text.includes('auth')) {
            return 'If you forgot your password:\n1. Go to the login page.\n2. Click the "Forgot Password" link below the login form.\n3. Enter your registered email address to receive password reset instructions.';
        }

        // Chat / message / speak / talk
        if (text.includes('chat') || text.includes('message') || text.includes('speak') || text.includes('talk')) {
            return 'Yes, you can talk to your assigned agent! Go to "My Complaints", click "View Details" on your ticket, and use the real-time chat box on the right side of the page to message your agent directly.';
        }
        
        return "I am not sure I understand that query. Try asking about 'how to file a complaint', 'tracking status', 'resolution time', or choose one of the quick options below!";
    };

    const handleSend = (textToSend) => {
        if (!textToSend.trim()) return;

        const userMsg = {
            id: Date.now(),
            sender: 'user',
            text: textToSend
        };

        setMessages(prev => [...prev, userMsg]);
        setInput('');

        // Simulate bot typing
        setTimeout(() => {
            const botMsg = {
                id: Date.now() + 1,
                sender: 'bot',
                text: getBotResponse(textToSend)
            };
            setMessages(prev => [...prev, botMsg]);
        }, 600);
    };

    return (
        <Box sx={{ position: 'fixed', bottom: 24, right: 24, zIndex: 1000 }}>
            {/* Chat Box window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.85, y: 50 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.85, y: 50 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    >
                        <Paper sx={{
                            width: { xs: 320, sm: 380 },
                            height: 480,
                            display: 'flex',
                            flexDirection: 'column',
                            background: 'rgba(10, 25, 47, 0.85)',
                            backdropFilter: 'blur(20px) saturate(180%)',
                            border: '1px solid rgba(100, 255, 218, 0.15)',
                            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5), 0 0 30px rgba(100, 255, 218, 0.05)',
                            borderRadius: 3,
                            overflow: 'hidden',
                            mb: 2
                        }}>
                            {/* Header */}
                            <Box sx={{
                                px: 2,
                                py: 1.5,
                                background: 'rgba(23, 42, 69, 0.6)',
                                borderBottom: '1px solid rgba(100, 255, 218, 0.1)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between'
                            }}>
                                <Stack direction="row" spacing={1.5} alignItems="center">
                                    <SmartToyIcon color="secondary" />
                                    <Box>
                                        <Typography variant="subtitle1" fontWeight={700} sx={{ color: 'secondary.main', lineHeight: 1.2 }}>
                                            OCRMS Assistant
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                            <Box sx={{ width: 6, height: 6, bgcolor: '#64ffda', borderRadius: '50%' }} />
                                            Online | Auto-Guide
                                        </Typography>
                                    </Box>
                                </Stack>
                                <IconButton size="small" onClick={handleToggle} sx={{ color: 'text.secondary', '&:hover': { color: 'secondary.main' } }}>
                                    <CloseIcon fontSize="small" />
                                </IconButton>
                            </Box>

                            {/* Messages List */}
                            <Box sx={{ flexGrow: 1, p: 2, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 2 }}>
                                {messages.map((msg) => (
                                    <Box
                                        key={msg.id}
                                        sx={{
                                            alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                                            maxWidth: '80%',
                                            display: 'flex',
                                            flexDirection: 'column'
                                        }}
                                    >
                                        <Box sx={{
                                            px: 2,
                                            py: 1.2,
                                            borderRadius: 2.5,
                                            bgcolor: msg.sender === 'user' ? 'secondary.main' : 'rgba(23, 42, 69, 0.7)',
                                            color: msg.sender === 'user' ? 'background.default' : 'text.primary',
                                            border: msg.sender === 'user' ? 'none' : '1px solid rgba(100, 255, 218, 0.08)',
                                            boxShadow: msg.sender === 'user' ? '0 4px 15px rgba(100, 255, 218, 0.2)' : 'none',
                                        }}>
                                            <Typography variant="body2" sx={{ whiteSpace: 'pre-line', fontWeight: msg.sender === 'user' ? 600 : 400, lineHeight: 1.5 }}>
                                                {msg.text}
                                            </Typography>
                                        </Box>
                                    </Box>
                                ))}
                                <div ref={chatEndRef} />
                            </Box>

                            {/* Quick Suggestions */}
                            <Box sx={{ px: 2, pb: 1, pt: 0.5, borderTop: '1px solid rgba(100, 255, 218, 0.05)', bgcolor: 'rgba(2, 12, 27, 0.2)' }}>
                                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
                                    Quick Questions:
                                </Typography>
                                <Box sx={{ 
                                    display: 'flex', 
                                    gap: 1.5, 
                                    overflowX: 'auto', 
                                    pb: 1,
                                    width: '100%',
                                    '&::-webkit-scrollbar': { height: 4 },
                                    '&::-webkit-scrollbar-thumb': {
                                        background: 'rgba(100, 255, 218, 0.2)',
                                        borderRadius: 2
                                    }
                                }}>
                                    {quickOptions.map((opt) => (
                                        <Button
                                            key={opt.value}
                                            variant="outlined"
                                            size="small"
                                            onClick={() => handleSend(opt.label)}
                                            sx={{
                                                fontSize: '0.75rem',
                                                py: 0.5,
                                                px: 1.5,
                                                whiteSpace: 'nowrap',
                                                flexShrink: 0,
                                                borderColor: 'rgba(100, 255, 218, 0.2)',
                                                color: 'secondary.main',
                                                borderRadius: 2,
                                                textTransform: 'none',
                                                '&:hover': {
                                                    borderColor: '#64ffda',
                                                    bgcolor: 'rgba(100, 255, 218, 0.05)'
                                                }
                                            }}
                                        >
                                            {opt.label.replace('?', '')}
                                        </Button>
                                    ))}
                                </Box>
                            </Box>

                            {/* Input Area */}
                            <Box sx={{ p: 1.5, borderTop: '1px solid rgba(100, 255, 218, 0.1)', bgcolor: 'rgba(10, 25, 47, 0.9)' }}>
                                <Stack direction="row" spacing={1}>
                                    <TextField
                                        placeholder="Type your question..."
                                        size="small"
                                        fullWidth
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter') handleSend(input);
                                        }}
                                        sx={{
                                            '& .MuiInputBase-input': { color: '#e6f1ff', fontSize: '0.875rem' },
                                            '& .MuiOutlinedInput-root': {
                                                bgcolor: 'rgba(2, 12, 27, 0.4)',
                                                borderRadius: 2,
                                                '& fieldset': { borderColor: 'rgba(100, 255, 218, 0.15)' },
                                                '&:hover fieldset': { borderColor: 'rgba(100, 255, 218, 0.3)' },
                                                '&.Mui-focused fieldset': { borderColor: 'secondary.main' }
                                            }
                                        }}
                                    />
                                    <IconButton
                                        color="secondary"
                                        onClick={() => handleSend(input)}
                                        disabled={!input.trim()}
                                        sx={{
                                            bgcolor: 'secondary.main',
                                            color: 'background.default',
                                            borderRadius: 2,
                                            p: 1,
                                            '&:hover': { bgcolor: 'secondary.dark' },
                                            '&.Mui-disabled': { bgcolor: 'rgba(100, 255, 218, 0.1)', color: 'rgba(255, 255, 255, 0.3)' }
                                        }}
                                    >
                                        <SendIcon fontSize="small" />
                                    </IconButton>
                                </Stack>
                            </Box>
                        </Paper>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Bubble Button */}
            <motion.div
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
            >
                <IconButton
                    onClick={handleToggle}
                    sx={{
                        width: 60,
                        height: 60,
                        bgcolor: 'secondary.main',
                        color: 'background.default',
                        boxShadow: '0 8px 30px rgba(100, 255, 218, 0.35), 0 0 15px rgba(100, 255, 218, 0.1)',
                        '&:hover': {
                            bgcolor: 'secondary.dark',
                            boxShadow: '0 12px 35px rgba(100, 255, 218, 0.5)'
                        }
                    }}
                >
                    <Badge color="error" variant="dot" invisible={!hasUnread || isOpen}>
                        {isOpen ? <CloseIcon fontSize="medium" /> : <ChatIcon fontSize="medium" />}
                    </Badge>
                </IconButton>
            </motion.div>
        </Box>
    );
};

export default Chatbot;
