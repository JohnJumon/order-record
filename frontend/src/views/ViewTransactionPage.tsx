import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Autocomplete from '@mui/material/Autocomplete';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Paper from '@mui/material/Paper';
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
import { useParams, useNavigate } from 'react-router-dom';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import _ from 'lodash';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import {getStatus, formatPriceAsRupiah, formatDate } from './utility/utility';
import { LightTooltip } from './TransactionPage';
import PreviewIcon from '@mui/icons-material/Preview';

interface Product {
    _id: string;
    productCode: string;
    productName: string;
    productPrice: number;
    productImage: string;
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
    status: number;
}

interface Order {
    _id: string;
    customer: Customer;
    items: SelectedProduct[];
    orderDate: string;
    statusCount: {
        [key: number]: number
    };
    deposit: number;
    isPaidOff: boolean;
}

const ViewTransactionPage: React.FC = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();

    const [originalData, setOriginalData] = useState({
        customerName: '',
        selectedProducts: [] as SelectedProduct[],
        deposit: 0 as number,
        isPaidOff: false as boolean
    });

    const [order, setOrder] = useState<Order | null>(null);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [customer, setCustomer] = useState<Customer | null>(null);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [customerName, setCustomerName] = useState('');
    const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [quantity, setQuantity] = useState<number | ''>('');
    const [paidOff, setPaidOff] = useState<number>(0);
    const [deposit, setDeposit] = useState<number>(0)
    const [color, setColor] = useState('');
    const [size, setSize] = useState('');
    const [description, setDescription] = useState('');

    const [loading, setLoading] = useState<boolean>(false);
    const [changesDetected, setChangesDetected] = useState<boolean>(false);
    const [openConfirmationModal, setOpenConfirmationModal] = useState<boolean>(false);

    const imageBaseUrl = `https://storage.googleapis.com/${import.meta.env.VITE_BUCKET_NAME}/`

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const response = await axios.get(`/order/${orderId}`);
                const fetchedOrder = response.data.order;
                setOrder(fetchedOrder);
                setPhoneNumber(fetchedOrder.customer.phoneNumber);
                setCustomer(fetchedOrder.customer);
                setCustomerName(fetchedOrder.customer.customerName);
                setDeposit(fetchedOrder.deposit)
                setPaidOff(fetchedOrder.isPaidOff)
                setSelectedProducts(
                    fetchedOrder.items.map((item: SelectedProduct) => ({
                        product: item.product,
                        quantity: item.quantity,
                        size: item.size,
                        color: item.color,
                        description: item.description,
                        status: item.status
                    }))
                );
                setOriginalData({
                    customerName: fetchedOrder.customer.customerName,
                    selectedProducts: fetchedOrder.items.map((item: SelectedProduct) => ({
                        product: item.product,
                        quantity: item.quantity,
                        size: item.size,
                        color: item.color,
                        description: item.description,
                        status: item.status
                    })),
                    deposit: fetchedOrder.deposit,
                    isPaidOff: fetchedOrder.isPaidOff,
                });
            } catch (error) {
                console.error('Error fetching order:', error);
                toast.error('Error fetching order details.');
            }
        };

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

        fetchOrder();
        fetchCustomers();
        fetchProducts();
    }, [orderId]);

    const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue: number | '' = event.target.value === '' ? '' : parseInt(event.target.value, 10);
        setQuantity(newValue);
    };

    const handleDepositChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue: number = event.target.value === '' ? 0 : parseInt(event.target.value, 10);
        setDeposit(newValue);
        setChangesDetected(true);
    };

    const handlePhoneNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPhoneNumber(event.target.value);
    };

    const handleCustomerNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCustomerName(event.target.value);
        setCustomer(null);
        setChangesDetected(true)
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
                    color: color,
                    size: size,
                    description: description,
                    status: 0
                };

                setSelectedProducts([...selectedProducts, newSelectedProduct]);
                setSelectedProduct(null);
                setQuantity('');
                setChangesDetected(true)
            } else {
                toast.error('Produk sudah dimasukan, jika ada kesalahan mohon dihapus kembali.');
            }
        }
    };

    const handleDeleteProduct = (index: number) => {
        const updatedProducts = [...selectedProducts];
        updatedProducts.splice(index, 1);
        setSelectedProducts(updatedProducts);
        setChangesDetected(true)
    };

    const handleUpdateTransaction = async () => {
        if (changesDetected) {
            setOpenConfirmationModal(true)
            return;
        }
        await updateTransaction()
    };

    const updateTransaction = async () => {
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
                toastText = 'Data Pelanggan & ';
            } else if (customer) {
                customerId = customer._id;
            }

            const newStatusCount = selectedProducts.reduce((acc, selectedProduct) => {
                acc[selectedProduct.status] = (acc[selectedProduct.status] || 0) + 1;
                return acc;
            }, { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0 } as { [key: number]: number }) ;

            const response = await axios.put(`/order/${orderId}`, {
                customer: customerId,
                items: selectedProducts.map((selectedProduct) => ({
                    product: selectedProduct.product._id,
                    quantity: selectedProduct.quantity,
                    status: selectedProduct.status,
                    size: selectedProduct.size,
                    color: selectedProduct.color,
                    description: selectedProduct.description,
                })),
                deposit: deposit,
                isPaidOff: paidOff == 1,
                statusCount: newStatusCount,
            });

            console.log('Transaction updated successfully:', response.data);
            toast.success(toastText + 'Transaksi berhasil diperbarui.', { autoClose: 3000 });
            setPhoneNumber(phoneNumber);
            setCustomerName(customerName);
            setSelectedProducts(selectedProducts);
            setDeposit(deposit)
            setPaidOff(paidOff)
            setOriginalData({
                customerName: customerName,
                selectedProducts: selectedProducts,
                deposit: deposit,
                isPaidOff: paidOff === 1,
            })
            setChangesDetected(false)
        } catch (error) {
            console.error('Error updating transaction:', error);
            toast.error(toastText + 'Transaksi gagal diperbarui.', { autoClose: 3000 });
        } finally {
            setLoading(false)
        }
    };

    const handleCloseConfirmationModal = () => {
        setOpenConfirmationModal(false);
    };

    const handleConfirmUpdate = () => {
        updateTransaction();
        setOpenConfirmationModal(false);
    };

    const handleStatusChange = (event: SelectChangeEvent<number>, index: number) => {
        const updatedProducts = [...selectedProducts];
        updatedProducts[index].status = event.target.value as number;
        setSelectedProducts(updatedProducts);
        setChangesDetected(true);
        console.log(updatedProducts)
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

    return (
        <>
            <Typography variant="h6" noWrap component="div" style={{ display: 'flex', alignItems: 'center' }}>
                <Tooltip title="Kembali">
                    <IconButton onClick={() => { navigate(-1) }}>
                        <ArrowBackIosIcon />
                    </IconButton>
                </Tooltip>
                Lihat dan Perbarui Transaksi
            </Typography>
            <Typography noWrap component="div" sx={{ my: 2 }}>
                <span style={{ fontWeight: 500 }}>{"Tanggal Transaksi : "}</span>{order !== null ? formatDate(order.orderDate) : ''}
            </Typography>
            <Box>
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
                        <TextField {...params} label="Nomor Telepon" onChange={handleCustomerNameChange} margin='normal' value={customerName} />
                    )}
                    onChange={(_, newValue) => {
                        if (newValue && typeof newValue !== 'string') {
                            setCustomerName(newValue.customerName || '');
                            setCustomer(newValue);
                        }
                    }}
                    freeSolo
                    value={customers.find(cust => cust.customerName === customerName) || null}
                />
                {customer ? (
                    <TextField
                        label="Nomor Telepon"
                        value={customer.phoneNumber}
                        fullWidth
                        margin="normal"
                        disabled
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
                        value={paidOff ? 1 : 0}
                        onChange={(e) => {
                                setPaidOff(e.target.value as number)
                                setChangesDetected(true)
                            }
                        }
                        displayEmpty
                        inputProps={{ 'aria-label': 'Without label' }}
                    >
                        <MenuItem value={0}>Belum Lunas</MenuItem>
                        <MenuItem value={1}>Lunas</MenuItem>
                    </Select>
                </Stack>
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
                                        <TableCell align='center'>Status</TableCell>
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
                                            <TableCell align='right'>{formatPriceAsRupiah(selectedProduct.product.productPrice)}</TableCell>
                                            <TableCell align='center'>
                                                <Select
                                                    value={selectedProduct.status}
                                                    onChange={(e) => handleStatusChange(e, index)}
                                                    displayEmpty
                                                    inputProps={{ 'aria-label': 'Without label' }}
                                                >
                                                    <MenuItem value={0}>Order</MenuItem>
                                                    <MenuItem value={1}>Pick Up</MenuItem>
                                                    <MenuItem value={2}>Dikirim</MenuItem>
                                                    <MenuItem value={3}>Selesai</MenuItem>
                                                    <MenuItem value={4}>Sold Out</MenuItem>
                                                </Select>
                                            </TableCell>
                                            <TableCell align='center'>
                                                <Tooltip title='Hapus'>
                                                    <IconButton color="error" onClick={() => handleDeleteProduct(index)}>
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    <TableRow>
                                        <TableCell colSpan={8} align='left' sx={{ fontWeight: 500 }}>Total Harga</TableCell>
                                        <TableCell align='right' sx={{ fontWeight: 500 }}>
                                            {formatPriceAsRupiah(selectedProducts.reduce(
                                                (total, item) => total + item.product.productPrice * item.quantity, 0
                                            ))}
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </>
                )}
                {selectedProducts.length > 0 && (
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={handleUpdateTransaction}
                        sx={{ marginLeft: 'auto', p: 2, marginTop: 2, display: 'block', width: '100%' }}
                        disabled={loading ||
                            (
                                (originalData.customerName === customerName) &&
                                (originalData.deposit === deposit) &&
                                (originalData.isPaidOff === (paidOff == 1)) &&
                                (_.isEqual(originalData.selectedProducts, selectedProducts))
                            )
                        }
                    >
                        Perbarui Transaksi
                    </Button>
                )}
            </Box>
            <Dialog open={openConfirmationModal} onClose={handleCloseConfirmationModal}>
                <DialogTitle>Perubahan Terdeteksi</DialogTitle>
                <DialogContent style={{ maxHeight: '400px', overflowY: 'auto' }}>
                    <DialogContentText>
                        Apakah Anda yakin ingin menyimpan perubahan?
                    </DialogContentText>
                    {originalData.customerName !== customerName && (
                        <>
                            <Typography sx={{ fontWeight: 500 }}>
                                Pelanggan
                            </Typography>
                            <DialogContentText style={{ display: 'flex', alignItems: 'center' }}>
                                {originalData.customerName} <ChevronRightIcon /> {customerName}
                            </DialogContentText>
                        </>

                    )}
                    {originalData.isPaidOff !== (paidOff == 1) && (
                        <>
                            <Typography sx={{ fontWeight: 500 }}>
                                Status Pembayaran
                            </Typography>
                            <DialogContentText style={{ display: 'flex', alignItems: 'center' }}>
                                {originalData.isPaidOff ? "LUNAS" : "BELUM LUNAS"} <ChevronRightIcon /> {paidOff == 1 ? "LUNAS" : "BELUM LUNAS"}
                            </DialogContentText>
                        </>

                    )}
                    {originalData.deposit !== deposit && (
                        <>
                            <Typography sx={{ fontWeight: 500 }}>
                                Deposit
                            </Typography>
                            <DialogContentText style={{ display: 'flex', alignItems: 'center' }}>
                                {formatPriceAsRupiah(originalData.deposit)} <ChevronRightIcon /> {formatPriceAsRupiah(deposit)}
                            </DialogContentText>
                        </>

                    )}
                    {!_.isEqual(originalData.selectedProducts, selectedProducts) &&
                        (
                            <>
                                <Typography sx={{ fontWeight: 500 }}>
                                    Produk Dipesan
                                </Typography>
                                <TableContainer component={Paper} >
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell align='left'>Kode Produk</TableCell>
                                                <TableCell align='right'>Jumlah</TableCell>
                                                <TableCell align='center'>Status</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {originalData.selectedProducts.map((originalProduct, index) => (
                                                <TableRow key={index}>
                                                    <TableCell>{originalProduct.product.productCode}</TableCell>
                                                    <TableCell align='right'>{originalProduct.quantity}</TableCell>
                                                    <TableCell align='center'>{getStatus(originalProduct.status)}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                                <KeyboardArrowDownIcon sx={{ marginX: 'auto', marginY: 2, display: 'block' }} />
                                <TableContainer component={Paper}>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell align='left'>Kode Produk</TableCell>
                                                <TableCell align='right'>Jumlah</TableCell>
                                                <TableCell align='right'>Status</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {selectedProducts.map((selectedProduct, index) => (
                                                <TableRow key={index}>
                                                    <TableCell>{selectedProduct.product.productCode}</TableCell>
                                                    <TableCell align='right'>{selectedProduct.quantity}</TableCell>
                                                    <TableCell align='center'>{getStatus(selectedProduct.status)}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
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

export default ViewTransactionPage;