import React, { useEffect, useState } from 'react';
import { Box, Button, TextField } from '@mui/material';
import axios from 'axios';
import { toast } from 'react-toastify';

export const ManagerComment = ({ objectiveId }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [managerComments, setManagerComments] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

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
  }, [objectiveId]);

  useEffect(() => {
    const fetchCommentData = async () => {
      try {
        const response = await axios.get(`${api}/api/manager/managerEvaluation/${objectiveId}`);
        const comment = response.data;
        setManagerComments(comment.managerComments);
        if (comment.managerComments) {
          setIsSubmitted(true);
        }
      } catch (error) {
        console.error('Error fetching comments:', error);
        toast.error('Failed to fetch comments. Please try again.');
      }
    };

    fetchCommentData();
  }, [objectiveId]);

  const handleEdit = async () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    const objData = { managerComments };
    try {
      await axios.put(`${api}/api/manager/managerEvaluation/${objectiveId}`, objData);
      toast.success("Comments updated successfully");
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating comments:", error);
      toast.error("Failed to update comments. Please try again.");
    }
  };

  const addComment = async (e) => {
    e.preventDefault();
    const addComments = { managerComments };
    try {
      await axios.post(`${api}/api/manager/managerEvaluation/${objectiveId}`, addComments);
      toast.success("Comment added successfully");
      setIsSubmitted(true);
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.info("Employee evaluation not yet done");
      toast.error("Failed to add comment");
    }
  };

  return (
    <Box sx={{ mt: 2 }}>
      <form onSubmit={isEditing ? handleSave : addComment}>
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
          disabled={!isEditing && isSubmitted}
        />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          {!isSubmitted && !isEditing && (
            <Button sx={{ mr: 2 }} variant="contained" type="submit">Submit</Button>
          )}
          {(isSubmitted || isEditing) && (
            <Button sx={{ mr: 2 }} variant="contained" onClick={isEditing ? handleSave : handleEdit}>
              {isEditing ? 'Save' : 'Edit'}
            </Button>
          )}
        </Box>
      </form>
    </Box>
  );
};
