import * as React from 'react';
import { useState } from 'react';
import axios from 'axios';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddProductPage: React.FC = () => {
    const [productCode, setProductCode] = useState<string>('');
    const [productName, setProductName] = useState<string>('');
    const [productPrice, setProductPrice] = useState<number | ''>('');

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

    const handleAddProduct = async () => {
        try {
            await axios.post('/product', {
                productCode,
                productName,
                productPrice,
            });
            console.log('Product added successfully');
            toast.success('Produk berhasil ditambahkan.', { autoClose: 3000 })
            setProductCode('')
            setProductName('')
            setProductPrice('')
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
                <Button variant="contained" color="primary" onClick={handleAddProduct}  sx={{ marginLeft: 'auto', p: 2, marginTop: 2, display: 'block', width: '100%'}}>
                    Tambah
                </Button>
            </Box>
            <ToastContainer/>
        </>
    );
};

export default AddProductPage;