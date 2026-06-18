import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#0a192f', // Deep Blue
            light: '#172a45',
            dark: '#020c1b',
            contrastText: '#64ffda', // Cyan accent
        },
        secondary: {
            main: '#64ffda', // Cyan
            light: '#b1f9eb',
            dark: '#45b29a',
        },
        background: {
            default: '#020c1b',
            paper: '#0a192f',
        },
        text: {
            primary: '#e6f1ff',
            secondary: '#8892b0',
        },
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h1: { fontSize: '2.5rem', fontWeight: 700 },
        h2: { fontSize: '2rem', fontWeight: 600 },
        h3: { fontSize: '1.75rem', fontWeight: 600 },
        button: { textTransform: 'none', fontWeight: 600 },
    },
    shape: {
        borderRadius: 12,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    padding: '10px 24px',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 20px rgba(100, 255, 218, 0.2)',
                    },
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                    border: '1px solid rgba(100, 255, 218, 0.1)',
                },
            },
        },
    },
});

export default theme;
