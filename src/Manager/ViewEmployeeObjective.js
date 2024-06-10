import React, { useEffect, useState } from "react";
import {
  Box, Card, CardActions, CardContent, Button, Typography, TextField, MenuItem, Stack, Dialog, DialogActions, DialogContent, DialogTitle, Tabs, Tab, Divider, AppBar, Toolbar, IconButton, Menu
} from "@mui/material";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { blue } from "@mui/material/colors";
import { EmployeeComment } from "./Tabs/EmployeeComment";
import { ManagerComment } from "./Tabs/ManagerComment";
import { ManagerRating } from "./Tabs/ManagerRating";
import SettingsIcon from '@mui/icons-material/Settings';
import ArrowBackSharpIcon from '@mui/icons-material/ArrowBackSharp';

const stripHTMLTags = (html) => html.replace(/<[^>]*>/g, "");

export const ViewEmployeeObjective = () => {
  const [objectives, setObjectives] = useState([]);
  const [firstName, setFirstName] = useState("");
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(0);
  const [selectedObjective, setSelectedObjective] = useState(null);
  const { employeeId } = useParams();
  const [period, setPeriod] = useState("FY24Q2");
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  const api = process.env.REACT_APP_URL;
  
  const handleSettingsClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClick = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    if (period) {
      fetchObjData();
    }
    fetchEmployeeData();
  }, [employeeId, period]);

  const fetchObjData = async () => {
    try {
      const response = await axios.get(`${api}/api/employee/view/${employeeId}/${period}`);
      setObjectives(response.data);
    } catch (error) {
      console.error("Error fetching employee data:", error);
    }
  };

  const fetchEmployeeData = async () => {
    try {
      const response = await axios.get(`${api}/api/admin/viewByEmployeeId/${employeeId}`);
      
      setFirstName(response.data.firstName);
    } catch (error) {
      console.error("Error fetching employee data:", error);
    }
  };

  const handleOpen = (objective) => {
    setSelectedObjective(objective);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedObjective(null);
  };

  const handlePeriodChange = (event) => setPeriod(event.target.value);

  const handleTabChange = (event, newValue) => setValue(newValue);

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
        <Toolbar sx={{ justifyContent: "center" }}>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, textAlign: "center" }}>
            Objectives
          </Typography>
          <IconButton size="large" color="inherit" onClick={handleSettingsClick}>
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
      <Box sx={{ p: 1 }}>
        <IconButton onClick={() => navigate(-1)} >
          <ArrowBackSharpIcon />Back
        </IconButton></Box>
      <Typography
        variant="h6"
        component="div"
        sx={{
          display: 'flex',
          justifyContent: 'center',
          color: 'black',
          fontFamily: 'Comic Sans MS, Comic Sans, cursive'
        }}
      >
        {firstName}'s objectives
      </Typography>
      <Box sx={{ p: 3, display: "flex", justifyContent: "end", mr: 12, mt: 2}}>
        <TextField
          label="Period"
          size="small"
          select
          value={period}
          onChange={handlePeriodChange}
          sx={{ width: 150, mr: 2 }}
        >
          <MenuItem value="FY24Q1">FY24Q1</MenuItem>
          <MenuItem value="FY24Q2">FY24Q2</MenuItem>
          <MenuItem value="FY24Q3">FY24Q3</MenuItem>
          <MenuItem value="FY24Q4">FY24Q4</MenuItem>
        </TextField>
      </Box>

      <Stack direction="row" spacing={2} p={2} flexWrap="wrap" justifyContent="center">
        {objectives.length === 0 ? (
          <Typography variant="h6" gutterBottom>No objectives yet</Typography>
        ) : (
          objectives
          .filter((item) => item.approvalStatus === "Approved") 
          .map((item) => {
            const strippedDescription = stripHTMLTags(item.description);
            const shortDescription = strippedDescription.length > 30 ? `${strippedDescription.slice(0, 30)}...` : strippedDescription;
            let cardcolor;
            switch (item.status) {
              case "Not Started":
                cardcolor = "#d4d0b4";
                break;
              case "Completed":
                cardcolor = "#add68b";
                break;
              case "In Progress":
                cardcolor = "#f7e454";
                break;
              case "Started":
                cardcolor = "#66c4d9";
                break;
              default:
                cardcolor = "#ffffff";
                break;
            }
            return (
              <Card elevation={10} sx={{ width: "300px", marginBottom: 2, mx: 1 }} key={item.objectiveId}>
                <Box
                  sx={{
                    height: "30px",
                    backgroundColor: cardcolor,
                    backgroundSize: "cover",
                  }}
                ><Typography sx={{color:"white"}} align="center">{item.status}</Typography></Box>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" align="justify">
                    {shortDescription}
                  </Typography>
                </CardContent>
                <CardActions sx={{ display: "flex", justifyContent: "end" }}>
                  <Button size="small" color="primary" onClick={() => handleOpen(item)}>
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
              <Tab label={<div style={{ textAlign: "center", lineHeight: "1" }}>Employee<br />Evaluation</div>} />
              <Tab label={<div style={{ textAlign: "center", lineHeight: "1" }}>Manager<br />Evaluation</div>} />
              <Tab label="Rating" />
            </Tabs>
            <Divider />
          </DialogTitle>
          <DialogContent>
            {value === 0 && <EmployeeComment objectiveId={selectedObjective.objectiveId} />}
            {value === 1 && <ManagerComment objectiveId={selectedObjective.objectiveId} />}
            {value === 2 && <ManagerRating objectiveId={selectedObjective.objectiveId} />}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">Close</Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
};
