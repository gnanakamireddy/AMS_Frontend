import React, { useState, useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import Rating from '@mui/material/Rating';
import axios from 'axios';
import { toast } from 'react-toastify';

export const ManagerRating = ({ objectiveId }) => {
  const [ratingValue, setRatingValue] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const api = process.env.REACT_APP_URL;

  useEffect(() => {
    const fetchRating = async () => {
      try {
        const response = await axios.get(`${api}/api/manager/managerEvaluation/${objectiveId}`);
        const comment = response.data;
        setRatingValue(comment.ratingValue);
        if (comment.ratingValue) {
          setIsSubmitted(true);
        }
      } catch (error) {
        console.error('Error fetching rating:', error);
        toast.error('Failed to fetch rating. Please try again.');
      }
    };

    fetchRating();
  }, [objectiveId]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    const objData = { ratingValue };
    try {
      await axios.put(`${api}/api/manager/managerRating/${objectiveId}`, objData);
      toast.success('Rating updated successfully');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating rating:', error);
      toast.error('Failed to update rating. Please try again.');
    }
  };

  const addRating = async (e) => {
    e.preventDefault();
    const addRating = { ratingValue };
    try {
      await axios.post(`${api}/api/manager/managerRating/${objectiveId}`, addRating);
      toast.success('Rating added successfully');
      setIsSubmitted(true);
    } catch (error) {
      console.error('Error adding rating:', error);
      toast.info("Employee evaluation not yet done");
      toast.error('Failed to add rating');
    }
  };

  return (
    <Box sx={{ mt: 2 }}>
      <form onSubmit={isEditing ? handleSave : addRating}>
        <Typography align="center">
          <Rating name="rating" value={ratingValue} onChange={e=>setRatingValue(e.target.value)}
          readOnly={!isEditing && isSubmitted} defaultValue={2.5} precision={0.5} size="large" />
        </Typography>
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
