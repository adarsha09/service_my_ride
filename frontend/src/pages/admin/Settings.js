import React, { useState } from "react";
import { TextField, Button, Typography, Container, Box, Alert } from "@mui/material";
import axios from "axios";
import AdminNavbar from "../../components/AdminNavbar";

const Settings = () => {
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
            const response = await axios.post("http://localhost:5000/api/auth/change-password", {
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
            <AdminNavbar />
            <Container maxWidth="lg">
                <Box
                    sx={{
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    width: "120%",                // ensure full width
    background: "linear-gradient(135deg, #80abea 0%, #8094b0 50%, #a1bee1 100%)",
    backgroundSize: "cover",      // makes gradient fill the whole area
    backgroundRepeat: "no-repeat",
    backgroundAttachment: "fixed", // keeps background fixed while scrolling
    p: 6,
  }}
                >
                    <Box  sx={{
      width: "100%",
      maxWidth: 600,
      backgroundColor: "rgba(255, 255, 255, 0.1)",
      p: 8,
      borderRadius: 4,
      boxShadow: "0 10px 30px rgba(0,0,0,0.15)", // subtle shadow
    }}>
                        <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: 700, color: "#3f51b5",mb: 4 }}>
                            Change Password
                        </Typography>

                        {errorMessage && <Alert severity="error" sx={{ mb: 2 }}>{errorMessage}</Alert>}
                        {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}

                        <TextField
                            label="Current Password"
                            type="password"
                            fullWidth
                            variant="outlined"
                            margin="normal"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            sx={{
    "& .MuiOutlinedInput-root": {
      color: "white",
      background: "rgba(255,255,255,0.08)",
      borderRadius: 2,
      transition: "all 0.3s ease-in-out",

      "& input": {
        color: "white",
        background: "transparent",
      },

      "& fieldset": {
        borderColor: "rgba(255,255,255,0.3)",
      },

      "&:hover fieldset": {
        borderColor: "#00c6ff",
        boxShadow: "0 0 8px rgba(0,198,255,0.6)", // subtle glow
      },

      "&.Mui-focused fieldset": {
        borderColor: "#00c6ff",
        boxShadow: "0 0 12px rgba(0,198,255,0.9)", // stronger glow
      },
    },

    "& .MuiInputLabel-root": {
      color: "lightgray",
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: "#00c6ff", // label glow on focus
    },
  }}
                        />

                        <TextField
                            label="New Password"
                            type="password"
                            fullWidth
                            variant="outlined"
                            margin="normal"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            sx={{
    "& .MuiOutlinedInput-root": {
      color: "white",
      background: "rgba(255,255,255,0.08)",
      borderRadius: 2,
      transition: "all 0.3s ease-in-out",

      "& input": {
        color: "white",
        background: "transparent",
      },

      "& fieldset": {
        borderColor: "rgba(255,255,255,0.3)",
      },

      "&:hover fieldset": {
        borderColor: "#00c6ff",
        boxShadow: "0 0 8px rgba(0,198,255,0.6)", // subtle glow
      },

      "&.Mui-focused fieldset": {
        borderColor: "#00c6ff",
        boxShadow: "0 0 12px rgba(0,198,255,0.9)", // stronger glow
      },
    },

    "& .MuiInputLabel-root": {
      color: "lightgray",
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: "#00c6ff", // label glow on focus
    },
  }}
                        />

                        <TextField
                            label="Confirm New Password"
                            type="password"
                            fullWidth
                            variant="outlined"
                            margin="normal"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            sx={{ mb: 3,
    "& .MuiOutlinedInput-root": {
      color: "white",
      background: "rgba(255,255,255,0.08)",
      borderRadius: 2,
      transition: "all 0.3s ease-in-out",

      "& input": {
        color: "white",
        background: "transparent",
      },

      "& fieldset": {
        borderColor: "rgba(255,255,255,0.3)",
      },

      "&:hover fieldset": {
        borderColor: "#00c6ff",
        boxShadow: "0 0 8px rgba(0,198,255,0.6)", // subtle glow
      },

      "&.Mui-focused fieldset": {
        borderColor: "#00c6ff",
        boxShadow: "0 0 12px rgba(0,198,255,0.9)", // stronger glow
      },
    },

    "& .MuiInputLabel-root": {
      color: "lightgray",
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: "#00c6ff", // label glow on focus
    },
  }}
                        />

                        <Button variant="contained" color="secondary" fullWidth onClick={handlePasswordChange} sx={{
    backgroundColor: "#f44336", // default red
    color: "#fff",
    fontWeight: 600,
    py: 1.5,
    borderRadius: 2,
    boxShadow: "0 0 12px rgba(244,67,54,0.6)", // subtle glow by default
    transition: "all 0.3s ease-in-out",

    "&:hover": {
      backgroundColor: "#d32f2f", // darker red on hover
      boxShadow: "0 0 20px rgba(244,67,54,0.9)", // stronger glow
      transform: "scale(1.05)", // slight zoom
    },
  }}>
                            Change Password
                        </Button>
                    </Box>
                </Box>
            </Container>
        </>
    );
};

export default Settings;
