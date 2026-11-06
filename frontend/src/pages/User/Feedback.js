import React, { useState,useEffect } from 'react';
import axios from 'axios';
import { TextField, Button, Typography, Paper, Box, Link, FormLabel } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import UserHeader from '../../components/UserHeader';
import UserFooter from '../../components/UserFooter';

const Feedback = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    feedback: '',
    created_on: '',
  });

  const navigate = useNavigate();
  const[editFeedbackId,setEditFeedbackId]=useState(null);
  const[feedback,setFeedback]=useState([]);
  const[open,setOpen]=useState(false);
  const[isEditing,setIsEditing]=useState(false);
    

  
  const fetchFeedback = async () => {
    try {
        const response = await axios.get('http://localhost:5000/api/feedback');
        setFeedback(response.data);
        } catch (error) {
            console.error('Error fetching feedback:', error);
    }
    };
    
    useEffect(()=>{
    fetchFeedback();
},[]);



  const handleClose = () => {
    setOpen(false);
    };


    const handleSubmit = async (e) => {
      e.preventDefault();
    
      if (!formData.name || !formData.email || !formData.feedback) {
        alert("All fields are required!");
        return;
      }
    
      try {
        const feedbackData = {
          name: formData.name,
          email: formData.email,
          feedback: formData.feedback,
          created_on: new Date().toISOString(), // Set current date automatically
        };
    
        const response = await axios.post("http://localhost:5000/api/feedback", feedbackData);
    
        if (response.data.success) {
          fetchFeedback();
          setFormData({ name: "", email: "", feedback: "" }); // Clear form fields
          handleClose();
        }
      } catch (error) {
        console.error("Error saving feedback:", error);
        alert("Failed to submit feedback. Please try again.");
      }
    };
    
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  

  return (
    <>
    <UserHeader/>
      <Box display="flex" justifyContent="center" alignItems="center" height="69vh" bgcolor="white">
        <Paper elevation={3} sx={{ padding: 4, maxWidth: 400, width: '100%', backgroundColor: 'rgba(255, 255, 255, 0.3)' }}>
          <Typography variant="h4" align="center" gutterBottom color="black">
            Feedback
          </Typography>
          <TextField
            label="Name"
            name="name"
            fullWidth
            margin="normal"
            value={formData.name}
            onChange={handleChange}
          />
          <TextField
            label="Email"
            name="email"
            fullWidth
            margin="normal"
            value={formData.email}
            onChange={handleChange}
          />
          <TextField
            variant="outlined"
            label="Write Feedback"
            name="feedback"
            multiline
            rows={3}
            fullWidth
            value={formData.feedback}
            onChange={handleChange}
          />

          <Box display="flex" justifyContent="center" mt={2}>
            <Button variant="contained" color="secondary" sx={{ background: 'red' }} onClick={handleSubmit}>
              Submit Feedback
            </Button>
          </Box>
         
        </Paper>
      </Box>
      <UserFooter/>
    </>
  );
};

export default Feedback;
