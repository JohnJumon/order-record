import * as React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useParams } from 'react-router-dom';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { useNavigate } from 'react-router-dom';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const ViewProductPage: React.FC = () => {
    const { productId } = useParams()

    const [originalData, setOriginalData] = useState({ productCode: '', productName: '', productPrice: 0 });
    const [productCode, setProductCode] = useState<string>('');
    const [productName, setProductName] = useState<string>('');
    const [productPrice, setProductPrice] = useState<number>(0);

    const [loading, setLoading] = useState<boolean>(false)
    const [changesDetected, setChangesDetected] = useState<boolean>(false);
    const [openConfirmationModal, setOpenConfirmationModal] = useState<boolean>(false);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`/product/${productId}`);
                setProductCode(response.data.product.productCode);
                setProductName(response.data.product.productName);
                setProductPrice(response.data.product.productPrice)
                setOriginalData({
                    productCode: response.data.product.productCode,
                    productName: response.data.product.productName,
                    productPrice: response.data.product.productPrice,
                })
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProduct()
    }, [productId])

    const handleProductCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setProductCode(event.target.value);
        setChangesDetected(true)
    };

    const handleProductNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setProductName(event.target.value);
        setChangesDetected(true)
    };

    const handleProductPriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue: number = event.target.value === '' ? 0 : parseFloat(event.target.value);
        setProductPrice(newValue);
        setChangesDetected(true)
    };

    const handleUpdateProduct = async () => {
        if(changesDetected){
            setOpenConfirmationModal(true)
            return;
        }
        await updateCustomer()
    };

    const updateCustomer = async () => {
        try {
            setLoading(true);

            const checkResponse = await axios.get(`/product/check/${productCode}`);
            if (checkResponse.data.exists && productId !== checkResponse.data._id) {
                toast.error('Produk dengan kode yang sama sudah ada.', { autoClose: 3000 });
                return;
            }

            await axios.put(`/product/${productId}`, {
                productCode: productCode,
                productName: productName,
                productPrice: productPrice,
            });
            console.log('Product updated successfully');
            toast.success('Produk berhasil diperbarui.', { autoClose: 3000 })
            setProductCode(productCode)
            setProductName(productName)
            setProductPrice(productPrice)
            setOriginalData({productCode: productCode, productName: productName, productPrice: productPrice})
        } catch (error) {
            console.error('Error updating product:', error);
            toast.error('Produk gagal diperbarui.', { autoClose: 3000 })
        } finally {
            setLoading(false);
        }
    };

    const handleCloseConfirmationModal = () => {
        setOpenConfirmationModal(false);
    };

    const handleConfirmUpdate = () => {
        updateCustomer();
        setOpenConfirmationModal(false);
    };

    return (
        <>
            <Typography variant="h6" noWrap component="div" style={{ display: 'flex', alignItems: 'center' }}>
                <Tooltip title="Kembali">
                    <IconButton onClick={() => { navigate(-1) }}>
                        <ArrowBackIosIcon />
                    </IconButton>
                </Tooltip>
                Lihat dan Perbarui Produk
            </Typography>
            <Box>
                <TextField
                    label="Kode Produk"
                    value={productCode}
                    onChange={handleProductCodeChange}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Nama Produk"
                    value={productName}
                    onChange={handleProductNameChange}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Harga Produk"
                    type="number"
                    value={productPrice}
                    onChange={handleProductPriceChange}
                    fullWidth
                    margin="normal"
                />
                <Button disabled={loading || 
                    ((originalData.productCode === productCode) &&
                    (originalData.productName === productName) &&
                    (originalData.productPrice === productPrice))
                } variant="contained" color="secondary" onClick={handleUpdateProduct} sx={{ marginLeft: 'auto', p: 2, marginTop: 2, display: 'block', width: '100%' }}>
                    Perbarui Produk
                </Button>
            </Box>
            <Dialog open={openConfirmationModal} onClose={handleCloseConfirmationModal}>
                <DialogTitle>Perubahan Terdeteksi</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Apakah Anda yakin ingin menyimpan perubahan?
                    </DialogContentText>
                    {originalData.productCode !== productCode && (
                        <>
                            <Typography sx={{ fontWeight: 500 }}>
                                Kode Produk
                            </Typography>
                            <DialogContentText style={{ display: 'flex', alignItems: 'center' }}>
                                {originalData.productCode} <ChevronRightIcon /> {productCode}
                            </DialogContentText>
                        </>

                    )}
                    {originalData.productName !== productName && (
                        <>
                            <Typography sx={{ fontWeight: 500 }}>
                                Nama Produk
                            </Typography>
                            <DialogContentText style={{ display: 'flex', alignItems: 'center' }}>
                                {originalData.productName} <ChevronRightIcon /> {productName}
                            </DialogContentText>
                        </>
                    )}
                    {originalData.productPrice !== productPrice && (
                        <>
                            <Typography sx={{ fontWeight: 500 }}>
                                Harga Produk
                            </Typography>
                            <DialogContentText style={{ display: 'flex', alignItems: 'center' }}>
                                {originalData.productPrice} <ChevronRightIcon /> {productPrice}
                            </DialogContentText>
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

export default ViewProductPage;