import {
    AppBar, Box, Button, Card, CardActions, CardContent, Dialog,
    DialogActions, DialogContent, DialogTitle, Divider, IconButton,
    Menu, MenuItem, Stack, Tab, Tabs, TextField, Toolbar, Typography, CircularProgress
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import ArrowBackSharpIcon from '@mui/icons-material/ArrowBackSharp';
import SettingsIcon from '@mui/icons-material/Settings';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { blue, green } from '@mui/material/colors';
import { toast } from "react-toastify";

const stripHTMLTags = (html) => html.replace(/<[^>]*>/g, "");

export const ApprovalPage = () => {
    const [approvalStatus, setApprovalStatus] = useState("");
    const [objectives, setObjectives] = useState([]);
    const [firstName, setFirstName] = useState("");
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(0);
    const [selectedObjective, setSelectedObjective] = useState(null);
    const { employeeId } = useParams();
    const [period, setPeriod] = useState("FY24Q2");
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);
    const [loading, setLoading] = useState(false);
    const [approvalLoading, setApprovalLoading] = useState(false);

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
        setLoading(true);
        try {
            const response = await axios.get(`${api}/api/employee/view/${employeeId}/${period}`);
            setObjectives(response.data);
        } catch (error) {
            console.error("Error fetching employee data:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchEmployeeData = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${api}/api/admin/viewByEmployeeId/${employeeId}`);
            setFirstName(response.data.firstName);
        } catch (error) {
            console.error("Error fetching employee data:", error);
        } finally {
            setLoading(false);
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

    const handleApproval = async (objectiveId) => {
        try {
            setApprovalLoading(true); 
            const response = await axios.put(`${api}/api/manager/objectiveApproval/${employeeId}/${period}/${objectiveId}`, { approvalStatus: "Approved" });
            if (response.data === "Already approved") {
                toast.info("Already approved");
            } else {
                setApprovalStatus("Approved");
                toast.success("Approved successfully");
                handleClose();
            }
            fetchObjData();
        } catch (error) {
            console.error("Error sending approval request:", error);
            toast.error("Failed to approve");
        } finally {
            setApprovalLoading(false); 
        }
    };
    
    const handleApprovalDecline = async (objectiveId) => {
        try {
            setApprovalLoading(true); 
            const response = await axios.put(`${api}/api/manager/objectiveApproval/${employeeId}/${period}/${objectiveId}`, { approvalStatus: "Declined" });
            if (response.data === "Already Declined") {
                toast.info("Already declined");
            } else {
                setApprovalStatus("Declined");
                toast.success("Declined successfully");
                handleClose();
            }
            fetchObjData();
        } catch (error) {
            console.error("Error sending approval request:", error);
            toast.error("Failed to decline");
        } finally {
            setApprovalLoading(false); 
        }
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
                position: 'relative'
            }}
        >
            <AppBar position="static" sx={{ bgcolor: blue[800] }}>
                <Toolbar sx={{ justifyContent: "center" }}>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1, textAlign: "center" }} />
                    <IconButton size="large" color="inherit" onClick={handleSettingsClick}>
                        <SettingsIcon size="large" />
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
            {loading || approvalLoading ? (
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        zIndex: 1200,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <CircularProgress />
                </Box>
            ) : null}
            <>
                <Box sx={{ p: 1 }}>
                    <IconButton onClick={() => navigate(-1)}>
                        <ArrowBackSharpIcon />Back
                    </IconButton>
                </Box>
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
                    {firstName}'s objectives for approval
                </Typography>
                <Box sx={{ p: 3, display: "flex", justifyContent: "space-between", mr: 12, mt: 2 }}>
                    <Button variant='contained' sx={{ order: 1 }} onClick={() => navigate(`/viewObjective/${employeeId}`)}>Objectives</Button>
                    <Box sx={{ display: "flex", alignItems: "center", order: 2 }}>
                        <TextField
                            label="Period"
                            size="small"
                            select
                            value={period}
                            onChange={handlePeriodChange}
                            sx={{ width: 150 }}
                            disabled={approvalLoading}
                        >
                            <MenuItem value="FY24Q1">FY24Q1</MenuItem>
                            <MenuItem value="FY24Q2">FY24Q2</MenuItem>
                            <MenuItem value="FY24Q3">FY24Q3</MenuItem>
                            <MenuItem value="FY24Q4">FY24Q4</MenuItem>
                        </TextField>
                    </Box>
                </Box>

                <Stack direction="row" spacing={2} p={2} flexWrap="wrap" justifyContent="center">
                    {objectives.length === 0 ? (
                        <Typography variant="h6" gutterBottom>No objectives yet</Typography>
                    ) : (
                        objectives.map((item) => {
                            const strippedDescription = stripHTMLTags(item.description);
                            const shortDescription = strippedDescription.length > 30 ? `${strippedDescription.slice(0, 30)}...` : strippedDescription;
                            let cardcolor;
                            switch (item.approvalStatus) {
                                case "Pending for Approval":
                                    cardcolor = "#d4d0b4";
                                    break;
                                case "Declined":
                                    cardcolor = "#D07E7E";
                                    break;
                                case "Approved":
                                    cardcolor = green[400];
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
                                    ><Typography sx={{ color: "white" }} align="center">{item.approvalStatus}</Typography></Box>
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
                    <Dialog open={open} onClose={handleClose}>
                        <DialogTitle>
                            <Tabs value={value} onChange={handleTabChange} centered>
                                <Tab label={<div style={{ textAlign: "center", lineHeight: "1" }}>Objective Description</div>} />
                            </Tabs>
                            <Divider />
                        </DialogTitle>
                        <DialogContent>
                            {selectedObjective.description}
                        </DialogContent>
                        <DialogActions>
                        <Button
                            onClick={() => handleApproval(selectedObjective.objectiveId)}
                            disabled={selectedObjective.approvalStatus === "Approved" || selectedObjective.approvalStatus === "Declined" || approvalLoading}
                        >
                            {approvalLoading && selectedObjective.approvalStatus === "Approved" ? (
                                <CircularProgress size={24} />
                            ) : (
                                "Approve"
                            )}
                        </Button>
                        <Button
                            onClick={() => handleApprovalDecline(selectedObjective.objectiveId)}
                            disabled={selectedObjective.approvalStatus === "Declined" || selectedObjective.approvalStatus === "Approved" || approvalLoading}
                        >
                            {approvalLoading && selectedObjective.approvalStatus === "Declined" ? (
                                <CircularProgress size={15} />
                            ) : (
                                "Decline"
                            )}
                        </Button>

                        </DialogActions>
                    </Dialog>
                )}
            </>
        </Box>
    );
};

