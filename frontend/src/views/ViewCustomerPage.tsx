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
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { formatPriceAsRupiah } from './utility/utility';
import { LightTooltip } from './TransactionPage';
import PreviewIcon from '@mui/icons-material/Preview';

const ViewCustomerPage: React.FC = () => {
    const { customerId } = useParams()

    const [originalData, setOriginalData] = useState({ phoneNumber: '', customerName: '' });
    const [phoneNumber, setPhoneNumber] = useState<string>('');
    const [customerName, setCustomerName] = useState<string>('');
    const [orders, setOrders] = useState([]);
    const [aggregatedProductData, setAggregatedProductData] = useState<OrderItem[]>([]);

    const [loading, setLoading] = useState<boolean>(false)
    const [changesDetected, setChangesDetected] = useState<boolean>(false);
    const [openConfirmationModal, setOpenConfirmationModal] = useState<boolean>(false);

    const imageBaseUrl = `https://storage.cloud.google.com/${import.meta.env.BUCKET_NAME}/`

    const navigate = useNavigate();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`/customer/${customerId}`);
                setPhoneNumber(response.data.customer.phoneNumber)
                setCustomerName(response.data.customer.customerName)
                setOriginalData({ phoneNumber: response.data.customer.phoneNumber, customerName: response.data.customer.customerName });
            } catch (error) {
                console.error('Error fetching customer:', error);
            }
        };
        const fetchOrders = async () => {
            try {
                const response = await axios.get(`/order?customerId=${customerId}`);
                setOrders(response.data.orders);
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };

        fetchProduct()
        fetchOrders()
    }, [customerId])

    useEffect(() => {
        const processOrders = () => {
            const aggregatedData: OrderItem[] = [];

            orders.forEach((order: Order) => {
                order.items.forEach((item: OrderItem) => {
                    const existingProduct = aggregatedData.find((data) => data.product._id === item.product._id);

                    if (existingProduct) {
                        existingProduct.quantity += item.quantity;
                    } else {
                        aggregatedData.push({
                            product: item.product,
                            quantity: item.quantity,
                        });
                    }
                });
            });

            setAggregatedProductData(aggregatedData);
        };
        processOrders()
    }, [orders]);

    const handlePhoneNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPhoneNumber(event.target.value);
        setChangesDetected(true);
    };

    const handleCustomerNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCustomerName(event.target.value);
        setChangesDetected(true);
    };

    const handleUpdateCustomer = async () => {
        if (changesDetected) {
            setOpenConfirmationModal(true);
            return;
        }

        await updateCustomer();
    };

    const updateCustomer = async () => {
        try {
            setLoading(true)
            const checkResponse = await axios.get(`/customer/check/${phoneNumber}`);
            if (checkResponse.data.exists) {
                if (customerId !== checkResponse.data._id) {
                    toast.error('Data Pelanggan dengan nomor telepon yang sama sudah ada.', { autoClose: 3000 });
                    return;
                }
            }

            await axios.put(`/customer/${customerId}`, {
                phoneNumber: phoneNumber,
                customerName: customerName,
            });
            console.log('Customer updated successfully');
            toast.success('Data Pelanggan berhasil diperbarui.', { autoClose: 3000 });
            setOriginalData({ phoneNumber, customerName });
            setChangesDetected(false)
        } catch (error) {
            console.error('Error updating customer:', error);
            toast.error('Data Pelanggan gagal diperbarui.', { autoClose: 3000 });
        } finally {
            setLoading(false)
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
                Lihat dan Perbarui Data Pelanggan
            </Typography>
            <Box>
                <TextField
                    label="Nomor Telepon"
                    value={phoneNumber}
                    onChange={handlePhoneNumberChange}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Nama Pelanggan"
                    value={customerName}
                    onChange={handleCustomerNameChange}
                    fullWidth
                    margin="normal"
                />
                <Button disabled={loading ||
                    (originalData.phoneNumber === phoneNumber) &&
                    (originalData.customerName === customerName)
                } variant="contained" color="secondary" onClick={handleUpdateCustomer} sx={{ marginLeft: 'auto', p: 2, marginTop: 2, display: 'block', width: '100%' }}>
                    Perbarui Data Pelanggan
                </Button>
                <Typography variant="h6" noWrap component="div" style={{ marginTop: '20px' }}>
                    Daftar Pembelian:
                </Typography>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell />
                                <TableCell>Kode Produk</TableCell>
                                <TableCell>Nama Produk</TableCell>
                                <TableCell align="right">Total Jumlah Pembelian</TableCell>
                                <TableCell align='right'>Harga/Jumlah</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {[...aggregatedProductData].sort((a, b) => b.quantity - a.quantity).map((order: OrderItem) => (
                                <TableRow key={order.product._id}>
                                    <TableCell align="center">
                                        <LightTooltip title={<img src={imageBaseUrl + order.product.productImage} alt="Product" style={{ width: '100px', height: '100px', objectFit: 'cover', display: 'block', margin: 'auto', borderRadius: '16px' }} />}>
                                            <IconButton>
                                                <PreviewIcon />
                                            </IconButton>
                                        </LightTooltip>
                                    </TableCell>
                                    <TableCell>{order.product.productCode}</TableCell>
                                    <TableCell>{order.product.productName}</TableCell>
                                    <TableCell align="right">{order.quantity}</TableCell>
                                    <TableCell align="right">{formatPriceAsRupiah(order.product.productPrice)}</TableCell>
                                </TableRow>

                            ))}
                            <TableRow>
                                <TableCell colSpan={4} align="left" sx={{ fontWeight: 500 }}>Total Harga Transaksi</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 500 }}>
                                    {formatPriceAsRupiah(
                                        aggregatedProductData.reduce((total, item) => total + (item.quantity * item.product.productPrice), 0))
                                    }
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
            <Dialog open={openConfirmationModal} onClose={handleCloseConfirmationModal}>
                <DialogTitle>Perubahan Terdeteksi</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Apakah Anda yakin ingin menyimpan perubahan?
                    </DialogContentText>
                    {originalData.phoneNumber !== phoneNumber && (
                        <>
                            <Typography sx={{ fontWeight: 500 }}>
                                Nomor Telepon
                            </Typography>
                            <DialogContentText style={{ display: 'flex', alignItems: 'center' }}>
                                {originalData.phoneNumber} <ChevronRightIcon /> {phoneNumber}
                            </DialogContentText>
                        </>

                    )}
                    {originalData.customerName !== customerName && (
                        <>
                            <Typography sx={{ fontWeight: 500 }}>
                                Nama Pelanggan
                            </Typography>
                            <DialogContentText style={{ display: 'flex', alignItems: 'center' }}>
                                {originalData.customerName} <ChevronRightIcon /> {customerName}
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

export default ViewCustomerPage;

interface Product {
    _id: string,
    productName: string;
    productPrice: number;
    productCode: string;
    productImage: string;
}

interface OrderItem {
    product: Product;
    quantity: number;
}

interface Order {
    _id: string;
    items: OrderItem[];
}