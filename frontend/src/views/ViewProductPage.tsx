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

    const [originalData, setOriginalData] = useState({ productCode: '', productName: '', productPrice: 0, productImage: '' });
    const [productCode, setProductCode] = useState<string>('');
    const [productName, setProductName] = useState<string>('');
    const [productPrice, setProductPrice] = useState<number>(0);
    const [productImage, setProductImage] = useState<string>('');
    const [image, setNewImage] = useState<File | null>(null);
    const [tempImage, setTempImage] = useState<string>('');

    const [loading, setLoading] = useState<boolean>(false)
    const [changesDetected, setChangesDetected] = useState<boolean>(false);
    const [imageChangesDetected, setImageChangesDetected] = useState<boolean>(false);
    const [openConfirmationModal, setOpenConfirmationModal] = useState<boolean>(false);
    const [openChangeProductionModal, setOpenChangeProductionModal] = useState<boolean>(false);

    const [rerenderKey, setRerenderKey] = useState<number>(0);
    const [rerenderInput, setRerenderInput] = useState<number>(0);

    const navigate = useNavigate();

    const imageBaseUrl = `https://storage.googleapis.com/${import.meta.env.VITE_BUCKET_NAME}/`

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`/product/${productId}`);
                setProductCode(response.data.product.productCode);
                setProductName(response.data.product.productName);
                setProductPrice(response.data.product.productPrice)
                setProductImage(response.data.product.productImage);
                setOriginalData({
                    productCode: response.data.product.productCode,
                    productName: response.data.product.productName,
                    productPrice: response.data.product.productPrice,
                    productImage: response.data.product.productImage,
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

    const handleNewImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files && event.target.files[0];
        setNewImage(file);
        setImageChangesDetected(true);

        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const imagePreviewUrl = e.target?.result as string;
                setTempImage(imagePreviewUrl);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCancelImageChange = () => {
        setNewImage(null)
        setImageChangesDetected(false);
        setTempImage('');
        setRerenderInput((prev) => prev + 1)
    };

    const handleUpdateProduct = async () => {
        if (changesDetected) {
            setOpenConfirmationModal(true)
            return;
        }
        await updateProduct()
    };

    const handleProduction = async () => {
        setOpenChangeProductionModal(true)
    };

    const updateProduct = async () => {
        try {
            setLoading(true);
            const formData = new FormData()
            formData.append('productCode', productCode);
            formData.append('productName', productName);
            formData.append('productPrice', String(productPrice));
            formData.append('productImage', productImage)

            if (image) {
                formData.append('image', image);
            }


            const checkResponse = await axios.get(`/product/check/${productCode}`);
            if (checkResponse.data.exists && productId !== checkResponse.data._id) {
                toast.error('Produk dengan kode yang sama sudah ada.', { autoClose: 3000 });
                return;
            }

            await axios.put(`/product/${productId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('Product updated successfully');
            toast.success('Produk berhasil diperbarui.', { autoClose: 3000 })
            setProductCode(productCode)
            setProductName(productName)
            setProductPrice(productPrice)
            setImageChangesDetected(false)
            setChangesDetected(false)
            setTempImage('')
            setRerenderKey((prev) => prev + 1)
            setOriginalData({ productCode: productCode, productName: productName, productPrice: productPrice, productImage: productImage })
        } catch (error) {
            console.error('Error updating product:', error);
            toast.error('Produk gagal diperbarui.', { autoClose: 3000 })
        } finally {
            setLoading(false);
        }
    };

    const changeProduction = async () => {
        try {
            setLoading(true);
            await axios.put(`/product/${productId}/production`);
            console.log('Product is not on production.');
            toast.success('Produk sudah tidak diedar.', { autoClose: 3000, onClose: () => { navigate('/daftar-produk') } })
        } catch (error) {
            console.error('Error updating product:', error);
            toast.error('Produk gagal diperbarui.', { autoClose: 3000 })
        } finally {
            setLoading(false);
        }
    }

    const handleCloseConfirmationModal = () => {
        setOpenConfirmationModal(false);
    };

    const handleConfirmUpdate = () => {
        updateProduct();
        setOpenConfirmationModal(false);
    };

    const handleCloseChangeProductionModal = () => {
        setOpenChangeProductionModal(false);
    };

    const handleChangeProductionUpdate = () => {
        changeProduction();
        setOpenChangeProductionModal(false);
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
            <Box
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    flexDirection: 'column',
                }}
            >
                {productImage && (
                    <div key={rerenderKey} style={{ flex: '0 0 200px', marginBottom: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <img
                            src={tempImage !== '' ? tempImage : (imageBaseUrl + productImage)}
                            alt="Product"
                            style={{
                                width: '300px',
                                height: '300px',
                                objectFit: 'cover',
                                borderRadius: '16px'
                            }}
                        />
                        <input
                            key={rerenderInput}
                            type="file"
                            accept="image/*"
                            onChange={handleNewImageChange}
                            style={{ display: 'none' }}
                            id="image-input"
                        />
                        <label htmlFor="image-input">
                            <Button
                                variant="text"
                                color="primary"
                                component="span"
                                sx={{ textAlign: 'center', display: 'block', width: '300px' }}
                            >
                                Ganti Gambar
                            </Button>
                        </label>
                        {imageChangesDetected && (
                            <Button
                                variant="text"
                                color="error"
                                onClick={handleCancelImageChange}
                                sx={{ textAlign: 'center', display: 'block', width: '300px' }}
                            >
                                Batal
                            </Button>
                        )}
                    </div>

                )}
                <div style={{ flex: '1', width: '100%', maxWidth: '600px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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
                    <Button
                        disabled={loading || (!imageChangesDetected && (originalData.productCode === productCode) && (originalData.productName === productName) && (originalData.productPrice === productPrice))}
                        variant="contained"
                        color="secondary"
                        onClick={handleUpdateProduct}
                        sx={{ marginTop: 2, p: 2, display: 'block', width: '100%' }}
                    >
                        Perbarui Produk
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={handleProduction}
                        sx={{ marginTop: 2, p: 2, display: 'block', width: '100%' }}
                    >
                        Hapus Produk
                    </Button>
                </div>
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
            <Dialog open={openChangeProductionModal} onClose={handleCloseChangeProductionModal}>
                <DialogTitle>Perubahan Terdeteksi</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Apakah Anda yakin ingin menghapus produk? Perubahan yang disimpan tidak bisa dibatalkan!
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseChangeProductionModal} color="warning">
                        Batal
                    </Button>
                    <Button onClick={handleChangeProductionUpdate} color="primary">
                        Konfirmasi
                    </Button>
                </DialogActions>
            </Dialog>
            <ToastContainer />
        </>
    );
};

export default ViewProductPage;