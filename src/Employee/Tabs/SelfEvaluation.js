import React, { useEffect, useState } from 'react';
import { Box, Button, TextField } from '@mui/material';
import axios from 'axios';
import { toast } from 'react-toastify';

export const SelfEvaluation = ({ objectiveId }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [employeeComments, setEmployeeComments] = useState("");
  const [approvalStatus, setApprovalStatus] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [managerHasCommented, setManagerHasCommented] = useState(false);

  const api = process.env.REACT_APP_URL;

  useEffect(() => {
    const fetchObjectiveData = async () => {
      try {
        const response = await axios.get(`${api}/api/employee/viewByObjectiveId/${objectiveId}`);
        const obj = response.data;
        setTitle(obj.title);
        setDescription(obj.description);
        setApprovalStatus(obj.approvalStatus);
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
        const response = await axios.get(`${api}/api/employee/viewevaluation/${objectiveId}`);
        const comment = response.data;
        setEmployeeComments(comment.employeeComments);
        if (comment.employeeComments) {
          setIsSubmitted(true);
        }
      } catch (error) {                                                                                                  
        console.error('Error fetching comments:', error);
        toast.error('Failed to fetch comments. Please try again.');
      }
    };

    fetchCommentData();
  }, [objectiveId]);

  useEffect(() => {
    const checkManagerComments = async () => {
      try {
        const response = await axios.get(`${api}/api/manager/managerEvaluation/${objectiveId}`);
        if (response.data.managerComments) {
          setManagerHasCommented(true);
        }
      } catch (error) {
        console.error('Error checking manager comments:', error);
        toast.error('Failed to check manager comments. Please try again.');
      }
    };

    checkManagerComments();
  }, [objectiveId]);

  const handleEdit = async () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    const objData = { employeeComments };
    try {
      await axios.put(`${api}/api/employee/employeeevaluation/${objectiveId}`, objData);
      toast.success("Comments updated successfully");
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating comments:", error);
      toast.error("Failed to update comments. Please try again.");
    }
  };

  const addComment = async (e) => {
    e.preventDefault();
    const addComments = { employeeComments }; 
    try {
      const response = await axios.post(`${api}/api/employee/employeeevaluation/${objectiveId}`, addComments);
      toast.success("Comment added successfully");
      setIsSubmitted(true);
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Failed to add comment. Please try again.");
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
          value={employeeComments}
          label="Self comments"
          onChange={e => setEmployeeComments(e.target.value)}
          fullWidth
          disabled={approvalStatus === "Pending for Approval" || approvalStatus === null || (!isEditing && isSubmitted) || managerHasCommented}
        />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          {!isSubmitted && !isEditing && !managerHasCommented && approvalStatus !== "Pending for Approval" && approvalStatus !== null && (
            <Button sx={{ mr: 2 }} variant="contained" type="submit">Submit</Button>
          )}
          {(isSubmitted || isEditing) && !managerHasCommented && approvalStatus !== "Pending for Approval" && approvalStatus !== null &&(
            <Button sx={{ mr: 2 }} variant="contained" onClick={isEditing ? handleSave : handleEdit}>
              {isEditing ? 'Save' : 'Edit'}
            </Button>
          )}
        </Box>
      </form>
    </Box>
  );
};
