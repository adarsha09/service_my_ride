import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Container, 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  Grid, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem,
  Box,
  Alert,
  Snackbar,
  CircularProgress
} from '@mui/material';

function OnlinePayment() {
    // Use useLocation to get query parameters instead of useParams
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const jobcard_no = queryParams.get('jobcard_no');
    const net_amount = queryParams.get('net_amount');
    
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [alertOpen, setAlertOpen] = useState(false);
    const [severity, setSeverity] = useState('success');
    const navigate = useNavigate();
    
    const [paymentDetails, setPaymentDetails] = useState({
        jobcard_no: jobcard_no,
        card_number: '',
        cvv: '',
        expiration_month: '',
        expiration_year: ''
    });

    // Update paymentDetails when jobcard_no changes from URL params
    useEffect(() => {
        setPaymentDetails(prev => ({
            ...prev,
            jobcard_no: jobcard_no
        }));
    }, [jobcard_no]);

    const handlePaymentChange = (e) => {
        setPaymentDetails({
            ...paymentDetails,
            [e.target.name]: e.target.value
        });
    };

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 11 }, (_, i) => currentYear + i);
    
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const processPayment = (e) => {
        e.preventDefault();
        setLoading(true);
        
        const userId = localStorage.getItem('user_id');
        const userName = localStorage.getItem('user_name');

        axios.post('http://localhost:5000/api/process-payment', paymentDetails, {
            headers: {
                'user-id': userId,
                'user-name': userName
            }
        })
        .then(response => {
            setMessage(response.data.message || 'Payment successful');
            setSeverity('success');
            setAlertOpen(true);
            setLoading(false);
            
            // Navigate to invoice page after successful payment
            setTimeout(() => {
                navigate(`/User/Invoice?jobcard_no=${jobcard_no}`);
            }, 1500);
        })
        .catch(error => {
            console.error('Error processing payment:', error);
            setMessage(error.response?.data?.error || 'Payment failed');
            setSeverity('error');
            setAlertOpen(true);
            setLoading(false);
        });
    };

    const handleAlertClose = () => {
        setAlertOpen(false);
    };

    return (
        <Container
  maxWidth={false}
  disableGutters
  sx={{
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #e7a2a2 0%, #90e6ed 100%)',
    p: 0,
    m: 0,
  }}>
            <Paper
    elevation={8}
    sx={{
      p: 5,
      borderRadius: 3,
      background: 'linear-gradient(135deg, #9ac9dd 0%, #8caacf 50%, #d2b592 100%)',
    }}
  >
                 <Typography
      variant="h4"
      align="center"
      gutterBottom
      sx={{ fontWeight: 600, color: 'primary.main' }}
    >
                    Online Payment
                </Typography>
                
                <Box component="form" onSubmit={processPayment} sx={{ mt: 3 }}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Jobcard Number"
                                value={jobcard_no || ''}
                                InputProps={{
                                    readOnly: true,
                                }}
                                variant="outlined"
                            />
                        </Grid>
                        
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Amount to Pay"
                                value={`₹${net_amount || ''}`}
                                InputProps={{
                                    readOnly: true,
                                }}
                                variant="outlined"
                            />
                        </Grid>
                        
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                label="Card Number"
                                name="card_number"
                                value={paymentDetails.card_number}
                                onChange={handlePaymentChange}
                                placeholder="Enter card number"
                                inputProps={{ maxLength: 16 }}
                                variant="outlined"
                            />
                        </Grid>
                        
                        <Grid item xs={12} sm={4}>
                            <TextField
                                required
                                fullWidth
                                label="CVV"
                                name="cvv"
                                value={paymentDetails.cvv}
                                onChange={handlePaymentChange}
                                placeholder="Enter CVV"
                                inputProps={{ maxLength: 3 }}
                                variant="outlined"
                            />
                        </Grid>
                        
                        <Grid item xs={12} sm={4}>
                            <FormControl fullWidth required>
                                <InputLabel id="month-label">Expiration Month</InputLabel>
                                <Select
                                    labelId="month-label"
                                    label="Expiration Month"
                                    name="expiration_month"
                                    value={paymentDetails.expiration_month}
                                    onChange={handlePaymentChange}
                                >
                                    <MenuItem value="">Select Month</MenuItem>
                                    {months.map((month) => (
                                        <MenuItem key={month} value={month}>{month}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        
                        <Grid item xs={12} sm={4}>
                            <FormControl fullWidth required>
                                <InputLabel id="year-label">Expiration Year</InputLabel>
                                <Select
                                    labelId="year-label"
                                    label="Expiration Year"
                                    name="expiration_year"
                                    value={paymentDetails.expiration_year}
                                    onChange={handlePaymentChange}
                                >
                                    <MenuItem value="">Select Year</MenuItem>
                                    {years.map((year) => (
                                        <MenuItem key={year} value={year}>{year}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        
                        <Grid item xs={12} sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                size="large"
                                disabled={loading}
                                sx={{ minWidth: 150 }}
                            >
                                {loading ? <CircularProgress size={24} /> : 'Pay Now'}
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>
            
            <Snackbar open={alertOpen} autoHideDuration={6000} onClose={handleAlertClose}>
                <Alert onClose={handleAlertClose} severity={severity} sx={{ width: '100%' }}>
                    {message}
                </Alert>
            </Snackbar>
        </Container>
    );
}

export default OnlinePayment;