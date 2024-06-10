import {
    Button,
    Stack,
    TextField,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from '@mui/material';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

export const AddEmployee = ({ open, handleClose, onAddSuccess }) => {
    const [employeeId, setEmployeeId] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [designation, setDesignation] = useState('');
    const [department, setDepartment] = useState('');
    const [managerId, setManagerId] = useState('');

    const api = process.env.REACT_APP_URL;

    const resetForm = () => {
        setEmployeeId('');
        setFirstName('');
        setLastName('');
        setEmail('');
        setPassword('');
        setDesignation('');
        setDepartment('');
        setManagerId('');
    };

    useEffect(() => {
        if (!open) {
            resetForm();
        }
    }, [open,api]);

    const handleAdd = async (e) => {
        e.preventDefault();

        const employeeData = {
            employeeId,
            firstName,
            lastName,
            email,
            password,
            designation,
            department,
            managerId
        };

        try {
            const response = await axios.post(`${api}/api/admin/register`, employeeData);
            console.log('Response:', response.data);
            toast.success('New employee details added');
            handleClose();
            onAddSuccess();
        } catch (error) {
            console.error('Error adding employee:', error);
            toast.info("Check the employee details")
            toast.error('Failed to add employee. Please try again.');
        }
    };

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
            <DialogTitle>
                <Typography
                    variant="h6"
                    align="center"
                    color={'purple'}
                    gutterBottom
                    sx={{ textDecoration: 'underline' }}
                >
                    Add Employee Details
                </Typography>
            </DialogTitle>
            <DialogContent>
                <form id="add-employee-form" onSubmit={handleAdd}>
                    <Stack spacing={3} p={2}>
                        <TextField
                            label="Emp ID"
                            required
                            value={employeeId}
                            onChange={e => setEmployeeId(e.target.value)}
                            size="small"
                            fullWidth
                        />
                        <TextField
                            label="First Name"
                            required
                            value={firstName}
                            onChange={e => setFirstName(e.target.value)}
                            size="small"
                            fullWidth
                        />
                        <TextField
                            label="Last Name"
                            required
                            value={lastName}
                            onChange={e => setLastName(e.target.value)}
                            size="small"
                            fullWidth
                        />
                        <TextField
                            label="Email"
                            type="email"
                            required
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            size="small"
                            fullWidth
                        />
                        <TextField
                            label="Designation"
                
                            value={designation}
                            onChange={e => setDesignation(e.target.value)}
                            size="small"
                            fullWidth
                        />
                        <TextField
                            label="Department"
                            required
                            value={department}
                            onChange={e => setDepartment(e.target.value)}
                            size="small"
                            fullWidth
                        />
                        <TextField
                            label="Manager ID"
                            value={managerId}
                            onChange={e => setManagerId(e.target.value)}
                            size="small"
                            fullWidth
                        />
                    </Stack>
                </form>
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" color="success" type="submit" form="add-employee-form">
                    Add
                </Button>
                <Button sx={{ mr: 4}} variant="outlined" color="warning" onClick={handleClose}>
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    );
};
