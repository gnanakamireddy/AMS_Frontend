import { Box, Button, Grid, Paper, Stack, TextField, Typography } from '@mui/material';
import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const api = process.env.REACT_APP_URL;

  const navigate = useNavigate();

  const send = async (e) => {
    e.preventDefault();

    try {
      const data = { email };
      await axios.post(`${api}/api/admin/forgotPassword`, data);
      toast.success("Check your email for password");
      navigate('/login');
    } catch (error) {
      console.error('Error resetting password: ', error);
      toast.error('Email not found');
    }
  };

  return (
    <Grid container justifyContent="center" alignItems="center" sx={{ minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
      <Paper elevation={10} sx={{ padding: 5, borderRadius: 3, backgroundColor: '#ffffff', maxWidth: '300px', width: '100%' }}>
        <Typography variant="h4" align="center" gutterBottom sx={{ marginBottom: 3, color: 'purple', textDecoration: 'underline' }}>
          Reset Password
        </Typography>
        <form onSubmit={send}>
          <Stack spacing={3}>
            <TextField
              required
              label="Enter email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              size="small"
              fullWidth
            />
            <Box display="flex" justifyContent="space-between" sx={{ marginTop: 2 }}>
              <Button variant="contained" color="success" type="submit">
                Send
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
