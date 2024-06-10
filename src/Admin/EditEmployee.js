import React, { useEffect, useState } from 'react';
import { Button, Stack, TextField, Typography, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import axios from 'axios';
import { toast } from 'react-toastify';

export const EditEmployee = ({ open, handleClose, employeeId, onEditSuccess }) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [designation, setDesignation] = useState('');
    const [department, setDepartment] = useState('');
    const [managerId, setManagerId] = useState('');

    const api = process.env.REACT_APP_URL;

    useEffect(() => {
        if (open) {
            fetchEmployeeData();
        }
    }, [open,api]);

    const fetchEmployeeData = async () => {
        try {
            const response = await axios.get(`${api}/api/admin/viewByEmployeeId/${employeeId}`);
            const employee = response.data;
            setFirstName(employee.firstName);
            setLastName(employee.lastName);
            setEmail(employee.email);
            setPassword(employee.password);
            setDesignation(employee.designation);
            setDepartment(employee.department);
            setManagerId(employee.managerId);
        } catch (error) {
            console.error('Error fetching employee data:', error);
            toast.error('Failed to fetch employee data. Please try again.');
        }
    };

    const handleEdit = async (e) => {
        e.preventDefault();
        const employeeData = { employeeId, firstName, lastName, email, password, designation, department, managerId };
        try {
            const response = await axios.put(`${api}/api/admin/edit/${employeeId}`, employeeData);
            toast.success('Employee details updated');
            handleClose();
            onEditSuccess();
        } catch (error) {
            console.error('Error editing employee:', error);
            toast.warn("Check the manager id")
            toast.error('Failed to update employee. Please try again.');
        }
    };

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
            <DialogTitle><Typography variant="h6" align="center" color={'purple'} gutterBottom sx={{ textDecoration: 'underline' }}>
                    Edit Employee Details
                </Typography></DialogTitle>
            <DialogContent>
                <form onSubmit={handleEdit}>
                    <Stack spacing={3} mt={2}>
                        <TextField label="First Name" value={firstName} onChange={e => setFirstName(e.target.value)} size="small" fullWidth disabled />
                        <TextField label="Last Name" value={lastName} onChange={e => setLastName(e.target.value)} size="small" fullWidth disabled />
                        <TextField label="Email" value={email} type="email" onChange={e => setEmail(e.target.value)} size="small" fullWidth disabled />
                        <TextField label="Password" value={password} onChange={e => setPassword(e.target.value)} size="small" fullWidth disabled />
                        <TextField label="Designation" value={designation} onChange={e => setDesignation(e.target.value)} size="small" fullWidth />
                        <TextField label="Department" value={department} onChange={e => setDepartment(e.target.value)} size="small" fullWidth />
                        <TextField label="Manager ID" value={managerId} onChange={e => setManagerId(e.target.value)} size="small" fullWidth />
                    </Stack>
                </form>
            </DialogContent>
            <DialogActions>
                <Button variant="contained" color="success" onClick={handleEdit}>
                    Save
                </Button>
                <Button sx={{mr:2}} variant="contained" color="warning" onClick={handleClose}>
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    );
};
