import * as React from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import CustomTable from './components/CustomTable';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import PageviewIcon from '@mui/icons-material/Pageview';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { getStatus, formatDate, formatPriceAsRupiah } from './utility/utility';
import PreviewIcon from '@mui/icons-material/Preview';

export const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: theme.palette.common.white,
        color: 'rgba(0, 0, 0, 0)',
    },
}));

function Row(props: RowProps) {
    const { row, rowNumber } = props;
    const [open, setOpen] = React.useState(true);
    const navigate = useNavigate();

    const imageBaseUrl = `https://storage.googleapis.com/${import.meta.env.VITE_BUCKET_NAME}/`

    return (
        <React.Fragment>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' }, backgroundColor: '#c8d9ed' }}>
                <TableCell>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell>{rowNumber}</TableCell>
                <TableCell component="th" scope="row">
                    {row.customer.customerName.toUpperCase()}
                </TableCell>
                <TableCell align="left">{formatDate(row.orderDate)}</TableCell>
                <TableCell align="center">{row.isPaidOff ? "LUNAS" : "BELUM LUNAS"}</TableCell>
                <TableCell align="center">
                    <Tooltip title='Lihat Transaksi'>
                        <IconButton color="primary" onClick={() => (navigate('/transaksi/' + row._id))}>
                            <PageviewIcon />
                        </IconButton>
                    </Tooltip>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={9}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <Table size="small" aria-label="order-items">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Daftar Produk Dipesan</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell colSpan={7} align="left" sx={{ fontWeight: 500 }}>Deposit</TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 500 }}>
                                            {formatPriceAsRupiah(row.deposit)}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow sx={{ borderBottomStyle: 'solid', borderWidth: '2px', borderColor: 'white' }}>
                                        <TableCell />
                                        <TableCell>Kode Produk</TableCell>
                                        <TableCell>Nama Produk</TableCell>
                                        <TableCell align="center">Ukuran</TableCell>
                                        <TableCell align="center">Warna</TableCell>
                                        <TableCell align="center">Keterangan</TableCell>
                                        <TableCell align="right">Jumlah</TableCell>
                                        <TableCell align="right">Harga/Jumlah</TableCell>
                                        <TableCell align="center">Status</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {row.items.map((item: OrderItem, index: number) => (
                                        <TableRow sx={{ borderStyle: 'solid', borderWidth: '2px', borderColor: 'white' }} key={index}>
                                            <TableCell align="center">
                                                <LightTooltip title={<img src={imageBaseUrl + item.product.productImage} alt="Product" style={{ width: '100px', height: '100px', objectFit: 'cover', display: 'block', margin: 'auto', borderRadius: '16px' }} />}>
                                                    <IconButton>
                                                        <PreviewIcon />
                                                    </IconButton>
                                                </LightTooltip>
                                            </TableCell>
                                            <TableCell>{item.product.productCode}</TableCell>
                                            <TableCell>{item.product.productName}</TableCell>
                                            <TableCell align="center">{item.size}</TableCell>
                                            <TableCell align="center">{item.color}</TableCell>
                                            <TableCell align="center">{item.description}</TableCell>
                                            <TableCell align="right">{item.quantity}</TableCell>
                                            <TableCell align="right">{formatPriceAsRupiah(item.product.productPrice)}</TableCell>
                                            <TableCell align="center">{getStatus(item.status)}</TableCell>
                                        </TableRow>
                                    ))}
                                    <TableRow>
                                        <TableCell colSpan={7} align="left" sx={{ fontWeight: 500 }}>Total Harga</TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 500 }}>
                                            {formatPriceAsRupiah(row.items.reduce((total, item) => total + (item.quantity * item.product.productPrice), 0))}
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}

export default function TransactionPage() {
    const [orders, setOrders] = React.useState<OrderData[]>([]);
    const [searchTerm, setSearchTerm] = React.useState('');
    const [statusFilter, setStatusFilter] = React.useState<number | ''>('');
    const [paymentFilter, setPaymentFilter] = React.useState<number | ''>('');
    const [startDate, setStartDate] = React.useState<string>('');
    const [endDate, setEndDate] = React.useState<string>('');

    const fetchData = async () => {
        try {
            const startOfDay = startDate ? new Date(startDate) : null;
            if (startOfDay) {
                startOfDay.setHours(0, 0, 0, 0);
            }
            const endOfDay = endDate ? new Date(endDate) : null;
            if (endOfDay) {
                endOfDay.setHours(23, 59, 59, 999);
            }

            const response = await axios.get('/order', {
                params: {
                    searchTerm,
                    statusFilter,
                    paymentFilter,
                    startDate: startOfDay?.toISOString(),
                    endDate: endOfDay?.toISOString(),
                },
            });
            const sortedTransactions = response.data.orders.sort(
                (a: { orderDate: string }, b: { orderDate: string }) =>
                    new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
            );
            if (statusFilter === '') {
                setOrders(sortedTransactions)
                console.log('test')
            }
            else {
                const filteredOrders = sortedTransactions.map((order: OrderData) => {
                    const filteredItems = order.items.filter((item: OrderItem) => item.status === statusFilter);
                    return { ...order, items: filteredItems };
                });
                setOrders(filteredOrders);
            }

        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    React.useEffect(() => {
        fetchData();
    }, [searchTerm, statusFilter, paymentFilter, startDate, endDate]);

    const header = (
        <TableHead>
            <TableRow>
                <TableCell />
                <TableCell>No. </TableCell>
                <TableCell>Nama Pemesan</TableCell>
                <TableCell align="left">Tanggal Pemesanan</TableCell>
                <TableCell align="center">Status Pembayaran</TableCell>
                <TableCell />
            </TableRow>
        </TableHead>
    );

    return (
        <>
            <Typography variant="h6" noWrap component="div">
                Daftar Transaksi
            </Typography>
            <TextField
                label="Cari Nama Pemesan"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                fullWidth
                margin='normal'
            />
            <Stack direction="row" spacing={2} sx={{ marginY: '16px' }}>
                <TextField
                    label="Tanggal Awal"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    fullWidth
                />
                <TextField
                    label="Tanggal Akhir"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    fullWidth
                />
            </Stack>
            <Stack direction={'row'} justifyContent={'flex-end'}>
                <Select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as number | '')}
                    displayEmpty
                    inputProps={{ 'aria-label': 'Without label' }}
                >
                    <MenuItem value={''}>Semua Status Barang</MenuItem>
                    <MenuItem value={0}>Order</MenuItem>
                    <MenuItem value={1}>Pick Up</MenuItem>
                    <MenuItem value={2}>Dikirim</MenuItem>
                    <MenuItem value={3}>Selesai</MenuItem>
                    <MenuItem value={4}>Sold Out</MenuItem>
                </Select>
                <Select
                    value={paymentFilter}
                    onChange={(e) => setPaymentFilter(e.target.value as number | '')}
                    displayEmpty
                    inputProps={{ 'aria-label': 'Without label' }}
                    sx={{ ml: 2 }}
                >
                    <MenuItem value={''}>Semua Status Pembayaran</MenuItem>
                    <MenuItem value={0}>Belum Lunas</MenuItem>
                    <MenuItem value={1}>Lunas</MenuItem>
                </Select>
            </Stack>

            <CustomTable
                header={header}
                data={orders}
                renderRow={(row, rowNumber) => (
                    <Row key={rowNumber} row={row} rowNumber={rowNumber} />
                )}
            />
        </>

    );
}

interface Product {
    productImage: string;
    productPrice: number;
    productCode: string;
    productName: string;
}

interface OrderItem {
    quantity: number;
    product: Product;
    color: string;
    size: string;
    description: string;
    status: number
}

interface OrderData {
    _id: string,
    customer: {
        customerName: string;
        phoneNumber: string;
    };
    orderDate: string;
    items: OrderItem[];
    statusCount: {
        [key: number]: number
    };
    deposit: number;
    isPaidOff: boolean;
}

interface RowProps {
    row: OrderData;
    rowNumber: number;
}

