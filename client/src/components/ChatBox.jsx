import React, { useState, useEffect, useRef } from 'react';
import { Box, Paper, TextField, IconButton, Stack, Typography, Avatar } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import io from 'socket.io-client';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const ChatBox = ({ complaintId }) => {
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const socketRef = useRef();
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        // Fetch message history
        const fetchMessages = async () => {
            try {
                const { data } = await axios.get(`/api/messages/${complaintId}`);
                setMessages(data);
            } catch (error) {
                console.error('Error fetching chat history:', error);
            }
        };
        fetchMessages();

        // Socket setup
        const socketUrl = import.meta.env.VITE_API_URL || '/';
        socketRef.current = io(socketUrl, { path: '/socket.io' }); // Assumes proxy or same host
        socketRef.current.emit('joinRoom', { complaintId });

        socketRef.current.on('message', (message) => {
            setMessages((prev) => [...prev, message]);
        });

        return () => socketRef.current.disconnect();
    }, [complaintId]);

    useEffect(scrollToBottom, [messages]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        socketRef.current.emit('chatMessage', {
            complaintId,
            senderId: user._id,
            senderRole: user.role,
            message: newMessage
        });

        setNewMessage('');
    };

    return (
        <Paper sx={{ height: 500, display: 'flex', flexDirection: 'column', bgcolor: 'background.paper' }}>
            <Box sx={{ p: 2, borderBottom: '1px solid rgba(100, 255, 218, 0.1)' }}>
                <Typography variant="h6">Complaint Chat</Typography>
            </Box>

            <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 3 }}>
                <Stack spacing={2}>
                    {messages.map((msg, i) => (
                        <Box 
                            key={i} 
                            sx={{ 
                                alignSelf: msg.senderId?._id === user._id || msg.senderId === user._id ? 'flex-end' : 'flex-start',
                                maxWidth: '80%'
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5, justifyContent: (msg.senderId?._id === user._id || msg.senderId === user._id) ? 'flex-end' : 'flex-start' }}>
                                <Typography variant="caption" color="text.secondary">
                                    {msg.senderId?.name || (msg.senderId === user._id ? user.name : 'Agent')}
                                </Typography>
                            </Box>
                            <Paper 
                                sx={{ 
                                    p: 1.5, 
                                    bgcolor: (msg.senderId?._id === user._id || msg.senderId === user._id) ? 'secondary.main' : 'primary.light',
                                    color: (msg.senderId?._id === user._id || msg.senderId === user._id) ? 'background.default' : 'text.primary',
                                    borderRadius: 2
                                }}
                            >
                                <Typography variant="body2">{msg.message}</Typography>
                            </Paper>
                        </Box>
                    ))}
                    <div ref={messagesEndRef} />
                </Stack>
            </Box>

            <Box sx={{ p: 2, borderTop: '1px solid rgba(100, 255, 218, 0.1)' }}>
                <form onSubmit={handleSendMessage}>
                    <Stack direction="row" spacing={1}>
                        <TextField
                            fullWidth
                            size="small"
                            placeholder="Type a message..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            sx={{ bgcolor: 'primary.dark' }}
                        />
                        <IconButton type="submit" color="secondary">
                            <SendIcon />
                        </IconButton>
                    </Stack>
                </form>
            </Box>
        </Paper>
    );
};

export default ChatBox;
