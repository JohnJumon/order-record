import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useParams } from 'react-router-dom';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const ViewAdminPage: React.FC = () => {
    const { adminId } = useParams();
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [wantChange, setWantChange] = useState<boolean>(false)
    const [confirmation, setConfirmation] = useState('')
    const [loading, setLoading] = useState<boolean>(false)
    const [originalUsername, setOriginalUsername] = useState('')
    const [openConfirmationModal, setOpenConfirmationModal] = useState<boolean>(false)

    useEffect(() => {
        const fetchAdmin = async () => {
            try {
                const response = await axios.get(`/admin/${adminId}`);
                setUsername(response.data.admin.username)
                setOriginalUsername(response.data.admin.username)

            } catch (error) {
                console.error('Error fetching admin:', error);
            }
        };

        fetchAdmin()
    }, [adminId])


    const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(event.target.value);
    };

    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    };

    const handleConfirmationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setConfirmation(event.target.value);
    };

    const handleCloseConfirmationModal = () => {
        setOpenConfirmationModal(false);
    };

    const handleConfirmUpdate = () => {
        updateAdmin();
        setOpenConfirmationModal(false);
    };

    const updateAdmin = async () => {
        try {
            setLoading(true);
            const checkResponse = await axios.get(`/admin/check/${username}`);
            if (checkResponse.data.exists && adminId !== checkResponse.data._id) {
                toast.error('Admin dengan username yang sama sudah ada.', { autoClose: 3000 });
                return;
            }

            if (wantChange) {
                if (password !== confirmation) {
                    toast.error('Password dan Konfirmasi Password tidak sama. Silahkan input ulang!')
                }
                else {
                    await axios.put(`/admin/${adminId}`, {
                        username: username,
                        password: password,
                        wantChange: true
                    });
                    console.log('Admin updated successfully');
                    toast.success('Admin berhasil diperbarui.', { autoClose: 3000 })
                }
            }
            else {
                await axios.put(`/admin/${adminId}`, {
                    username: username,
                    wantChange: false
                });
                console.log('Admin updated successfully');
                toast.success('Admin berhasil diperbarui.', { autoClose: 3000 })
            }
            setOriginalUsername(username)
            setWantChange(false)
            setPassword('')
            setConfirmation('')
        } catch (error) {
            console.error('Error updating admin:', error);
            toast.error('Admin gagal diperbarui.', { autoClose: 3000 })
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateAdmin = async () => {
        setOpenConfirmationModal(true)
    };
    return (
        <>
            <Typography variant="h6" noWrap component="div">
                Lihat dan Perbarui Data Admin
            </Typography>
            <Box>
                <TextField
                    label="Username"
                    value={username}
                    onChange={handleUsernameChange}
                    fullWidth
                    margin="normal"
                />
                <Button
                    variant="contained"
                    onClick={() => { setWantChange(wantChange ? false : true) }}
                    color="warning"
                    sx={{ marginLeft: 'auto', p: 2, my: 2, display: 'block', width: '100%' }}
                >
                    {wantChange ? "Batal" : "Ganti Password"}
                </Button>
                {wantChange && (
                    <>
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
                    </>
                )}
                <Button
                    disabled={loading || (originalUsername === username && password === '' && confirmation === '')}
                    variant="contained"
                    onClick={handleUpdateAdmin}
                    color="primary"
                    sx={{ marginLeft: 'auto', p: 2, marginTop: 2, display: 'block', width: '100%' }}
                >
                    Perbarui Data Admin
                </Button>
            </Box>
            <Dialog open={openConfirmationModal} onClose={handleCloseConfirmationModal}>
                <DialogTitle>Perubahan Terdeteksi</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Apakah Anda yakin ingin menyimpan perubahan?
                    </DialogContentText>
                    {originalUsername !== username && (
                        <>
                            <Typography sx={{ fontWeight: 500 }}>
                                Username
                            </Typography>
                            <DialogContentText style={{ display: 'flex', alignItems: 'center' }}>
                                {originalUsername} <ChevronRightIcon /> {username}
                            </DialogContentText>
                        </>

                    )}
                    {wantChange && password !== '' && (
                        <>
                            <Typography sx={{ fontWeight: 500 }}>
                                Ganti Password
                            </Typography>
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseConfirmationModal} color="warning">
                        Batal
                    </Button>
                    <Button onClick={handleConfirmUpdate} color="primary">
                        Simpan
                    </Button>
                </DialogActions>
            </Dialog>
            <ToastContainer />
        </>
    );
};

export default ViewAdminPage;