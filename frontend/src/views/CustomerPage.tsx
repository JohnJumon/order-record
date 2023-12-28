import * as React from 'react';
import axios from 'axios';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import CustomTable from './components/CustomTable';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import PageviewIcon from '@mui/icons-material/Pageview';
import { useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';

function Row(props: RowProps) {
    const { row, rowNumber } = props;
    const navigate = useNavigate()

    return (
        <React.Fragment>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                <TableCell>{rowNumber}</TableCell>
                <TableCell component="th" scope="row">
                    {row.phoneNumber}
                </TableCell>
                <TableCell align="left">{row.customerName.toUpperCase()}</TableCell>
                <TableCell align="center">
                    <Tooltip title='Lihat Data Pelanggan'>
                        <IconButton color="primary" onClick={() => (navigate('/pelanggan/' + row._id))}>
                            <PageviewIcon />
                        </IconButton>
                    </Tooltip>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}
export default function CustomerPage() {
    const [customers, setCustomers] = React.useState<CustomerData[]>([]);
    const [searchTerm, setSearchTerm] = React.useState('');

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('/customer');
                setCustomers(response.data.customers);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const filteredCustomer = customers.filter(
        (customer) =>
            customer.phoneNumber.toUpperCase().includes(searchTerm.toUpperCase()) ||
            customer.customerName.toUpperCase().includes(searchTerm.toUpperCase())
    );

    const header = (
        <TableHead>
            <TableRow>
                <TableCell>No. </TableCell>
                <TableCell>Nomor Telepon</TableCell>
                <TableCell align="left">Nama Pelanggan</TableCell>
                <TableCell />
            </TableRow>
        </TableHead>
    );

    return (
        <>
            <Typography variant="h6" noWrap component="div">
                Daftar Pelanggan
            </Typography>
            <TextField
                label="Cari Nama Pelanggan/Nomor Telepon"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                fullWidth
                margin='normal'
            />
            <CustomTable
                header={header}
                data={filteredCustomer}
                renderRow={(row, rowNumber) => (
                    <Row key={rowNumber} row={row} rowNumber={rowNumber} />
                )}
            />
        </>

    );
}

interface CustomerData {
    _id: string,
    customerName: string;
    phoneNumber: string;
}

interface RowProps {
    row: CustomerData;
    rowNumber: number;
}