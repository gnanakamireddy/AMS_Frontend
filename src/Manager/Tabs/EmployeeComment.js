import React, { useEffect, useState } from 'react';
import { Box, TextField } from '@mui/material';
import axios from 'axios';
import { toast } from 'react-toastify';

export const EmployeeComment = ({ objectiveId }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [employeeComments, setEmployeeComments] = useState("");

  const api = process.env.REACT_APP_URL;
  
  useEffect(() => {
    const fetchObjectiveData = async () => {
      try {
        const response = await axios.get(`${api}/api/employee/viewByObjectiveId/${objectiveId}`);
        console.log(response.data)
        const obj = response.data;
        setTitle(obj.title);
        setDescription(obj.description);
      } catch (error) {
        console.error('Error fetching objective data:', error);
        toast.error('Failed to fetch objective data. Please try again.');
      }
    };

    fetchObjectiveData();
  }, [objectiveId]);

  useEffect(() => {
    const fetchCommentData = async () => {
      try {
        const response = await axios.get(`${api}/api/employee/viewevaluation/${objectiveId}`);
        const comment = response.data;
        setEmployeeComments(comment.employeeComments);
      } catch (error) {
        console.error('Error fetching comments:', error);
        toast.error('Failed to fetch comments. Please try again.');
      }
    };

    fetchCommentData();
  }, [objectiveId]);


  return (
    <Box sx={{ mt: 2 }}>
      <form >
        <TextField
          disabled
          label="Objective Title"
          value={title}
          fullWidth
        />
        <TextField
          disabled
          label="Description"
          value={description}
          multiline
          rows={4}
          fullWidth
          margin="normal"
        />
        <TextField
          value={employeeComments}
          label="Self comments"
          onChange={e => setEmployeeComments(e.target.value)}
          fullWidth
          disabled
        />
        
      </form>
    </Box>
  );
};
