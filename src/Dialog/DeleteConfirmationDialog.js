import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

export const DeleteConfirmationDialog = ({ open, handleClose, handleConfirmDelete }) => {
    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Are you sure you want to delete?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Cancel
                </Button>
                <Button onClick={handleConfirmDelete} color="secondary" autoFocus>
                    Delete
                </Button>
            </DialogActions>
        </Dialog>
    );
};
