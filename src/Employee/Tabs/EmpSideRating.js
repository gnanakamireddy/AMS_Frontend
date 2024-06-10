import React, { useState, useEffect } from 'react';
import { Box, Typography} from '@mui/material';
import Rating from '@mui/material/Rating';
import axios from 'axios';
import { toast } from 'react-toastify';

export const EmpSideRating = ({ objectiveId }) => {
  const [ratingValue, setRatingValue] = useState('');

  const api = process.env.REACT_APP_URL;

  useEffect(() => {
    const fetchRating = async () => {
      try {
        const response = await axios.get(`${api}/api/manager/managerEvaluation/${objectiveId}`);
        const comment = response.data;
        setRatingValue(comment.ratingValue);
      } catch (error) {
        console.error('Error fetching rating:', error);
        toast.error('Failed to fetch rating. Please try again.');
      }
    };

    fetchRating();
  }, [objectiveId]);

 
  
  return (
    <Box sx={{ mt: 2 }}>
      
        <Typography align="center">
          <Rating name="rating" value={ratingValue} onChange={e=>setRatingValue(e.target.value)}
          readOnly defaultValue={2.5} precision={0.5} size="large" />
        </Typography>
       
    </Box>
  );
};
