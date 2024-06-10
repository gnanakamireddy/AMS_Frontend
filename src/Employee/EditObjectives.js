import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, TextField, Typography } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from 'react-toastify';

const EditObjectives = ({ open, handleClose, objective, fetchObjData }) => {
  const { employeeId } = useParams();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState(""); 

  useEffect(() => {
    if (objective) {
      setTitle(objective.title);
      setDescription(objective.description);
      setStatus(objective.status);
    }
  }, [objective]); 
  const api = process.env.REACT_APP_URL;

  const editObjectiveStatus = async () => {
    const objData = { title, description, status };
    try {
      await axios.put(`${api}/api/employee/edit/${objective.objectiveId}`, objData);
      toast.success("Objective status updated successfully");
      fetchObjData(); 
      handleClose(); 
    } catch (error) {
      console.error("Error updating objective status:", error);
      toast.info('Evaluation already done');
      toast.error("Could not update objective status");
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <DialogTitle>
        <Typography variant="h6" align="center">Edit Objective</Typography>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ p: 2 }}>
          <TextField disabled fullWidth label="Objective Title" value={title} onChange={e => setTitle(e.target.value)} size='small' />
          <TextField disabled sx={{ mt: 2 }} fullWidth label="Objective Description" value={description} multiline onChange={e => setDescription(e.target.value)} size='small' />
          <TextField
            sx={{ mt: 2 }}
            label="Status"
            select
            value={status}
            onChange={e => setStatus(e.target.value)}
            size="small"
            fullWidth
          >
            <MenuItem value="Not Started">Not Started</MenuItem>
            <MenuItem value="Started">Started</MenuItem>
            <MenuItem value="In Progress">In Progress</MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
          </TextField>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">Cancel</Button>
        <Button onClick={editObjectiveStatus} color="success">Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditObjectives;
