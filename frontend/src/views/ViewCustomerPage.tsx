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
import { formatDate } from './utility/utility';
import Collapse from '@mui/material/Collapse';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

function Row(props: RowProps) {
    const { row } = props;
    const [open, setOpen] = React.useState(false);

    const imageBaseUrl = `https://storage.googleapis.com/${import.meta.env.VITE_BUCKET_NAME}/`

    return (
        <React.Fragment>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                <TableCell>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell align="center">
                    <LightTooltip title={<img src={imageBaseUrl + row.product.productImage} alt="Product" style={{ width: '100px', height: '100px', objectFit: 'cover', display: 'block', margin: 'auto', borderRadius: '16px' }} />}>
                        <IconButton>
                            <PreviewIcon />
                        </IconButton>
                    </LightTooltip>
                </TableCell>
                <TableCell>{row.product.productCode}</TableCell>
                <TableCell>{row.product.productName}</TableCell>
                <TableCell align="right">{row.quantity}</TableCell>
                <TableCell align="right">{formatPriceAsRupiah(row.product.productPrice)}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <Typography variant="h6" gutterBottom component="div">
                                Daftar Riwayat Pembelian
                            </Typography>
                            <Table size="small" aria-label="order-items">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Tanggal Transaksi</TableCell>
                                        <TableCell align='right'>Jumlah Pembelian</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {row.history.map((history: OrderItemHistory, index: number) => (
                                        <TableRow key={index}>
                                            <TableCell>{history.orderDate}</TableCell>
                                            <TableCell align='right'>{history.quantity}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}

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
                const date = formatDate(order.orderDate)
                order.items.forEach((item: OrderItem) => {
                    const existingProduct = aggregatedData.find((data) => data.product._id === item.product._id);

                    if (existingProduct) {
                        existingProduct.quantity += item.quantity;
                        existingProduct.history.unshift({
                            orderDate: date,
                            quantity: item.quantity
                        })
                    } else {
                        aggregatedData.push({
                            product: item.product,
                            quantity: item.quantity,
                            history: [{
                                orderDate: date,
                                quantity: item.quantity,
                            }]
                        });
                    }
                });
            });

            setAggregatedProductData(aggregatedData);
            console.log(aggregatedData)
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
                                <TableCell />
                                <TableCell>Kode Produk</TableCell>
                                <TableCell>Nama Produk</TableCell>
                                <TableCell align="right">Total Jumlah Pembelian</TableCell>
                                <TableCell align='right'>Harga/Jumlah</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {[...aggregatedProductData].sort((a, b) => b.quantity - a.quantity).map((order: OrderItem) => (
                                <Row key={order.product._id} row={order} />
                            ))}
                            <TableRow>
                                <TableCell colSpan={5} align="left" sx={{ fontWeight: 500 }}>Total Harga Transaksi</TableCell>
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

interface OrderItemHistory {
    orderDate: string;
    quantity: number;
}

interface OrderItem {
    product: Product;
    quantity: number;
    history: OrderItemHistory[];
}

interface Order {
    _id: string;
    items: OrderItem[];
    orderDate: string;
}

interface RowProps {
    row: OrderItem
}