import React, { useEffect, useState } from "react";
import {
  Box, Card, CardActions, CircularProgress,IconButton, CardContent, Button, Typography, TextField, MenuItem, Stack, Dialog, DialogActions, DialogContent, DialogTitle, Tabs, Tab, Rating, Divider, AppBar, Toolbar, Menu, Drawer
} from "@mui/material";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { blue, green, grey, yellow } from "@mui/material/colors";
import { toast } from "react-toastify";
import { DeleteConfirmationDialog } from "../Dialog/DeleteConfirmationDialog";
import SettingsIcon from '@mui/icons-material/Settings';
import ArrowBackSharpIcon from '@mui/icons-material/ArrowBackSharp';
import { SelfEvaluation } from "../Employee/Tabs/SelfEvaluation";
import { EmpSideManagerComment } from "../Employee/Tabs/EmpSideManagerComment";
import { EmpSideRating } from "../Employee/Tabs/EmpSideRating";
import PersonSharpIcon from '@mui/icons-material/PersonSharp';
import AddObjectives from "../Employee/AddObjectives";
import EditObjectives from "../Employee/EditObjectives";

const stripHTMLTags = (html) => html.replace(/<[^>]*>/g, "");

export const ManagerObjectives = () => {
  const [objectives, setObjectives] = useState([]);
  const [period, setPeriod] = useState("FY24Q2");
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(0);
  const [selectedObjective, setSelectedObjective] = useState(null);
  const { employeeId } = useParams(); 
  const [selectedObjId, setSelectedObjId] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [name, setName] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [approvalStatus, setApprovalStatus] = useState("");
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [approvalLoading, setApprovalLoading] = useState(false); 

  const api = process.env.REACT_APP_URL;

  const fetchEmployeeData = async () => {
    try {
      const response = await axios.get(`${api}/api/admin/viewByEmployeeId/${employeeId}`);
      setName(response.data.firstName);
    } catch (error) {
      console.error("Error fetching employee data:", error);
    }
  };
    const handleSettingsClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
  
    const handleClick = () => {
      setAnchorEl(null);
    };

  useEffect(() => {
    fetchObjData();
    fetchEmployeeData();
  },[employeeId, period]);

  const fetchObjData = async () => {
    try {
      const response = await axios.get(`${api}/api/employee/view/${employeeId}/${period}`);
      console.log(response.data)
      setObjectives(response.data);
    } catch (error) {
      console.error('Error fetching employee data:', error);
    }
  };

  const handleEditObjective = (objective) => {
    setSelectedObjective(objective);
    setOpenEditDialog(true);
  };
  

  const handleOpen = (objective) => {
    setSelectedObjective(objective);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedObjective(null);
  };

  const handleApproval = async () => {
    setApprovalLoading(true); 
    try {
      const response = await axios.post(`${api}/api/employee/objectiveApproval/${employeeId}/${period}`, { approvalStatus: "Pending for Approval" });
      if (response.data === "Already sent for approval") {
        toast.info("Already sent for approval");
      } else {
        setApprovalStatus("Pending for Approval");
        toast.success("Approval request sent successfully");
      }
      fetchObjData(); 
    } catch (error) {
      console.error("Error sending approval request:", error);
      toast.error("Failed to send approval request");
    } finally {
      setApprovalLoading(false); 
    }
  };

  const handleOpenDrawer = () => {
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
  };

  const handleTabChange = (event, newValue) => setValue(newValue);

  const handlePeriodChange = (event) => setPeriod(event.target.value);

  const handleDeleteObjective = async (objectiveId) => {
    setSelectedObjId(objectiveId);
    setOpenDeleteDialog(true);
  }

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`${api}/api/employee/delete/${selectedObjId}`);
      toast.success('Deleted successfully');
      fetchObjData();
      setSelectedObjId(null);
      setOpenDeleteDialog(false);
    } catch (error) {
      console.error('Error deleting objective:', error);
     
      toast.error('Could not delete');
      setOpenDeleteDialog(false);
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#E8E8F3',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <AppBar position="static" sx={{ bgcolor: blue[800] }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <PersonSharpIcon />
            <Typography variant="h6" component="div" sx={{ ml: 1 }}>
              {name}
            </Typography>
          </Box>
          <IconButton size="large"color="inherit" onClick={handleSettingsClick}>
            <SettingsIcon size="large"/>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClick}
             anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
          >
            <MenuItem onClick={() => navigate(`/resetPassword/${employeeId}`)}>Change Password</MenuItem>
            <MenuItem onClick={() => navigate('/login')}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      
      <Box sx={{ p: 2 }}>
        <IconButton onClick={() => navigate(-1)} >
          <ArrowBackSharpIcon />Back
        </IconButton>
      </Box>
      <Box 
      sx={{ 
        bgcolor: '#f5f5f5', 
        borderRadius: 2, 
        boxShadow: 2, 
        border: '1px solid #ddd',
        p: 2,  
        maxWidth: '400px', 
        mx: 'auto', 
        mt: 3,
        textAlign: 'center'
      }}
    >
      <Typography 
        variant="h6" 
        component="div" 
        sx={{
          color: 'black',  
          fontFamily: 'Comic Sans MS, Comic Sans, cursive'
        }}
      >
        My Objectives
      </Typography>
    </Box>
      <Box sx={{ p: 3, display: "flex", justifyContent: "end", mr: 12, mt: 3 }}>
        <TextField
          label="Period"
          size="small"
          select
          value={period}
          onChange={handlePeriodChange}
          sx={{ width: 150, mr: 2 }}
          disabled={approvalLoading} 
        >
          <MenuItem value="FY24Q1">FY24Q1</MenuItem>
          <MenuItem value="FY24Q2">FY24Q2</MenuItem>
          <MenuItem value="FY24Q3">FY24Q3</MenuItem>
          <MenuItem value="FY24Q4">FY24Q4</MenuItem>
        </TextField>
        <Button variant="contained" color="primary" onClick={handleOpenDrawer} disabled={approvalLoading}
        >
          Add Objective
        </Button>
        <Button sx={{ ml: 2 }} variant="contained" color="primary" onClick={handleApproval} disabled={approvalLoading}>
        {approvalLoading ? <CircularProgress size={24} /> : "Send for approval"}
            </Button>
      </Box>
      {approvalLoading && (  
            <Box
              sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                zIndex: 1200, 
              }}
            />
          )}

      <Stack direction="row" spacing={2} p={2} flexWrap="wrap" justifyContent="center">
        {objectives.length === 0 ? (
          <Typography variant="h6" gutterBottom>No objectives yet</Typography>
        ) : (
          objectives.map((item) => {
            const strippedDescription = stripHTMLTags(item.description);
            const shortDescription = strippedDescription.length > 30 ? `${strippedDescription.slice(0, 30)}...` : strippedDescription;
            let cardColor,cardTitle;
                switch (item.approvalStatus) {
                  case 'Pending for Approval':
                    cardColor = "#7E57C2";
                    cardTitle="Pending for Approval"
                    break;
                  case "Approved":
                    switch(item.status) {
                      case "Not Started":
                        cardColor = grey[600];
                        cardTitle="Not Started"
                        break;
                      case "Completed":
                        cardColor = green[400];
                        cardTitle="Completed"
                        break;
                      case "In Progress":
                        cardColor = yellow[500];
                        cardTitle="In Progress"
                        break;
                      case "Started":
                        cardColor = blue[300];
                        cardTitle="Started"
                        break;
                      default:
                        cardColor = grey[600];
                        cardTitle="Not Started"
                        break;
                    }
                    break;
                  case "Declined":
                    cardColor= "#D07E7E";
                    cardTitle="Objective Declined"
                    break;
                  default:
                    cardColor= "#CAA2D0 ";
                    cardTitle="Send for Approval"
                    break;
                }
            return (
              <Card elevation={10} sx={{ width: "300px", marginBottom: 2 }} key={item.objectiveId}>
                <Box
                  sx={{
                    height: "30px",
                    backgroundColor: cardColor,
                    backgroundSize: "cover",
                  }}
                ><Typography sx={{color:"white"}} align="center">{cardTitle}</Typography></Box>
                <CardContent>
                  <Typography variant="h6" gutterBottom >
                    {item.title}
                  </Typography>
                  <Typography variant="body2" align="justify">
                    {shortDescription}
                  </Typography>
                </CardContent>
                <CardActions sx={{ display: "flex", justifyContent: "end" }}>
                  <Button size="small" color="error" onClick={() => handleDeleteObjective(item.objectiveId)}  disabled={approvalLoading}>
                    Delete
                  </Button>
                   {item.approvalStatus !== "Pending for Approval" && item.approvalStatus !== null && item.approvalStatus !== "Declined" &&(
                          <Button
                            size="small"
                            color="success"
                            onClick={() => handleEditObjective(item)}
                            disabled={approvalLoading}
                          >
                            Edit
                          </Button>
                        )}
                  <Button size="small" color="primary" onClick={() => handleOpen(item)} disabled={approvalLoading}>
                    More
                  </Button>
                </CardActions>
              </Card>
            );
          })
        )}
      </Stack>

      {selectedObjective && (
        <Dialog open={open} onClose={handleClose} fullWidth>
          <DialogTitle>
            <Divider />
            <Tabs value={value} onChange={handleTabChange} centered>
              <Tab label={<div style={{ textAlign: "center", lineHeight: "1" }}>Self<br />Evaluation</div>} />
              <Tab label={<div style={{ textAlign: "center", lineHeight: "1" }}>Manager<br />Evaluation</div>} />
              <Tab label="Rating" />
            </Tabs>
            <Divider />
          </DialogTitle>
          <DialogContent>
            {value === 0 && <SelfEvaluation objectiveId={selectedObjective.objectiveId} />}
            {value === 1 && <EmpSideManagerComment objectiveId={selectedObjective.objectiveId}/>}
            {value === 2 && <EmpSideRating objectiveId={selectedObjective.objectiveId}/>}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">Close</Button>
          </DialogActions>
        </Dialog>
      )}
      <DeleteConfirmationDialog 
        open={openDeleteDialog} 
        handleClose={() => setOpenDeleteDialog(false)} 
        handleConfirmDelete={handleConfirmDelete} 
      />
     <Drawer anchor="left" open={drawerOpen} onClose={handleCloseDrawer}>
            <Box sx={{ width: 300, p: 2 }}>
              <AddObjectives handleCloseDrawer={handleCloseDrawer} onAddSuccess={fetchObjData} />
            </Box>
          </Drawer>
          <EditObjectives
  open={openEditDialog}
  handleClose={() => setOpenEditDialog(false)}
  objective={selectedObjective}
  fetchObjData={fetchObjData}
/>
   </Box>
  );
};
