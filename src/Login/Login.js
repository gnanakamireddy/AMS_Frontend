import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, TextField, Button, Typography, Box, Paper } from '@mui/material';
import { toast } from 'react-toastify';
import AssignmentIndSharpIcon from '@mui/icons-material/AssignmentIndSharp';

function Login({ authenticateUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { success, isManager, employeeId, userType } = await authenticateUser(email, password);
    if (success) {
      if (userType === 'admin') {
        toast.success("Welcome Admin!");
        navigate('/admin');
      } else if (isManager) {
        toast.success("Welcome Manager!");
        navigate(`/employee/${employeeId}`);
      } else {
        toast.success("Welcome Employee!");
        navigate(`/employee/${employeeId}`);
      }
    } else {
      toast.error('Invalid login credentials');
    }
  };

  return (
    <Paper sx={{ backgroundImage: 'url(/mountain.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <Container maxWidth="sm" sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box display="flex" justifyContent="center">
          <Paper elevation={20} sx={{ padding: 4, borderRadius: 2, backgroundColor: '#f5f5f5', opacity: 0.9 }}>
            <Typography variant="h4" align="center" gutterBottom sx={{ marginBottom: 3 }}>
              <Box display="flex" alignItems="center" justifyContent="center">
                <AssignmentIndSharpIcon fontSize="large" sx={{ marginRight: 1 }} />
                Login
              </Box>
            </Typography>
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Email"
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                sx={{ marginBottom: 3 }}
              />
              <TextField
                fullWidth
                type="password"
                label="Password"
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                sx={{ marginBottom: 3 }}
              />
              <Button type="submit" variant="contained" color="primary" fullWidth sx={{ padding: 1.5, marginTop: 2 }}>
                Login
              </Button>
              <Link to="/forgotPassword" underline="hover">
                Forgot password?
              </Link>
            </form>
          </Paper>
        </Box>
      </Container>
    </Paper>
  );
}

export default Login;
