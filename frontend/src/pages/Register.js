import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Typography, Paper, Box, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState({});
  const [role] = useState('user');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const validateInputs = () => {
    const newErrors = {};
    
    if (!name.trim()) {
      newErrors.name = 'User Name is required';
    } else if (name.trim().length < 2) {
      newErrors.name = 'User Name must be at least 2 characters';
    } else if (name.trim().length > 50) {
      newErrors.name = 'User Name must be less than 50 characters';
    } else if (!/^[a-zA-Z0-9_\s]+$/.test(name.trim())) {
      newErrors.name = 'User Name can only contain letters, numbers, underscores, and spaces';
    }
    
    if (!password.trim()) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    } else if (password.length > 128) {
      newErrors.password = 'Password must be less than 128 characters';
    } else if (!/(?=.*[a-zA-Z])/.test(password)) {
      newErrors.password = 'Password must contain at least one letter';
    }
    
    if (!phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(phone.trim())) {
      newErrors.phone = 'Phone number must be exactly 10 digits';
    } else if (!/^[6-9]\d{9}$/.test(phone.trim())) {
      newErrors.phone = 'Please enter a valid Indian mobile number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const showValidationAlert = () => {
    const errorMessages = Object.values(errors);
    if (errorMessages.length > 0) {
      alert(`Please fix the following errors:\n\n${errorMessages.join('\n')}`);
    }
  };

  const handleRegister = async () => {
    setErrors({});
    
    if (!validateInputs()) {
      showValidationAlert();
      return;
    }

    if (!name.trim() || !password.trim() || !phone.trim()) {
      alert('All fields are required. Please fill in all information.');
      return;
    }

    setIsSubmitting(true);

    try {
      await axios.post('http://localhost:5000/api/auth/register', { 
        user_name: name.trim(), 
        password, 
        user_type: role, 
        phone: phone.trim()
      });
      
      alert('Registration successful! You can now login.');
      navigate('/');
      
    } catch (error) {
      console.error('Registration error:', error);
      
      if (error.response) {
        if (error.response.status === 400) {
          const errorMsg = error.response.data?.message || 'Username already taken';
          alert(errorMsg);
        } else if (error.response.status === 409) {
          alert('User already exists. Please try with different credentials.');
        } else if (error.response.status === 500) {
          alert('Server error. Please try again later.');
        } else {
          alert(`Registration failed: ${error.response.data?.message || 'Unknown error'}`);
        }
      } else if (error.request) {
        alert('Network error. Please check your internet connection and try again.');
      } else {
        alert('Registration failed. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
    if (errors.name) {
      setErrors(prev => ({ ...prev, name: '' }));
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (errors.password) {
      setErrors(prev => ({ ...prev, password: '' }));
    }
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    setPhone(value);
    if (errors.phone) {
      setErrors(prev => ({ ...prev, phone: '' }));
    }
  };

  return (
    <div className="login-bg-div">
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        height="100vh" 
        bgcolor="transparent"
      >
        <Paper elevation={3}
          sx={{
          padding: 4,
          maxWidth: 400,
          width: "100%",
          borderRadius: 4,
          background: "rgba(255,255,255,0.15)",
          backdropFilter: "blur(3px)",
          border: "1px solid rgba(255,255,255,0.2)",
          color: "white",
        }}>

          <Typography variant="h4" align="center" gutterBottom sx={{ color: "white", fontWeight: "bold" }}>
            Registration
          </Typography>
          
          <TextField
            label="User Name"
            value={name}
            onChange={handleNameChange}
            fullWidth
            margin="normal"
            error={!!errors.name}
            helperText={errors.name}
            disabled={isSubmitting}
            inputProps={{ maxLength: 50 }}
            InputProps={{ style: { color: 'black' } }}
            InputLabelProps={{ style: { color: 'white' } }}
            FormHelperTextProps={{ style: { color: 'darkred' } }}
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
            onChange={handlePasswordChange}
            fullWidth
            margin="normal"
            error={!!errors.password}
            helperText={errors.password}
            disabled={isSubmitting}
            inputProps={{ maxLength: 128 }}
            InputProps={{ style: { color: 'black' } }}
            InputLabelProps={{ style: { color: 'white' } }}
            FormHelperTextProps={{ style: { color: 'darkred' } }}
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
            label="Phone"
            type="tel"
            value={phone}
            onChange={handlePhoneChange}
            fullWidth
            margin="normal"
            error={!!errors.phone}
            helperText={errors.phone}
            disabled={isSubmitting}
            inputProps={{ maxLength: 10, pattern: '[0-9]*' }}
            placeholder="Enter 10-digit mobile number"
            InputProps={{ style: { color: 'black' } }}
            InputLabelProps={{ style: { color: 'white' } }}
            FormHelperTextProps={{ style: { color: 'darkred' } }}
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
          
          <Box display="flex" justifyContent="center" mt={2} mb={3}>
            <Button 
              variant="contained" 
              color="secondary" 
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
              onClick={handleRegister}
              disabled={isSubmitting}
              fullWidth
            >
              {isSubmitting ? 'Registering...' : 'Register'}
            </Button>
          </Box>
          
          <Box mt={4} textAlign="center">
            <Typography variant="body2" sx={{ color: "white" }}>
              Already registered?{' '}
              <Link href="/" underline="hover" sx={{ color: "Red", fontWeight: "bold" }}>
                Login here
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </div>
  );
};

export default Register;
