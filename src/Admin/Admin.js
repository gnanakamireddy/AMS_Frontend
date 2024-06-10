import {
    Button,
    Grid,
    IconButton,
    Menu,
    MenuItem,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TextField,
    Toolbar,
    Typography,
    AppBar,
    Box
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { DeleteConfirmationDialog } from '../Dialog/DeleteConfirmationDialog';
import SettingsIcon from '@mui/icons-material/Settings';
import { blue } from '@mui/material/colors';
import { EditEmployee } from './EditEmployee';
import { AddEmployee } from './AddEmployee';

export const Admin = () => {
    const [employees, setEmployees] = useState([]);
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [openAddDialog, setOpenAddDialog] = useState(false);

    const api = process.env.REACT_APP_URL;

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleSettingsClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleDelete = async (employeeId) => {
        setSelectedEmployeeId(employeeId);
        setOpenDeleteDialog(true);
    };

    const handleEdit = (employeeId) => {
        setSelectedEmployeeId(employeeId);
        setOpenEditDialog(true);
    };

    const handleEditDialogClose = () => {
        setOpenEditDialog(false);
        setSelectedEmployeeId(null);
    };

    const handleAdd = () => {
        setOpenAddDialog(true);
    };

    const handleAddDialogClose = () => {
        setOpenAddDialog(false);
    };

    const handleConfirmDelete = async () => {
        try {
            await axios.delete(`${api}/api/admin/delete/${selectedEmployeeId}`);
            toast.success('Employee deleted successfully');
            fetchEmployeeData();
            setSelectedEmployeeId(null);
            setOpenDeleteDialog(false);
        } catch (error) {
            console.error('Error deleting employee:', error);
            toast.error('Could not delete! As the employee is a manager');
            setOpenDeleteDialog(false);
        }
    };

    useEffect(() => {
        fetchEmployeeData();
    }, [api]);

    const fetchEmployeeData = async () => {
        try {
            const response = await axios.get(`${api}/api/admin/viewAllEmployees`);
            setEmployees(response.data);
            setFilteredEmployees(response.data);
        } catch (error) {
            console.error('Error fetching employee data:', error);
        }
    };

    const handleSearchChange = (event) => {
        const query = event.target.value.toLowerCase();
        setSearchQuery(query);
        filterEmployees(query);
    };

    const filterEmployees = (query) => {
        const filtered = employees.filter(employee =>
            employee.firstName.toLowerCase().includes(query) ||
            employee.lastName.toLowerCase().includes(query) ||
            employee.employeeId.toString().toLowerCase().includes(query) ||
            employee.email.toLowerCase().includes(query) ||
            employee.designation.toLowerCase().includes(query) ||
            employee.department.toLowerCase().includes(query)
        );
        setFilteredEmployees(filtered);
    };

    return (
        <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#E8E8F3',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
            <AppBar position="static" sx={{ bgcolor: blue[800] }}>
                <Toolbar sx={{ justifyContent: 'center' }}>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1, textAlign: 'center' }}>
                        Welcome Admin!!
                    </Typography>
                    <IconButton size="large" color="inherit" onClick={handleSettingsClick}>
                        <SettingsIcon />
                    </IconButton>
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                    >
                        <MenuItem onClick={() => navigate('/login')}>Logout</MenuItem>
                    </Menu>
                </Toolbar>
            </AppBar>
            <Grid container display={'flex'} justifyContent={'center'} mt={10}>
                <Paper sx={{ maxWidth: "1300px", width: '100%', overflow: 'auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px' }}>
                        <Button
                            variant="contained"
                            size='small'
                            sx={{ backgroundColor: "success.light" }}
                            color="success"
                            onClick={handleAdd}
                        >
                            Add employee
                        </Button>
                        <TextField
                            label="Search"
                            size='small'
                            value={searchQuery}
                            onChange={handleSearchChange}
                        />
                    </div>
                    <TableContainer>
                        <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ textAlign: 'center', fontWeight: 'bold', backgroundColor: 'grey', color: 'white' }}>Employee id</TableCell>
                                <TableCell sx={{ textAlign: 'center', fontWeight: 'bold', backgroundColor: 'grey', color: 'white' }}>First Name</TableCell>
                                <TableCell sx={{ textAlign: 'center', fontWeight: 'bold', backgroundColor: 'grey', color: 'white' }}>Last Name</TableCell>
                                <TableCell sx={{ textAlign: 'center', fontWeight: 'bold', backgroundColor: 'grey', color: 'white' }}>Email</TableCell>
                                <TableCell sx={{ textAlign: 'center', fontWeight: 'bold', backgroundColor: 'grey', color: 'white' }}>Designation</TableCell>
                                <TableCell sx={{ textAlign: 'center', fontWeight: 'bold', backgroundColor: 'grey', color: 'white' }}>Department</TableCell>
                                <TableCell sx={{ textAlign: 'center', fontWeight: 'bold', backgroundColor: 'grey', color: 'white' }}>Manager Id</TableCell>
                                <TableCell sx={{ textAlign: 'center', fontWeight: 'bold', backgroundColor: 'grey', color: 'white' }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>

                            <TableBody>
                                {filteredEmployees.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((employee) => (
                                    <TableRow key={employee.employeeId}>
                                        {['employeeId', 'firstName', 'lastName', 'email',  'designation', 'department', 'managerId'].map((field) => (
                                            <TableCell key={field} sx={{ textAlign: 'center' }}>{employee[field]}</TableCell>
                                        ))}
                                        <TableCell sx={{ textAlign: 'center' }}>
                                            <Button
                                                variant="contained"
                                                sx={{ backgroundColor: "warning.light" }}
                                                color='warning'
                                                size='small'
                                                onClick={() => handleEdit(employee.employeeId)}
                                            >
                                                Edit
                                            </Button> &nbsp;
                                            <Button
                                                variant="contained"
                                                sx={{ backgroundColor: "error.light" }}
                                                color="error"
                                                size='small'
                                                onClick={() => handleDelete(employee.employeeId)}
                                            >
                                                Delete
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        component="div"
                        count={filteredEmployees.length}
                        page={page}
                        onPageChange={handleChangePage}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        rowsPerPageOptions={[5, 10, 15, 20]}
                    />
                </Paper>
            </Grid>
            <DeleteConfirmationDialog
                open={openDeleteDialog}
                handleClose={() => setOpenDeleteDialog(false)}
                handleConfirmDelete={handleConfirmDelete}
            />

             <EditEmployee
                open={openEditDialog}
                handleClose={handleEditDialogClose}
                employeeId={selectedEmployeeId}
                onEditSuccess={fetchEmployeeData} 
            />

            <AddEmployee
                 open={openAddDialog}
                 handleClose={handleAddDialogClose}
                 onAddSuccess={fetchEmployeeData}
            />
        </Box>
    );
};
