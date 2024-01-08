import * as React from 'react';
import axios from 'axios';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import CustomTable from './components/CustomTable';
import { useNavigate } from 'react-router-dom';
import PageviewIcon from '@mui/icons-material/Pageview';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import { formatPriceAsRupiah } from './utility/utility';

function Row(props: RowProps) {
    const { row, rowNumber } = props;
    const navigate = useNavigate();
    return (
        <React.Fragment>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                <TableCell>{rowNumber}</TableCell>
                <TableCell component="th" scope="row">
                    {row.productCode.toUpperCase()}
                </TableCell>
                <TableCell align="left">{row.productName.toUpperCase()}</TableCell>
                <TableCell align="right">{formatPriceAsRupiah(row.productPrice)}</TableCell>
                <TableCell align="center">
                    <Tooltip title='Lihat Produk'>
                        <IconButton color="primary" onClick={() => (navigate('/produk/'+row._id))}>
                            <PageviewIcon />
                        </IconButton>
                    </Tooltip>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}
export default function ProductPage() {
    const [products, setProducts] = React.useState<ProductData[]>([]);
    const [searchTerm, setSearchTerm] = React.useState('');

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('/product');
                setProducts(response.data.products);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const filteredProducts = products.filter(
        (product) =>
            product.production && (
            product.productCode.toUpperCase().includes(searchTerm.toUpperCase()) ||
            product.productName.toUpperCase().includes(searchTerm.toUpperCase()) )
    );

    const header = (
        <TableHead>
            <TableRow>
                <TableCell>No. </TableCell>
                <TableCell>Kode Produk</TableCell>
                <TableCell align="left">Nama Produk</TableCell>
                <TableCell align="right">Harga Produk</TableCell>
                <TableCell />
            </TableRow>
        </TableHead>
    );

    return (
        <>
            <Typography variant="h6" noWrap component="div">
                Daftar Produk
            </Typography>
            <TextField
                label="Cari Nama Produk/Kode Produk"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                fullWidth
                margin='normal'
            />
            <CustomTable
                header={header}
                data={filteredProducts}
                renderRow={(row, rowNumber) => (
                    <Row key={rowNumber} row={row} rowNumber={rowNumber} />
                )}
            />
        </>

    );
}

interface ProductData {
    _id: string,
    productName: string;
    productPrice: number;
    productCode: string;
    production: boolean;
}

interface RowProps {
    row: ProductData;
    rowNumber: number;
}