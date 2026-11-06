import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
    Container, 
    Typography, 
    Paper, 
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow,
    Button,
    Box,
    Alert,
    CircularProgress
} from '@mui/material';
import UserHeader from '../../components/UserHeader';
import UserFooter from '../../components/UserFooter';

function ViewStatus() {
    const [pendingPayments, setPendingPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Check if user is logged in
        const userName = localStorage.getItem('user_name');
        if (!userName) {
            setError('Please login to view your status');
            setLoading(false);
            return;
        }
        fetchPendingPayments();
    }, []);

    const fetchPendingPayments = () => {
        const userName = localStorage.getItem('user_name');
        
        setLoading(true);
        axios.get('http://localhost:5000/api/view-status', {
            params: {
                username: userName
            }
        })
        .then(response => {
            if (response.data.pendingPayments) {
                setPendingPayments(response.data.pendingPayments);
            } else if (response.data.message) {
                setPendingPayments([]);
            }
            setLoading(false);
        })
        .catch(error => {
            if (error.response && error.response.status === 401) {
                setError('Unauthorized. Please log in to proceed.');
                // Optionally redirect to login
                navigate('/login');
            } else {
                setError('Failed to load pending payments. Please try again later.');
                console.error('Error fetching payments:', error);
            }
            setLoading(false);
        });
    };

    const handlePaymentClick = (jobcardNo, netAmount) => {
        navigate(`/User/OnlinePayment?jobcard_no=${jobcardNo}&net_amount=${netAmount}`);
    };

    return (
<>
<UserHeader />
        <Container maxWidth="lg" sx={{ my: 4 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom align="center">
                    View Status
                </Typography>
                
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                        <CircularProgress />
                    </Box>
                ) : error ? (
                    <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>
                ) : (
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow sx={{ backgroundColor: 'red' }}>
                                    <TableCell sx={{ color: 'white' }}>Jobcard Number</TableCell>
                                    <TableCell sx={{ color: 'white' }}>Vehicle Number</TableCell>
                                    <TableCell sx={{ color: 'white' }}>Date</TableCell>
                                    <TableCell sx={{ color: 'white' }}>Net Amount</TableCell>
                                    <TableCell sx={{ color: 'white' }}>Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {pendingPayments.length > 0 ? (
                                    pendingPayments.map((payment) => (
                                        <TableRow key={payment.jobcard_no} hover>
                                            <TableCell>{payment.jobcard_no}</TableCell>
                                            <TableCell>{payment.vehicle_number}</TableCell>
                                            <TableCell>{new Date(payment.jobdate).toLocaleDateString()}</TableCell>
                                            <TableCell>₹{Number(payment.net_total).toFixed(2)}</TableCell>
                                            <TableCell>
                                                <Button 
                                                    variant="contained" 
                                                    color="error"
                                                    onClick={() => handlePaymentClick(payment.jobcard_no, payment.net_total)}
                                                >
                                                    Pay
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={5} align="center">
                                            No pending payments found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Paper>
        </Container>
        <UserFooter />
    </>
    );
}

export default ViewStatus;