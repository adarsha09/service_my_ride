import React, { useEffect, useState } from "react";
import{DataGrid}from '@mui/x-data-grid';
import { IconButton,Button,Dialog,DialogActions,DialogContent,DialogTitle,TextField,FormLabel } from "@mui/material";
import{Edit,Delete} from'@mui/icons-material';
import axios from'axios';
import AdminNavbar from "../../components/AdminNavbar";

const ManageFeedback=()=>{
    const[feedback,setFeedback]=useState([]);
    const[open,setOpen]=useState(false);
    const[formData,setFormData]=useState({name:"",email:"",feedback:"", joinDate:""});
    const[isEditing,setIsEditing]=useState(false);
    const[editFeedbackId,setEditFeedbackId]=useState(null);


   
    // const fetchFeedback = async () => {
    //     try {
    //         const response = await axios.get('http://localhost:5000/api/feedback');
    //         setFeedback(response.data);
    //         } catch (error) {
    //             console.error('Error fetching feedback:', error);
    //     }
    //     };
        
        useEffect(() => {
            fetchFeedback();
        }, []);

        const formatFeedbackDates = (feedbackData) => {
            return feedbackData.map(item => ({
            ...item,
            created_at: new Date(item.created_at).toLocaleDateString('en-GB') // Format as DD/MM/YYYY
            }));
        };

        const fetchFeedback = async () => {
            try {
            const response = await axios.get('http://localhost:5000/api/feedback');
            const formattedFeedback = formatFeedbackDates(response.data);
            setFeedback(formattedFeedback);
            } catch (error) {
            console.error('Error fetching feedback:', error);
            }
        };


        const handleOpen = () => {
            setIsEditing(false);
            setFormData({ name:"", email:"", feedback:"", joinDate:"" });
            setOpen(true);
            };

        const handleClose = () => {
            setOpen(false);
            };

            
        const handleChange = (e) => {
            const { name, value } = e.target;
            setFormData((prev) => ({ ...prev, [name]: value }));
            };


            const handleSubmit = async (e) => {
                e.preventDefault();
            
                try {
                    const feedbackData = {
                        name: formData.name,
                        email: formData.email,
                        feedback: formData.feedback,
                        created_on: isEditing ? formData.created_on : new Date().toISOString(), // ✅ Set date only when adding new feedback
                    };
            
                    if (isEditing) {
                        const response = await axios.put(`http://localhost:5000/api/updatefeedback/${editFeedbackId}`, feedbackData);
                        if (response.data.success) {
                            fetchFeedback();
                            handleClose();
                        }
                    } else {
                        await axios.post("http://localhost:5000/api/feedback", feedbackData);
                        fetchFeedback();
                        handleClose();
                    }
                } catch (error) {
                    console.error("Error saving feedback:", error);
                }
            };
            
            const handleEdit = (id) => {
                const feedbackItem = feedback.find((item) => item.feedback_id === id);
                if (!feedbackItem) return;
            
                setFormData({ 
                    name: feedbackItem.name, 
                    email: feedbackItem.email, 
                    feedback: feedbackItem.feedback, 
                    created_on: feedbackItem.created_on  
                });
            
                setEditFeedbackId(id);
                setIsEditing(true);
                setOpen(true);
            };
            
            


            const handleDelete = async (id) => {
                try {
                    await axios.delete(`http://localhost:5000/api/feedback/${id}`);
                    setFeedback((prev) => prev.filter(item => item.feedback_id !== id)); // ✅ Update UI instantly
                } catch (error) {
                    console.error("Error deleting feedback:", error);
                }
            };

            
            
            

    const columns = [
        { field: "id", headerName: "ID", width: 70 },
        { field: "name", headerName: "Name", width: 200 },
        { field: "email", headerName: "Email", width: 250 },
        { field: "feedback", headerName: "Feedback", width: 300 },
        { field: "created_at",headerName: "Created On",width:150},
    ];


                    return (
                        <div style={{ display: 'flex', minHeight: '100vh', background: 'linear-gradient(135deg, #b277e7 30%, #ff6a00 130%)' }}>
                            <AdminNavbar />
                            <div style={{ marginLeft: '270px', padding: '24px', width: '100%' }}>
                                <h2 style={{ fontWeight: 600, marginBottom: '16px', color: '#37474f' }}>Manage Feedback</h2>
                    
                               
                    
                                <div style={{ height: 600, width: '90%' }}>
                                <DataGrid 
                                    rows={feedback} 
                                    columns={columns} 
                                    pageSize={5} 
                                    checkboxSelection 
                                    getRowId={(row) => row.id}
                                    sx={{
  '& .MuiDataGrid-columnHeaders': {
    backgroundColor: '#fbc02d',   // golden yellow like Manage Vehicle
    color: '#000',                // black text for visibility
    fontWeight: 'bold',
    fontSize: '1rem',
    textAlign: 'center',
  },
  '& .MuiDataGrid-columnHeaderTitle': {
    fontWeight: 'bold',
    color: '#000',
  },
  '& .MuiDataGrid-row:hover': {
    backgroundColor: '#d799cf', // lighter yellow on hover
    transform: 'scale(1.01)',
    transition: 'all 0.3s ease-in-out',
    boxShadow: '0 0 12px rgba(220, 100, 45, 0.6)',
  },
  '& .MuiDataGrid-cell': {
    fontSize: '0.95rem',
    color: '#000000',
  },
}}

                                />

                                </div>
                    
                                {/* Add/Edit User Dialog */}
                                <Dialog open={open} onClose={handleClose}>
                                    <DialogTitle>{isEditing ? 'Edit Feedback' : 'Add Feedback'}</DialogTitle>
                                    <DialogContent>
                                        <form onSubmit={handleSubmit}>
                                            <TextField
                                                margin="dense"
                                                label="Name"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                fullWidth
                                                required
                                            />
                    
                                            <TextField
                                                margin="dense"
                                                label="Email"
                                                name="email"
                                                type="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                fullWidth
                                                required
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
                    
                                            {/* Buttons inside the form to ensure submission works */}
                                            <DialogActions>
                                                <Button onClick={handleClose} color="secondary">Cancel</Button>
                                                <Button type="submit" color="primary">
                                                    {isEditing ? 'Update' : 'Add'}
                                                </Button>
                                            </DialogActions>
                                        </form>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </div>
                    );
                    
};
export default ManageFeedback;