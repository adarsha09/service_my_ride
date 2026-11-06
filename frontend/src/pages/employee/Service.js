import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Paper, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Button, Dialog, DialogTitle, DialogContent, 
  DialogActions, Grid, TextField, Box, CircularProgress
} from '@mui/material';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import EmployNavbar from '../../components/EmployNavbar';
import { Divider } from '@mui/material';


// Custom styled header section to match the original design
const HeaderSection = styled(Box)(({ theme }) => ({
  backgroundColor: '#162b65',
  color: 'white',
  padding: theme.spacing(8, 0),
  marginBottom: theme.spacing(4),
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    zIndex: 1
  }
}));

const HeaderContent = styled(Box)({
  position: 'relative',
  zIndex: 2,
  textAlign: 'center'
});

const Service = () => {
  const [serviceRequests, setServiceRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [currentRequest, setCurrentRequest] = useState(null);
  const [customerDetails, setCustomerDetails] = useState(null);
  const [jobCardNo] = useState(Math.floor(1000 + Math.random() * 99000)); // Random job card number

  // Mock session data - in a real app, this would come from your authentication system
useEffect(() => {
    // Check if user_id exists in local storage
    const userId = localStorage.getItem('user_id');
    //    localStorage.setItem("user_id", user_id);
    //   localStorage.setItem("user_name", returnedUserName || user_name);
    //   localStorage.setItem("user_type", user_type);
    if (!userId) {
        alert('Kindly login to proceed');
        window.location.href = '/';
        return;
    }

    // Fetch service requests
    fetchServiceRequests();
}, []);

  const fetchServiceRequests = async () => {
    try {
      setLoading(true);
      // In a real app, this would be an API call
      const response = await axios.get('http://localhost:5000/api/initiated-services');
      setServiceRequests(response.data);
    } catch (error) {
      console.error('Error fetching service requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (vehicleNumber, description) => {
    try {
      // In a real app, this would be an API call
      const response = await axios.get(`http://localhost:5000/api/customer-details/${vehicleNumber}`);
      setCustomerDetails(response.data);
      setCurrentRequest({ vehicle_number: vehicleNumber, description });
      setOpenModal(true);
    } catch (error) {
      console.error('Error fetching customer details:', error);
    }
  };

  const handleApproveService = async () => {
    try {
      const currentDate = new Date();
      const formattedDate = currentDate.toISOString().split('T')[0];
      const formattedTime = currentDate.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit', 
        hour12: true 
      });

      // In a real app, this would be an API call
    const employeeName = localStorage.getItem('user_name');
    await axios.post('http://localhost:5000/api/approve-service', {
      jobdate: formattedDate,
      jobstartingtime: formattedTime,
      jobcard_no: jobCardNo,
      customer_name: customerDetails.customer_name,
      vehicle_no: currentRequest.vehicle_number,
      description: currentRequest.description,
      employee_name: employeeName
    });

      // Close modal and refresh data
      setOpenModal(false);
      fetchServiceRequests();
      alert('Service approved and job card assigned successfully');
    } catch (error) {
      console.error('Error approving service:', error);
      alert('Error while approving service. Please try again.');
    }
  };

return (
    <>
    <EmployNavbar/>
<Box sx={{marginLeft:'180px'}}>
        <Container maxWidth="lg" >
            
            <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
                <Typography variant="h4" component="h1" align="center" gutterBottom sx={{ mb: 4 ,mt: 2}}>
                    Services
                </Typography>

                {loading ? (
                    <Box display="flex" justifyContent="center" p={4}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <TableContainer >
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Sl No</TableCell>
                                    <TableCell>Vehicle Number</TableCell>
                                    <TableCell>Description</TableCell>
                                    <TableCell>Requested Date</TableCell>
                                    <TableCell>Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {serviceRequests.length > 0 ? (
                                    serviceRequests.map((request, index) => (
                                        <TableRow key={request.vehicle_number}>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell>{request.vehicle_number}</TableCell>
                                            <TableCell>{request.description}</TableCell>
                                            <TableCell>{new Date(request.date).toLocaleDateString()}</TableCell>
                                            <TableCell>
                                                <Button 
                                                    variant="contained" 
                                                    color="primary"
                                                    sx={{ backgroundColor: 'red', color: '#fff' }}
                                                    onClick={() => handleViewDetails(request.vehicle_number, request.description)}
                                                >
                                                    View
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={5} align="center">No service requests found</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Paper>
        </Container>

        {/* Service Approval Modal */}
        <Dialog 
            open={openModal} 
            onClose={() => setOpenModal(false)}
            maxWidth="md"
            fullWidth
        >
            <DialogTitle>
                Approve Service
                <Button 
                    onClick={() => setOpenModal(false)}
                    sx={{ position: 'absolute', right: 8, top: 8 }}
                >
                    &times;
                </Button>
            </DialogTitle>
            
            <DialogContent dividers>
                {customerDetails && (
                    <Grid container spacing={3}>
                        {/* Customer Details Section */}
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Customer Name"
                                value={customerDetails.customer_name || ''}
                                margin="normal"
                                InputProps={{ readOnly: true }}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Address"
                                value={customerDetails.address || ''}
                                margin="normal"
                                InputProps={{ readOnly: true }}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Contact Number"
                                value={customerDetails.contact_no || ''}
                                margin="normal"
                                InputProps={{ readOnly: true }}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Email"
                                value={customerDetails.email_id || ''}
                                margin="normal"
                                InputProps={{ readOnly: true }}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Vehicle Number"
                                value={currentRequest?.vehicle_number || ''}
                                margin="normal"
                                InputProps={{ readOnly: true }}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Problem"
                                value={currentRequest?.description || ''}
                                margin="normal"
                                InputProps={{ readOnly: true }}
                            />
                        </Grid>

                        {/* Job Card Details Section */}
                        <Grid item xs={12}>
                            <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                                Job Card Details
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Job Card Number"
                                value={jobCardNo}
                                margin="normal"
                                InputProps={{ readOnly: true }}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Starting Time"
                                value={new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
                                margin="normal"
                                InputProps={{ readOnly: true }}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Assign Date"
                                value={new Date().toISOString().split('T')[0]}
                                margin="normal"
                                InputProps={{ readOnly: true }}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Employee Name"
                                value={localStorage.getItem('user_name') || ''}
                                margin="normal"
                                InputProps={{ readOnly: true }}
                            />
                        </Grid>
                    </Grid>
                )}
            </DialogContent>
            
            <DialogActions>
                <Button onClick={() => setOpenModal(false)} color="secondary">
                    Close
                </Button>
                <Button onClick={handleApproveService} color="primary" variant="contained" sx={{ backgroundColor: 'red', color: '#fff' }}>
                    Approve and Assign
                </Button>
            </DialogActions>
        </Dialog>
        </Box>
    </>
);
};

export default Service;