import React, { useState } from "react";
import { Box, Button, MenuItem, Stack, TextField, Typography, Paper } from "@mui/material";
import axios from "axios";
import { useParams } from "react-router-dom";
import { toast } from 'react-toastify';

const AddObjectives = ({ handleCloseDrawer, onAddSuccess }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [period, setPeriod] = useState("FY24Q1");
  const { employeeId } = useParams();

  const api = process.env.REACT_APP_URL;

  const handleAdd = async (e) => {
    e.preventDefault();
    const newObjective = { title, description, period };
    console.log("New Objective:", newObjective);

    try {
      const response = await axios.post(`${api}/api/employee/add/${employeeId}`, newObjective);
      console.log("Response:", response.data);
      toast.success("Objective added successfully");
      onAddSuccess();
      handleCloseDrawer(); 
    } catch (error) {
      console.error("Error adding objective:", error);
      toast.error("Failed to add objective. Please try again.");
    }
  };

  return (
    <Paper elevation={3} sx={{ padding: 4, margin: 4 }}>
      <Typography
        variant="h6"
        align="center"
        color="purple"
        gutterBottom
        sx={{ textDecoration: 'underline' }}
      >
        Add Objective
      </Typography>
      <form id="add-objective-form" onSubmit={handleAdd}>
        <Stack spacing={3} p={2}>
          <TextField
            label="Period"
            size="small"
            select
            value={period}
            onChange={e => setPeriod(e.target.value)}
            fullWidth
          >
            <MenuItem value="FY24Q1">FY24Q1</MenuItem>
            <MenuItem value="FY24Q2">FY24Q2</MenuItem>
            <MenuItem value="FY24Q3">FY24Q3</MenuItem>
            <MenuItem value="FY24Q4">FY24Q4</MenuItem>
          </TextField>
          <TextField
            label="Objective Title"
            required
            value={title}
            onChange={e => setTitle(e.target.value)}
            size="small"
            fullWidth
          />
          <TextField
            label="Objective Description"
            multiline
            required
            value={description}
            onChange={e => setDescription(e.target.value)}
            size="small"
            fullWidth
          />
        </Stack>
        <Box mt={3} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button sx={{ mr: 2 }} variant="outlined" color="warning" onClick={handleCloseDrawer}>
            Cancel
          </Button>
          <Button variant="outlined" color="success" type="submit">
            Save
          </Button>
        </Box>
      </form>
    </Paper>
  );
};

export default AddObjectives;
