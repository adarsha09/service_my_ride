import React, { useState,useEffect } from 'react';
import axios from 'axios';
import { TextField, Button, Typography, Paper, Box, Link, FormLabel,Container,Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import UserHeader from '../../components/UserHeader';
import UserFooter from '../../components/UserFooter';

const UserSettings = () => {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const handlePasswordChange = async () => {
        setErrorMessage("");
        setSuccessMessage("");
    
        // Basic validation
        if (newPassword !== confirmPassword) {
            setErrorMessage("New password and confirm password do not match.");
            return;
        }
        if (newPassword.length < 6) {
            setErrorMessage("Password should be at least 6 characters long.");
            return;
        }
    
        try {
            // Retrieve user_id from localStorage
            const user_id = localStorage.getItem("user_id");
    
            const response = await axios.post("http://localhost:5000/api/password/change-password-employee", {
                user_id, // Include user_id in the payload
                currentPassword,
                newPassword,
            });
    
            if (response.data.success) {
                setSuccessMessage("Password changed successfully!");
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
            } else {
                setErrorMessage(response.data.message || "Incorrect current password.");
            }
        } catch (error) {
            setErrorMessage(error.response?.data?.message || "An error occurred. Please try again.");
        }
    };
    
  

  return (
    <>
    <UserHeader/>
    <Container maxWidth="sm">
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        minHeight: "60vh",
                    }}
                >
                    <Box sx={{ width: "100%", mt: 4, backgroundColor: "#f0f8ff", p: 3, borderRadius: 2 }}>
                        <Typography variant="h4" gutterBottom align="center">
                            Change Password
                        </Typography>

                        {errorMessage && <Alert severity="error" sx={{ mb: 2 }}>{errorMessage}</Alert>}
                        {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}

                        <TextField
                            label="Current Password"
                            type="password"
                            fullWidth
                            variant="outlined"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            sx={{ mb: 2 }}
                        />

                        <TextField
                            label="New Password"
                            type="password"
                            fullWidth
                            variant="outlined"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            sx={{ mb: 2 }}
                        />

                        <TextField
                            label="Confirm New Password"
                            type="password"
                            fullWidth
                            variant="outlined"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            sx={{ mb: 2 }}
                        />

                        <Button variant="contained" color="secondary" fullWidth onClick={handlePasswordChange} sx={{ background: "red" }}>
                            Change Password
                        </Button>
                    </Box>
                </Box>
            </Container>
      <UserFooter/>
    </>
  );
};

export default UserSettings;
