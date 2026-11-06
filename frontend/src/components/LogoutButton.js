import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';

const LogoutButton = () => {
    const navigate = useNavigate();
    const handleLogout = () => {

        // Clear any session-related data

        localStorage.removeItem('userToken'); // Remove stored tokens if any
        
        navigate('/'); // Redirect to login page
 };
 return (
    <Button variant="contained" sx={{background:'red'}} onClick={handleLogout}>Logout</Button>
 );
};
export default LogoutButton;