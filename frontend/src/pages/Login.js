import React, { useState, useEffect } from "react";
import { Button, TextField, Box, Typography, Paper, Link } from '@mui/material';
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [user_name, setUser] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const storedUserName = localStorage.getItem("user_name");
    if (storedUserName) {
      setUser(storedUserName);
    }
  }, []);

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', { user_name, password });

      console.log("API Response:", response.data);

      const { user_type, user_id, user_name: returnedUserName } = response.data || {};

      if (!user_id) {
        console.error("user_id is undefined!");
        alert("Login failed, please try again.");
        return;
      }

      localStorage.setItem("user_id", user_id);
      localStorage.setItem("user_name", returnedUserName || user_name);
      localStorage.setItem("user_type", user_type);

      if (user_type === "admin") {
        navigate('/admin/AdminDash');
      } else if (user_type === 'user') {
        navigate('/User/Home');
      } else if (user_type === "employee") {
        navigate('/employee/EmployDash');
      } else {
        alert('Role not recognized');
      }
    } catch (error) {
      console.error("Login Error:", error);
      alert('Invalid credentials');
    }
  };

  return (
    <div className="login-bg-div">
      <Box
        sx={{ scale: '0.9' }}
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
        bgcolor="transparent"
      >
        <Paper
          elevation={3}
          sx={{
          padding: 4,
          maxWidth: 400,
          width: "100%",
          borderRadius: 4,
          background: "rgba(255,255,255,0.15)",
          backdropFilter: "blur(3px)",
          border: "1px solid rgba(255,255,255,0.2)",
          color: "white",
        }}
        >
          <Typography
            variant="h4"
            align="center"
            gutterBottom
            sx={{ color: "white", fontWeight: "bold" }}>
            Login
          </Typography>

          <TextField
            label="User Name"
            type="text"
            value={user_name}
            onChange={(e) => setUser(e.target.value)}
            fullWidth
            margin="normal"
            InputProps={{ style: { color: 'white' } }}
            InputLabelProps={{ style: { color: 'white' } }}

            sx={{
            "& .MuiOutlinedInput-root": {
              color: "white",
              background: "rgba(255,255,255,0.08)",

              "& input": {
                color: "white",
                background: "transparent",
              },

              "& fieldset": {
                borderColor: "rgba(255,255,255,0.5)",
              },

              "&:hover fieldset": {
                borderColor: "#00c6ff",
              },

              "&.Mui-focused fieldset": {
                borderColor: "#00c6ff",
              },
            },

            "& .MuiInputLabel-root": {
              color: "lightgray",
            },
          }}
          />

          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            margin="normal"
            InputProps={{ style: { color: 'white' } }}
            InputLabelProps={{ style: { color: 'white' } }}

            sx={{
            "& .MuiOutlinedInput-root": {
              color: "white",
              background: "rgba(255,255,255,0.08)",

              "& input": {
                color: "white",
                background: "transparent",
              },

              "& fieldset": {
                borderColor: "rgba(255,255,255,0.5)",
              },

              "&:hover fieldset": {
                borderColor: "#00c6ff",
              },

              "&.Mui-focused fieldset": {
                borderColor: "#00c6ff",
              },
            },

            "& .MuiInputLabel-root": {
              color: "lightgray",
            },
          }}
          />

          <Box display="flex" justifyContent="center" mt={2}>
            <Button
              variant="contained"
             sx={{
              background: "linear-gradient(45deg,#00c6ff,#0072ff)",
              fontWeight: "bold",
              padding: "12px",
              borderRadius: "10px",
              boxShadow: "0 4px 15px rgba(0,198,255,0.4)",
              "&:hover": {
                background: "linear-gradient(45deg,#0072ff,#00c6ff)",
                boxShadow: "0 6px 20px rgba(0,198,255,0.6)",
              },
            }}
              onClick={handleLogin}
              fullWidth
            >
              Login
            </Button>
          </Box>

          <Box mt={2} textAlign="center">
            <Typography variant="body2" sx={{ color: "white" }}>
              Don't have an account?{" "}
              <Link href="/register" underline="hover" sx={{ color: "red", fontWeight: "bold" }}>
                Register here
              </Link>
            </Typography>

      
          </Box>
        </Paper>
      </Box>
    </div>
  );
};

export default Login;
