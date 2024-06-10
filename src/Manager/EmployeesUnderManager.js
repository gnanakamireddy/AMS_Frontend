import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { AppBar, Box,IconButton,  Button, Grid, Menu, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Toolbar, Typography, Paper, TablePagination } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import SettingsIcon from '@mui/icons-material/Settings';
import PersonSharpIcon from '@mui/icons-material/PersonSharp';
import { blue } from '@mui/material/colors';

const EmployeesUnderManager = () => {
    const { employeeId } = useParams();
    const [employees, setEmployees] = useState([]);
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [managerData, setManagerData] = useState(null);
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [name, setName] = useState("");
    const [manager, setManager] = useState("");
    const [managerMail, setManagerMail] = useState("");
    const [managerDesignation, setManagerDesignation] = useState("");

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

    useEffect(() => {
        fetchEmployeeData();
        fetchManagerData();
    }, []);

    const fetchEmployeeData = async () => {
        try {
            const response = await axios.get(`${api}/api/manager/viewEmployees/${employeeId}`);
            setEmployees(response.data);
            setFilteredEmployees(response.data); 
        } catch (error) {
            console.error('Error fetching employee data:', error);
        }
    };

    const fetchManagerData = async () => {
        try {
            const response = await axios.get(`${api}/api/manager/viewEmployeeDetails/${employeeId}`);
            const response1 = await axios.get(`${api}/api/employee/viewByEmployeeId/${employeeId}`);
      setManager(response1.data.firstName);
      setManagerMail(response1.data.email);
      setManagerDesignation(response1.data.designation);
            console.log(response.data)
            setManagerData(response.data);
            setName(response.data.firstName)
        } catch (error) {
            console.error('Error fetching manager data:', error);
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

    const handleMyObjectivesClick = () => {
      console.log(managerData);
        if (managerData && managerData.managerId !== 0) {
            navigate(`/employee/manager/${employeeId}`);
        } else {
            toast.error("You have no manager");
        }
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
            <AppBar sx={{ bgcolor: blue[800] }}>
                <Toolbar sx={{ justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <PersonSharpIcon />
            <Typography variant="h6" component="div" sx={{ ml: 1 }}>
              {name}
            </Typography>
          </Box>
                    <IconButton size="large"color="inherit" onClick={handleSettingsClick}>
            <SettingsIcon size="large"/>
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
            <MenuItem onClick={() => navigate(`/resetPassword/${employeeId}`)}>Change Password</MenuItem>
            <MenuItem onClick={() => navigate('/login')}>Logout</MenuItem>
          </Menu>
                </Toolbar>
            </AppBar>
            <Box sx={{ p: 3, ml: 3, mt: 7 }}>
  {managerData && managerData.managerId !== 0 && (
    <>
      <Typography sx={{ fontFamily: 'Comic Sans' }} variant="h6" gutterBottom>
        Your Manager: {manager}
      </Typography>
      <Typography sx={{ fontFamily: 'Comic Sans' }} variant="body1">
        Email: {managerMail}
      </Typography>
      <Typography sx={{ fontFamily: 'Comic Sans' }} variant="body1">
        Designation: {managerDesignation}
      </Typography>
    </>
  )}
</Box>

            <Box >
                <Typography 
                    variant="h6" 
                    component="div" 
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        color: 'purple', 
                        textDecoration: 'underline', 
                    }}
                >
                    Employees
                </Typography>

                <Grid container display={'flex'} justifyContent={'center'} mt={6}>
                <Paper sx={{elevation:10, maxWidth: "1300px", width: '100%', overflow: 'auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px' }}>
                            <Button 
                                variant="contained" 
                                size='small' 
                                sx={{ backgroundColor: "success.light" }} 
                                color="success"
                                onClick={handleMyObjectivesClick}
                            >
                                My Objectives
                            </Button>
                            <TextField 
                                label="Search" 
                                size='small' 
                                sx={{ marginTop: '3px' }} 
                                value={searchQuery} 
                                onChange={handleSearchChange} 
                            />
                        </div>
                        <TableContainer>
                        <Table stickyHeader>
                        <TableHead>
                                <TableRow>
                                    <TableCell sx={{textAlign: 'center', fontWeight: 'bold', backgroundColor: 'grey', color: 'white' }}>Employee id</TableCell>
                                    <TableCell sx={{textAlign: 'center', fontWeight: 'bold', backgroundColor: 'grey', color: 'white' }}>First Name</TableCell>
                                    <TableCell sx={{textAlign: 'center', fontWeight: 'bold', backgroundColor: 'grey', color: 'white' }}>Last Name</TableCell>
                                    <TableCell sx={{textAlign: 'center', fontWeight: 'bold', backgroundColor: 'grey', color: 'white' }}>Email</TableCell>
                                    <TableCell sx={{textAlign: 'center', fontWeight: 'bold', backgroundColor: 'grey', color: 'white' }}>Designation</TableCell>
                                    <TableCell sx={{textAlign: 'center', fontWeight: 'bold', backgroundColor: 'grey', color: 'white' }}>Department</TableCell>
                                    <TableCell sx={{textAlign: 'center', fontWeight: 'bold', backgroundColor: 'grey', color: 'white' }}>Objectives</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody >
                            {filteredEmployees.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((employee) => (
                                    <TableRow key={employee.employeeId}>
                                        {['employeeId', 'firstName', 'lastName', 'email', 'designation', 'department'].map((field) => (
                                            <TableCell key={field} sx={{ textAlign: 'center' }}>{employee[field]}</TableCell>
                                        ))}
                                 
                                        
                                        <TableCell sx={{textAlign: 'center'}}>
                                            <Button 
                                                variant="contained" 
                                                sx={{ backgroundColor: "warning.light" }} 
                                                color='warning' 
                                                size='small' 
                                                onClick={() => navigate(`/viewApprovalObjective/${employee.employeeId}`)}
                                            >
                                                View
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
            </Box>
        </Box>
    );
};

export default EmployeesUnderManager;
