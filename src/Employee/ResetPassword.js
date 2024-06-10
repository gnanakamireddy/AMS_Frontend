import { Box, Button, Grid, Paper, Stack, TextField, Typography } from '@mui/material';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

export const ResetPassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [password, setPassword] = useState("");
  const { employeeId } = useParams();
  const navigate = useNavigate();

  const api = process.env.REACT_APP_URL;

  useEffect(() => {
    const fetchEmpPwd = async () => {
      try {
        const response = await axios.get(`${api}/api/admin/viewByEmployeeId/${employeeId}`);
        setPassword(response.data.password);
      } catch (error) {
        console.error('Error fetching objective data:', error);
        toast.error('Failed to fetch employee data. Please try again.');
      }
    };

    fetchEmpPwd();
  }, [employeeId]);

  const reset = async (e) => {
    e.preventDefault();

    if (oldPassword !== password) {
      toast.error("Old password doesn't match");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('New password and confirm password do not match');
      return;
    }

    try {
      const data = { password: newPassword };
      await axios.put(`${api}/api/employee/resetPassword/${employeeId}`, data);
      toast.success("Password reset successfully");
      navigate('/login');
    } catch (error) {
      console.error('Error resetting password: ', error);
      toast.error('Failed to reset password. Please try again.');
    }
  };

  return (
    <Grid container justifyContent="center" alignItems="center" sx={{ minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
      <Paper elevation={10} sx={{ padding: 5, borderRadius: 3, backgroundColor: '#ffffff', maxWidth: '400px', width: '100%' }}>
        <Typography variant="h4" align="center" gutterBottom sx={{ marginBottom: 3, color: 'purple', textDecoration: 'underline' }}>
          Reset Password
        </Typography>
        <form onSubmit={reset}>
          <Stack spacing={3}>
            <TextField
              required
              label="Enter old Password"
              type="password"
              onChange={e => setOldPassword(e.target.value)}
              size="small"
              fullWidth
            />
            <TextField
              required
              label="Enter new Password"
              type="password"
              onChange={e => setNewPassword(e.target.value)}
              size="small"
              fullWidth
            />
            <TextField
              required
              label="Confirm Password"
              type="password"
              onChange={e => setConfirmPassword(e.target.value)}
              size="small"
              fullWidth
            />
            <Box display="flex" justifyContent="space-between" sx={{ marginTop: 2 }}>
              <Button variant="contained" color="success" type="submit">
                Save
              </Button>
              <Button variant="contained" color="warning" onClick={() => navigate(-1)}>
                Cancel
              </Button>
            </Box>
          </Stack>
        </form>
      </Paper>
    </Grid>
  );
};
