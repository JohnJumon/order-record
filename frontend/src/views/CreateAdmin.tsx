import React, { useState } from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreateAdmin: React.FC = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [confirmation, setConfirmation] = useState('')
    const [loading, setLoading] = useState<boolean>(false)


    const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(event.target.value);
    };

    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    };

    const handleConfirmationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setConfirmation(event.target.value);
    };

    const handleCreateAdmin = async () => {
        try {
            setLoading(true)
            if (password !== confirmation) {
                toast.error('Password dan Konfirmasi Password tidak sama. Silahkan input ulang!')
            }
            else {
                const response = await axios.post('/admin', {
                    username: username,
                    password: password
                });

                console.log('Admin created successfully:', response.data);
                toast.success('Admin berhasil ditambahkan.', { autoClose: 3000 });
                setUsername('')
                setPassword('')
                setConfirmation('')
            }

        } catch (error) {
            console.error('Error creating admin:', error);
            toast.error('Admin gagal ditambahkan.', { autoClose: 3000 });
        } finally {
            setLoading(false)
        }
    };
    return (
        <>
            <Typography variant="h6" noWrap component="div">
                Tambah Admin
            </Typography>
            <Box>
                <TextField
                    label="Username"
                    value={username}
                    onChange={handleUsernameChange}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Password"
                    onChange={handlePasswordChange}
                    value={password}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Konfirmasi Password"
                    onChange={handleConfirmationChange}
                    value={confirmation}
                    fullWidth
                    margin="normal"
                />
                <Button
                    disabled={loading}
                    variant="contained"
                    onClick={handleCreateAdmin}
                    color="primary"
                    sx={{ marginLeft: 'auto', p: 2, marginTop: 2, display: 'block', width: '100%' }}
                >
                    Tambah Admin
                </Button>
            </Box>
            <ToastContainer />
        </>
    );
};

export default CreateAdmin;