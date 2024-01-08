import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import authStore from '../stores/authStore';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';

const defaultTheme = createTheme();

export default function LoginPage() {
    const store = authStore();
    const navigate = useNavigate();

    const handleLogin = async () => {
        const loginResult = await store.login();
        if (loginResult) {
            navigate('/tambah-produk');
        }
        else{
            toast.error('Username atau Password anda salah!')
        }

    }

    React.useEffect(() => {
        store.logout();
    }, []);
    return (
        <ThemeProvider theme={defaultTheme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100vh',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Login
                    </Typography>
                    <Box component="form" noValidate sx={{ mt: 1 }}>
                        <TextField
                            name='username'
                            margin="normal"
                            required
                            fullWidth
                            id="username"
                            label="Username"
                            type='text'
                            autoFocus
                            onChange={(e) => store.updateUsername(e.target.value)}
                            autoComplete='username'
                        />
                        <TextField
                            name='password'
                            margin="normal"
                            required
                            fullWidth
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete='current-password'
                            onChange={(e) => store.updatePassword(e.target.value)}
                        />
                        <Button
                            fullWidth
                            variant="contained"
                            onClick={handleLogin}
                            sx={{ my: 2, p: 2 }}
                        >
                            Login
                        </Button>
                    </Box>
                </Box>
            </Container>
            <ToastContainer/>
        </ThemeProvider>
    );
}