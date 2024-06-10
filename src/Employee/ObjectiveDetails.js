import { Box, Button, TextField, Typography } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import ReactQuill from 'react-quill';
import { Link, useParams } from 'react-router-dom';
export const ObjectiveDetails = () => {
    const {id} = useParams();
    const [objectiveTitle, setObjectiveTitle] = useState('');
    const [description, setDescription] = useState('');

     
  return (
    <Box sx={{padding:15,display:"flex",flexDirection:"column",alignItems:"center"}}>
        <Box sx={{border:1,p:4}}>
        <Box mt={3} sx={{width:"800px"}} >
            <h3>Objective Title: {objectiveTitle}</h3>
        </Box>
        <Box mt={6}>
        <Typography>Objective Description</Typography>
        <ReactQuill style={{height:'200px',width:'800px'}} modules={module} theme="snow"
        onChange={(value) => setDescription(value)} value={description}/>
        </Box>
        <Box mt={8} sx={{display:"flex",justifyContent:"end",width:"800px"}}>
            <Button sx={{mr:2}} variant='outlined' component={Link} to={"/"}>Cancel</Button>
        </Box>
      </Box>
    </Box>
  )
}