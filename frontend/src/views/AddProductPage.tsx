import * as React from 'react';
import { useState } from 'react';
import axios from 'axios';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import imgPlaceholder from '../assets/imgPlaceholder.jpg'

const AddProductPage: React.FC = () => {
    const [productCode, setProductCode] = useState<string>('');
    const [productName, setProductName] = useState<string>('');
    const [productPrice, setProductPrice] = useState<number | ''>('');
    const [image, setImage] = useState<File | null>(null);
    const [tempImage, setTempImage] = useState<string>('')
    const [rerenderKey, setRerenderKey] = useState<number>(0);

    const handleProductCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setProductCode(event.target.value);
    };

    const handleProductNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setProductName(event.target.value);
    };

    const handleProductPriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue: number | '' = event.target.value === '' ? '' : parseFloat(event.target.value);
        setProductPrice(newValue);
    };

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files && event.target.files[0]
        if (file) {
            setImage(file);
            const reader = new FileReader();
            reader.onload = (e) => {
                const imagePreviewUrl = e.target?.result as string;
                setTempImage(imagePreviewUrl);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCancelImageChange = () => {
        setImage(null)
        setTempImage('')
        setRerenderKey((prev) => prev + 1)
    };

    const handleAddProduct = async () => {
        try {
            const formData = new FormData();
            formData.append('productCode', productCode.toUpperCase());
            formData.append('productName', productName);
            formData.append('productPrice', String(productPrice));
            if (image) {
                formData.append('image', image);
            }
            await axios.post('/product', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('Product added successfully');
            toast.success('Produk berhasil ditambahkan.', { autoClose: 3000 })
            setProductCode('')
            setProductName('')
            setProductPrice('')
            setImage(null)
            setTempImage('')
        } catch (error) {
            console.error('Error adding product:', error);
            toast.error('Produk gagal ditambahkan.', { autoClose: 3000 })
        }
    };

    return (
        <>
            <Typography variant="h6" noWrap component="div">
                Tambah Produk
            </Typography>
            <Box
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    flexDirection: 'column',
                }}
            >
                <div style={{ flex: '0 0 200px', marginBottom: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <img
                        src={tempImage !== '' ? tempImage : imgPlaceholder}
                        alt="Product"
                        style={{
                            width: '300px',
                            height: '300px',
                            objectFit: 'cover',
                            borderRadius: '16px'
                        }}
                    />
                    <input
                        key={rerenderKey}
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
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
                            Masukan Gambar
                        </Button>
                    </label>
                    {image && (
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
                    <Button variant="contained" color="primary" onClick={handleAddProduct} sx={{ marginLeft: 'auto', p: 2, marginTop: 2, display: 'block', width: '100%' }}>
                        Tambah Produk
                    </Button>
                </div>
            </Box>
            <ToastContainer />
        </>
    );
};

export default AddProductPage;