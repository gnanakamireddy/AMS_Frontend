import React, { useEffect, useState } from 'react';
import { Box, TextField } from '@mui/material';
import axios from 'axios';
import { toast } from 'react-toastify';

export const EmpSideManagerComment = ({ objectiveId }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [managerComments, setManagerComments] = useState("");

  const api = process.env.REACT_APP_URL;

  useEffect(() => {
    const fetchObjectiveData = async () => {
      try {
        const response = await axios.get(`${api}/api/employee/viewByObjectiveId/${objectiveId}`);
        console.log(response.data);
        const obj = response.data;
        setTitle(obj.title);
        setDescription(obj.description);
      } catch (error) {
        console.error('Error fetching objective data:', error);
        toast.error('Failed to fetch objective data. Please try again.');
      }
    };

    fetchObjectiveData();
  }, [objectiveId,api]);

  useEffect(() => {
    const fetchCommentData = async () => {
      try {
        const response = await axios.get(`${api}/api/manager/managerEvaluation/${objectiveId}`);
        const comment = response.data;
        setManagerComments(comment.managerComments);
        
      } catch (error) {
        console.error('Error fetching comments:', error);
        toast.error('Failed to fetch comments. Please try again.');
      }
    };

    fetchCommentData();
  }, [objectiveId]);

 

  return (
    <Box sx={{ mt: 2 }}>
      
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
          value={managerComments}
          label="Manager comments"
          onChange={e => setManagerComments(e.target.value)}
          fullWidth
          disabled
        />

    </Box>
  );
};
