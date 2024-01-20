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

function Row(props: RowProps) {

    const { row, rowNumber } = props;
    const navigate = useNavigate();
    return (
        <React.Fragment>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                <TableCell>{rowNumber}</TableCell>
                <TableCell align="left">{row.username}</TableCell>
                <TableCell align="center">
                    <Tooltip title='Lihat Admin'>
                        <IconButton color="primary" onClick={() => (navigate('/admin/' + row._id))}>
                            <PageviewIcon />
                        </IconButton>
                    </Tooltip>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}
export default function AdminPage() {
    const [admins, setAdmins] = React.useState<AdminData[]>([]);
    const [searchTerm, setSearchTerm] = React.useState('');

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('/admin');
                setAdmins(response.data.users);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const filteredAdmins = admins.filter(
        (admin) =>
        (
            admin.username.toUpperCase().includes(searchTerm.toUpperCase()))
    );

    const header = (
        <TableHead>
            <TableRow>
                <TableCell>No. </TableCell>
                <TableCell >Username </TableCell>
                <TableCell />
            </TableRow>
        </TableHead>
    );

    return (
        <>
            <Typography variant="h6" noWrap component="div">
                Daftar Admin
            </Typography>
            <TextField
                label="Cari Username"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                fullWidth
                margin='normal'
            />
            <CustomTable
                header={header}
                data={filteredAdmins}
                renderRow={(row, rowNumber) => (
                    <Row key={rowNumber} row={row} rowNumber={rowNumber} />
                )}
            />
        </>

    );
}

interface AdminData {
    _id: string,
    username: string,

}

interface RowProps {
    row: AdminData;
    rowNumber: number;
}