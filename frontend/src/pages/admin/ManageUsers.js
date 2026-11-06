import React, { useEffect, useState } from "react";
import { DataGrid } from '@mui/x-data-grid';
import { IconButton, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { Edit, Delete } from '@mui/icons-material';
import axios from 'axios';
import AdminNavbar from "../../components/AdminNavbar";

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({ user_name: '', password: '', user_type: 'user', phone: '' });
    const [isEditing, setIsEditing] = useState(false);
    const [editUserId, setEditUserId] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/auth/users');
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const handleOpen = () => {
        setIsEditing(false);
        setFormData({ user_name: '', password: '', user_type: 'user', phone: '' });
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        try {
            // Regular expression for Name: Only letters (A-Z, a-z) and spaces
            const namePattern = /^[a-zA-Z\s]+$/;
            // Regular expression for Password: Minimum 8 characters, at least 1 uppercase, 1 lowercase, 1 number, and 1 special character
            const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const phonePattern = /^[6-9][0-9]{9}$/;
            if (!namePattern.test(formData.user_name)) {
                alert("Name must contain only letters (A-Z, a-z) and spaces.");
                return;
            }
        if (!phonePattern.test(formData.phone)) {
            alert("Phone number must be exactly 10 digits and start with 6–9.");
            return;
        }
            if (!isEditing) { // Validate password only when adding a new user
                if (!passwordPattern.test(formData.password)) {
                    alert("Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character.");
                    return;
                }
            }
            
            
            if (isEditing) {
                // Update user - fixed endpoint to match backend
                await axios.put(`http://localhost:5000/api/auth/users/${editUserId}`, formData);
            } else {
                // Add new user
                await axios.post('http://localhost:5000/api/auth/register', formData);
            }
    
            fetchUsers();
            handleClose();
        } catch (error) {
            console.error('Error saving user:', error);
            alert(`Error: ${error.response?.data?.message || error.message}`);
        }
    };
        
    const handleEdit = (id) => {
        const user = users.find((user) => user.id === id);
        if (user) {
            setFormData({ 
                user_name: user.user_name, 
                password: '', 
                user_type: user.user_type,
                phone: user.phone || ''
            });
            setEditUserId(id);
            setIsEditing(true);
            setOpen(true);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            try {
                // Fixed endpoint to match backend
                await axios.delete(`http://localhost:5000/api/auth/users/${id}`);
                fetchUsers();
            } catch (error) {
                console.error('Error deleting user:', error);
                alert("Error deleting user");
            }
        }
    };

    const columns = [
        { field: 'user_id', headerName: 'User ID', width: 90 },
        { field: 'user_name', headerName: 'Customer Name', width: 200 },
        { field: 'user_type', headerName: 'Role', width: 150 },
        { field: 'phone', headerName: 'Phone', width: 150 },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 150,
            renderCell: (params) => (
                <>
                    <IconButton onClick={() => handleEdit(params.row.id)} color="primary">
                        <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(params.row.id)} color="secondary">
                        <Delete />
                    </IconButton>
                </>
            ),
        },
    ];

    return (
        <div style={{ display: 'flex' }}>
            <AdminNavbar />
            <div style={{ marginLeft: '260px', padding: '20px', width: 'calc(100% - 270px)',background: 'linear-gradient(135deg, #2980b9 0%, #57aeae 50%, #d58181 100%)'
}}>
                <h2>Manage Users</h2>
                 
                <Button variant="contained" color="primary" onClick={handleOpen} style={{ marginBottom: '10px' }}>Add User</Button>

                <div style={{ height: 600, width: '100%' }}>
                    <DataGrid 
                        rows={users} 
                        columns={columns} 
                        pageSize={5}
                        rowsPerPageOptions={[5, 10, 20]}
                        checkboxSelection 
                        getRowId={(row) => row.id || row.user_id} // Use id or user_id as fallback
   sx={{
    '& .MuiDataGrid-columnHeaders': {
      backgroundColor: '#7599bd',   // header background
      color: 'black',                // header text color
    },
    '& .MuiDataGrid-columnHeaderTitle': {
      fontWeight: 'bold',
      fontSize: '1rem',
      color: '#black',                // ensure title text is white
    },
    '& .MuiDataGrid-row:hover': {
  backgroundColor: '#007c91',              // light background on hover
  transform: 'scale(1.01)',                // slight zoom
  transition: 'all 0.3s ease-in-out',      // smoother transition
  boxShadow: `
    0 0 12px rgba(0,198,255,0.8),          /* outer glow */
    0 0 24px rgba(0,198,255,0.6)           /* softer spread glow */
  `,
},
    
  }}
                    />
                </div>

                {/* Add/Edit User Dialog */}
                <Dialog open={open} onClose={handleClose}PaperProps={{
    sx: {
      backgroundColor: '#8bcbaa',   // dialog background
      color: '#ffffff',             // text color
      borderRadius: 2,              // rounded corners
      padding: 2,
    }
  }}>
                    <DialogTitle PaperProps={{
    sx: {
      backgroundColor: '#34495e',   // dialog background
      color: '#00c6ff',             // text color
      borderRadius: 2,              // rounded corners
      padding: 2,
    }
  }}>{isEditing ? 'Edit User' : 'Add User'}</DialogTitle>
                    <DialogContent>
                        <TextField
                            margin="dense"
                            label="User Name"
                            name="user_name"
                            value={formData.user_name}
                            onChange={handleChange}
                            fullWidth
                            required
                        />

                        {!isEditing && (
                            <TextField
                                margin="dense"
                                label="Password"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                fullWidth
                                required
                                helperText="Min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char"
                            />
                        )}

                        <TextField
                            margin="dense"
                            label="Role"
                            name="user_type"
                            value={formData.user_type}
                            onChange={handleChange}
                            fullWidth
                        />

                        <TextField
                            margin="dense"
                            label="Phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            fullWidth
                        />
                    </DialogContent>
                    <DialogActions sx={{ justifyContent: 'space-between' }}>
    <Button onClick={handleClose} sx={{ backgroundColor: '#e74c3c',color: '#fff' }}>Cancel</Button>
    <Button onClick={handleSubmit} sx={{ backgroundColor: '#27ae60', color: '#fff' }}>
      {isEditing ? 'Update' : 'Add'}
    </Button>
  </DialogActions>
                </Dialog>
            </div>
        </div>
    );
};

export default ManageUsers;   