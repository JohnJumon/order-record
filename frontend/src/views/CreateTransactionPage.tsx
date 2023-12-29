import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Autocomplete from '@mui/material/Autocomplete';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Product {
    _id: string;
    productCode: string;
    productName: string;
    productPrice: number;
}

interface Customer {
    _id: string;
    phoneNumber: string;
    customerName: string;
}

interface SelectedProduct {
    product: Product;
    quantity: number;
}

const CreateTransactionPage: React.FC = () => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [customer, setCustomer] = useState<Customer | null>(null);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [customerName, setCustomerName] = useState('');
    const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [quantity, setQuantity] = useState<number | ''>('');
    const [orderCreated, setOrderCreated] = useState<boolean>(true)
    const [rerenderKey, setRerenderKey] = useState<number>(0);

    useEffect(() => {
        if (orderCreated) {
            const fetchCustomers = async () => {
                try {
                    const response = await axios.get('/customer');
                    setCustomers(response.data.customers);
                } catch (error) {
                    console.error('Error fetching customers:', error);
                }
            };

            const fetchProducts = async () => {
                try {
                    const response = await axios.get('/product');
                    setProducts(response.data.products);
                } catch (error) {
                    console.error('Error fetching products:', error);
                }
            };

            fetchCustomers();
            fetchProducts();
            setOrderCreated(false);
        }
    }, [orderCreated]);

    const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue: number | '' = event.target.value === '' ? '' : parseInt(event.target.value, 10);
        setQuantity(newValue);
    };

    const handlePhoneNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPhoneNumber(event.target.value);
        setCustomer(null);
    };

    const handleCustomerNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCustomerName(event.target.value);
    };

    const handleAddProduct = () => {
        if (selectedProduct && quantity !== '' && quantity > 0) {
            const isNewProduct = !selectedProducts.some(
                (p) => p.product._id === selectedProduct._id
            );

            if (isNewProduct) {
                const newSelectedProduct: SelectedProduct = {
                    product: selectedProduct,
                    quantity: quantity as number,
                };

                setSelectedProducts([...selectedProducts, newSelectedProduct]);
                setSelectedProduct(null);
                setQuantity('');
            } else {
                toast.error('Produk sudah dimasukan, jika ada kesalahan mohon dihapus kembali.');
            }
        }
    };

    const handleDeleteProduct = (index: number) => {
        const updatedProducts = [...selectedProducts];
        updatedProducts.splice(index, 1);
        setSelectedProducts(updatedProducts);
    };

    const handleCreateTransaction = async () => {
        let toastText = '';
        try {
            let customerId = '';
            if (!customer && customerName && phoneNumber) {
                const customerResponse = await axios.post('/customer', {
                    customerName: customerName,
                    phoneNumber: phoneNumber,
                });
                const newCustomer: Customer = customerResponse.data.customer;
                setCustomer(newCustomer);
                customerId = newCustomer._id;
                toastText = 'Data Pelanggan & '
            } else if (customer) {
                customerId = customer._id;
            }

            const response = await axios.post('/order', {
                customer: customerId,
                items: selectedProducts.map((selectedProduct) => ({
                    product: selectedProduct.product._id,
                    quantity: selectedProduct.quantity,
                    productPrice: selectedProduct.product.productPrice,
                    productName: selectedProduct.product.productName,
                    productCode: selectedProduct.product.productCode,
                })),
            });

            console.log('Transaction created successfully:', response.data);
            toast.success(toastText + 'Transaksi berhasil dibuat.', { autoClose: 3000 });
            setOrderCreated(true);
            setRerenderKey((prevKey) => prevKey + 1);
            setPhoneNumber('');
            setCustomer(null);
            setCustomerName('');
            setSelectedProducts([]);
            setSelectedProduct(null);
            setQuantity('');
        } catch (error) {
            console.error('Error creating transaction:', error);
            toast.error(toastText + 'Transaksi gagal dibuat.', { autoClose: 3000 });
        }
    };

    return (
        <>
            <Typography variant="h6" noWrap component="div">
                Buat Transaksi
            </Typography>
            <Box key={rerenderKey}>
                <Autocomplete
                    options={customers}
                    getOptionLabel={(option) => (typeof option === 'string' ? option : option.phoneNumber || '')}
                    renderOption={(props, option) => (
                        <li {...props}>
                            <div>{option.phoneNumber}</div>
                            <div style={{ marginLeft: '8px' }}>{option.customerName}</div>
                        </li>
                    )}
                    renderInput={(params) => (
                        <TextField {...params} label="Nomor Telepon" onChange={handlePhoneNumberChange} margin='normal' />
                    )}
                    onChange={(_, newValue) => setCustomer(newValue as Customer | null)}
                    freeSolo
                />
                {customer ? (
                    <TextField
                        label="Nama Konsumen"
                        value={customer.customerName}
                        fullWidth
                        margin="normal"
                        disabled
                    />
                ) : (
                    <TextField
                        label="Nama Konsumen"
                        value={customerName}
                        onChange={handleCustomerNameChange}
                        fullWidth
                        margin="normal"
                    />
                )}
                <Autocomplete
                    options={products}
                    getOptionLabel={(option) => option.productCode}
                    renderOption={(props, option) => (
                        <li {...props}>
                            <div>{option.productCode}</div>
                            <div style={{ marginLeft: '8px' }}>{option.productName}</div>
                        </li>
                    )}
                    onChange={(_, newValue) => setSelectedProduct(newValue)}
                    renderInput={(params) => <TextField {...params} label="Kode Produk" margin="normal" />}
                />
                {selectedProduct && (
                    <>
                        <TextField
                            label="Jumlah"
                            type="number"
                            value={quantity === '' ? '' : quantity.toString()}
                            onChange={handleQuantityChange}
                            fullWidth
                            margin="normal"
                        />
                        <Button
                            variant="outlined"
                            color="primary"
                            onClick={handleAddProduct}
                            sx={{ marginLeft: 'auto', p: 2, marginTop: 2, display: 'block' }}
                        >
                            Tambah Produk
                        </Button>
                    </>
                )}
                {selectedProducts.length > 0 && (
                    <>
                        <Typography variant="h6" noWrap component="div" sx={{ marginTop: 2 }}>
                            Daftar Produk Dipesan
                        </Typography>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Kode Produk</TableCell>
                                        <TableCell>Nama Produk</TableCell>
                                        <TableCell align='right'>Jumlah</TableCell>
                                        <TableCell align='right'>Harga/Jumlah</TableCell>
                                        <TableCell align='center'>Aksi</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {selectedProducts.map((selectedProduct, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{selectedProduct.product.productCode}</TableCell>
                                            <TableCell>{selectedProduct.product.productName}</TableCell>
                                            <TableCell align="right">{selectedProduct.quantity}</TableCell>
                                            <TableCell align='right'>{selectedProduct.product.productPrice}</TableCell>
                                            <TableCell align='center'>
                                                <Tooltip title='Hapus'>
                                                    <IconButton color="error" onClick={() => handleDeleteProduct(index)}>
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </>
                )}
                {selectedProducts.length > 0 && (
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleCreateTransaction}
                        sx={{ marginLeft: 'auto', p: 2, marginTop: 2, display: 'block', width: '100%' }}
                    >
                        Buat Transaksi
                    </Button>
                )}
            </Box>
            <ToastContainer />
        </>
    );
};

export default CreateTransactionPage;
