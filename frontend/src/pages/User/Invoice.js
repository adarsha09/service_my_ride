import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
    Container, 
    Paper, 
    Typography, 
    Divider, 
    Box, 
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow,
    Button,
    Alert
} from '@mui/material';

function Invoice() {
        const [invoice, setInvoice] = useState(null);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState('');
        const navigate = useNavigate();
        
        // Get jobcard_no from query parameters instead of route parameters
        const location = useLocation();
        const queryParams = new URLSearchParams(location.search);
        const jobcard_no = queryParams.get('jobcard_no');

        useEffect(() => {
                const userName = localStorage.getItem('user_name');

                if (!jobcard_no) {
                    setError('Missing job card number');
                    setLoading(false);
                    return;
                }

                setLoading(true);
                axios.get(`http://localhost:5000/api/invoice/${jobcard_no}`, {
                        headers: {
                                'user-name': userName
                        }
                })
                .then(response => {
                        setInvoice(response.data.invoice);
                        setLoading(false);
                })
                .catch(error => {
                        console.error('Error fetching invoice:', error);
                        setError('Failed to load invoice. Please try again later.');
                        setLoading(false);
                });
        }, [jobcard_no]);

        const handleGoBack = () => {
                navigate('/User/ViewStatus', { replace: true });
        };

        if (loading) return <Typography variant="h6" align="center" sx={{ my: 4 }}>Loading invoice...</Typography>;
        if (error) return <Alert severity="error">{error}</Alert>;
        if (!invoice) return <Alert severity="info">No invoice data found</Alert>;

        return (
                <Container maxWidth="md" sx={{ my: 4 }}>
                        <Paper elevation={3} sx={{
      p: 5,
      borderRadius: 3,
      width: '100%',
      background: 'linear-gradient(135deg, #fdfbfb 0%, #b0c4de 100%)',
    }}>
                                <Typography variant="h4" align="center" gutterBottom>Invoice</Typography>
                                
                                <Box sx={{ bgcolor: 'success.main', color: 'white', p: 2, borderRadius: 1, mb: 3, textAlign: 'center' }}>
                                        <Typography variant="h5">Payment Successful!</Typography>
                                        <Typography variant="body1">Thank you for your payment.</Typography>
                                </Box>
                                
                                <Typography variant="h6" gutterBottom>Bill To:</Typography>
                                <Box sx={{ mb: 3 }}>
                                        <Typography><strong>Customer Name:</strong> {invoice.customer_name}</Typography>
                                        <Typography><strong>Address:</strong> {invoice.address}</Typography>
                                        <Typography><strong>Email:</strong> {invoice.email_id}</Typography>
                                        <Typography><strong>Phone:</strong> {invoice.contact_no}</Typography>
                                </Box>
                                
                                <Divider sx={{ my: 2 }} />
                                
                                <Typography variant="h6" gutterBottom>Job Details:</Typography>
                                <Box sx={{ mb: 3 }}>
                                        <Typography><strong>Job Card Number:</strong> {invoice.jobcard_no}</Typography>
                                        <Typography><strong>Vehicle Number:</strong> {invoice.vehicle_number}</Typography>
                                        <Typography><strong>Job Date:</strong> {invoice.jobdate}</Typography>
                                </Box>
                                
                                <TableContainer component={Paper} sx={{ mb: 3 }}>
                                        <Table>
                                                <TableHead>
                                                        <TableRow sx={{ bgcolor: 'grey.100' }}>
                                                                <TableCell><strong>Description</strong></TableCell>
                                                                <TableCell align="right"><strong>Amount</strong></TableCell>
                                                        </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                        <TableRow>
                                                                <TableCell>Service Total</TableCell>
                                                                <TableCell align="right">{invoice.net_total}</TableCell>
                                                        </TableRow>
                                                        <TableRow>
                                                                <TableCell><strong>Total Amount</strong></TableCell>
                                                                <TableCell align="right"><strong>{invoice.net_total}</strong></TableCell>
                                                        </TableRow>
                                                </TableBody>
                                        </Table>
                                </TableContainer>
                                
                                <Box sx={{ textAlign: 'center', mt: 4 }}>
                                        <Typography variant="body1" sx={{ mb: 2 }}>Thank you for your business!</Typography>
                                        <Button variant="contained" color="primary" onClick={handleGoBack}>
                                                Back to View Status
                                        </Button>
                                </Box>
                        </Paper>
                </Container>
        );
}

export default Invoice;