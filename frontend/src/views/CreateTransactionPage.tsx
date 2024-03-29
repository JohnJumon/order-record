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
import { LightTooltip } from './TransactionPage';
import PreviewIcon from '@mui/icons-material/Preview';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Select from '@mui/material/Select';

interface Product {
    _id: string;
    productCode: string;
    productName: string;
    productPrice: number;
    productImage: string;
    production: boolean;
}

interface Customer {
    _id: string;
    phoneNumber: string;
    customerName: string;
    blacklist: boolean;
}

interface SelectedProduct {
    product: Product;
    quantity: number;
    size: string;
    color: string;
    description: string;
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
    const [loading, setLoading] = useState<boolean>(false);
    const [paidOff, setPaidOff] = useState<number>(0);
    const [deposit, setDeposit] = useState<number | ''>('')
    const [color, setColor] = useState('');
    const [size, setSize] = useState('');
    const [description, setDescription] = useState('');

    const imageBaseUrl = `https://storage.googleapis.com/${import.meta.env.VITE_BUCKET_NAME}/`

    useEffect(() => {
        if (orderCreated) {
            const fetchCustomers = async () => {
                try {
                    const response = await axios.get('/customer');
                    setCustomers(response.data.customers);
                    console.log(response.data.customers);
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

    const handleDepositChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue: number | '' = event.target.value === '' ? '' : parseInt(event.target.value, 10);
        setDeposit(newValue);
    };

    const handlePhoneNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPhoneNumber(event.target.value);
    };

    const handleCustomerNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCustomerName(event.target.value);
        setCustomer(null);
    };

    const handleSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSize(event.target.value);
    };

    const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setColor(event.target.value);
    };

    const handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDescription(event.target.value);
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
                    size: size,
                    color: color,
                    description: description,
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
            setLoading(true)
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
                    size: selectedProduct.size,
                    color: selectedProduct.color,
                    description: selectedProduct.description,
                })),
                statusCount: {0: selectedProducts.length},
                deposit: deposit,
                isPaidOff: paidOff === 0 ? false : true
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
            setPaidOff(0)
            setQuantity('');
            setDeposit('');
            setColor('');
            setSize('');
            setDescription('');
        } catch (error) {
            console.error('Error creating transaction:', error);
            toast.error(toastText + 'Transaksi gagal dibuat.', { autoClose: 3000 });
        } finally {
            setLoading(false)
        }
    };

    return (
        <>
            <Typography variant="h6" noWrap component="div">
                Buat Transaksi
            </Typography>
            <Box key={rerenderKey}>
                <Autocomplete
                    options={customers.filter((customer) => customer.blacklist === false)}
                    getOptionLabel={(option) => (typeof option === 'string' ? option : option.customerName || '')}
                    renderOption={(props, option) => (
                        <li {...props}>
                            <div>{option.customerName}</div>
                            <div style={{ marginLeft: '8px' }}>{option.phoneNumber}</div>
                        </li>
                    )}
                    renderInput={(params) => (
                        <TextField {...params} label="Nama Konsumen" onChange={handleCustomerNameChange} margin='normal' />
                    )}
                    onChange={(_, newValue) => setCustomer(newValue as Customer | null)}
                    freeSolo
                />
                {customer ? (
                    <TextField
                        label="Nomor Telepon"
                        value={customer.phoneNumber}
                        disabled
                        fullWidth
                        margin="normal"
                    />
                ) : (
                    <TextField
                        label="Nomor Telepon"
                        value={phoneNumber}
                        onChange={handlePhoneNumberChange}
                        fullWidth
                        margin="normal"
                    />
                )}
                <TextField
                    label="Deposit"
                    value={deposit}
                    onChange={handleDepositChange}
                    fullWidth
                    margin="normal"
                />
                <Stack direction={'row'} justifyContent={'flex-end'}>
                    <Select
                        value={paidOff}
                        onChange={(e) => setPaidOff(e.target.value as number)}
                        displayEmpty
                        inputProps={{ 'aria-label': 'Without label' }}
                    >
                        <MenuItem value={0}>Belum Lunas</MenuItem>
                        <MenuItem value={1}>Lunas</MenuItem>
                    </Select>
                </Stack>
                <Autocomplete
                    options={products.filter((product) => product.production)}
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
                        <TextField
                            label="Ukuran"
                            value={size}
                            onChange={handleSizeChange}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="Warna"
                            value={color}
                            onChange={handleColorChange}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="Keterangan"
                            value={description}
                            onChange={handleDescriptionChange}
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
                                        <TableCell />
                                        <TableCell>Kode Produk</TableCell>
                                        <TableCell>Nama Produk</TableCell>
                                        <TableCell>Ukuran</TableCell>
                                        <TableCell>Warna</TableCell>
                                        <TableCell>Keterangan</TableCell>
                                        <TableCell align='right'>Jumlah</TableCell>
                                        <TableCell align='right'>Harga/Jumlah</TableCell>
                                        <TableCell align='center'>Aksi</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {selectedProducts.map((selectedProduct, index) => (
                                        <TableRow key={index}>
                                            <TableCell align="center">
                                                <LightTooltip title={<img src={imageBaseUrl + selectedProduct.product.productImage} alt="Product" style={{ width: '100px', height: '100px', objectFit: 'cover', display: 'block', margin: 'auto', borderRadius: '16px' }} />}>
                                                    <IconButton>
                                                        <PreviewIcon />
                                                    </IconButton>
                                                </LightTooltip>
                                            </TableCell>
                                            <TableCell>{selectedProduct.product.productCode}</TableCell>
                                            <TableCell>{selectedProduct.product.productName}</TableCell>
                                            <TableCell>{selectedProduct.size}</TableCell>
                                            <TableCell>{selectedProduct.color}</TableCell>
                                            <TableCell>{selectedProduct.description}</TableCell>
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
                        disabled={loading}
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
