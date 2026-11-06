import React, { useEffect, useState } from "react";
import { DataGrid } from '@mui/x-data-grid';
import { IconButton, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { Edit, Delete } from '@mui/icons-material';
import axios from 'axios';
import AdminNavbar from "../../components/AdminNavbar";

const CustomersDetails =() =>{

    const [customer, setCustomer] = useState([]);
    const [users, setUsers] = useState([]); 
    const [isEditing, setIsEditing] = useState(false);
    const [open, setOpen] = useState(false);
    const [editCustomerId, setEditCustomerId] = useState('');
     const [formData, setFormData] = useState({
            customer_id: "",customer_name: "",address:"",contact_no:"",email_id:"",vehicle_no: ""
        });

const columns = [
        { field: "customer_id", headerName: "Customer ID", width: 100 },
        { field: "customer_name", headerName: "Customer Name", width: 150 },
        { field: "address", headerName: "Address", width: 300 },
        { field: "contact_no", headerName: "Contact No", width: 200 },
        { field: "email_id", headerName: "Email", width: 200 },
        { field: "vehicle_no", headerName: "Vehicle No", width: 200 },
        {
            field: "actions",
            headerName: "Actions",
            width: 150,
            renderCell: (params) => (
                <>
                    <IconButton onClick={() => handleEdit(params.row.customer_id)} color="primary">
                        <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(params.row.customer_id)} color="secondary">
                        <Delete />
                    </IconButton>
                </>
            ),
        },
    ];

    const handleOpen = () => {
        setIsEditing(false);
        setEditCustomerId('');
        setFormData({ customer_id: "",customer_name: "",address:"",contact_no:"",email_id:"",vehicle_no: "" });
        setOpen(true);
    };

    const handleEdit = (id) => {
        const c_Details = customer.find((item) => item.customer_id === id);
        if (!c_Details) return;
    
        // Find the user_id that matches the customer_name
        const matchingUser = users.find(user => user.user_name === c_Details.customer_name);
       
        setFormData({
            customer_id: matchingUser ? matchingUser.user_id : "",
            customer_name: c_Details.customer_name,
            address: c_Details.address,
            contact_no: c_Details.contact_no,
            email_id: c_Details.email_id,
            vehicle_no: c_Details.vehicle_no
        });
    
        setEditCustomerId(id);
        setIsEditing(true);
        setOpen(true);
    }
    const handleDelete = async (id) => {
    try {
        await axios.delete(`http://localhost:5000/api/customers/customerdetails/${id}`);
        setCustomer((prev) => prev.filter(item => item.customer_id !== id));
    } catch (error) {
        console.error("Error deleting customer:", error);
    }
};

const handleClose = () => {
    setOpen(false);
};

const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted!");
    const phoneRegex = /^[0-9]{10}$/; // Example: only 10 digits allowed
    if (!phoneRegex.test(formData.contact_no)) {
        alert("Please enter a valid 10-digit phone number.");
        return; // Stop submission if invalid
    }
    // ✅ Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email_id)) {
        alert("Please enter a valid email address.");
        return;
    }

    try {
        // Find the selected user to get their name
        const selectedUser = users.find(user => user.user_id === formData.customer_id);
       
        const CustomerData = {
            customer_name: selectedUser ? selectedUser.user_name : "",
            address: formData.address,
            contact_no: formData.contact_no,
            email_id: formData.email_id,
            vehicle_no: formData.vehicle_no
        };

        if (isEditing) {
            console.log("Updating customer...");
            const response = await axios.put(`http://localhost:5000/api/customers/customerdetails/${editCustomerId}`, CustomerData);
            if (response.data.success) {
                fetchCustomer();
                handleClose();
            }
        } else {
            console.log("Adding new customer...");
            const response = await axios.post("http://localhost:5000/api/customers/customerdetails", CustomerData);
            if (response.data.success) {
                fetchCustomer();
                handleClose();
            }
        }
    } catch (error) {
        console.error("Error saving customer:", error);
    }
};

const fetchCustomer = async () => {
    try {
        const response = await axios.get('http://localhost:5000/api/customers/customerdetails');
        console.log("Fetched customers:", response.data); // Debugging log
        setCustomer(response.data);
    } catch (error) {
        console.error('Error fetching customer details:', error);
    }
};



// Fetch users from the user_creationtable
const fetchUsers = async () => {
    try {
        const response = await axios.get('http://localhost:5000/api/auth/users');
        setUsers(response.data); 
    } catch (error) {
        console.error("Error fetching users:", error);
    }
};

useEffect(() => {
    fetchCustomer();
    fetchUsers();
}, []);

const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
};

    return (

        <div style={{ display: "flex" }}>
            <AdminNavbar />
            <div style={{ marginLeft: "260px", padding: "20px", width: "90%",background: 'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)' }}>
                <h2>Customers Details</h2>

                <Button variant="contained" color="primary" onClick={handleOpen} style={{ marginBottom: "10px" }}>
                    Add Customer
                </Button>

                <div style={{ height: 600, width: "90%" }}>

                    <DataGrid 
                    rows={customer} 
                    columns={columns}
                     pageSize={5} 
                     checkboxSelection 
                     getRowId={(row) => row.customer_id} 
                      sx={{
                        '& .MuiDataGrid-columnHeaders': {
      backgroundColor: '#668db4',   // header background
      color: 'black',                // header text color
    },
    '& .MuiDataGrid-columnHeaderTitle': {
      fontWeight: 'bold',
      fontSize: '1rem',
      color: '#black',                // ensure title text is white
    },
    '& .MuiDataGrid-row:hover': {
  backgroundColor: '#90caf9',              // light background on hover
  transform: 'scale(1.01)',                // slight zoom
  transition: 'all 0.3s ease-in-out',      // smoother transition
  boxShadow: `
    0 4px 12px rgba(0,0,0,0.15),           /* existing subtle shadow */
    0 0 15px rgba(0,198,255,0.8),          /* bright glow */
    0 0 30px rgba(0,198,255,0.6)           /* softer spread glow */
  `,
},
  }}
                     />
                </div>

                <Dialog open={open} onClose={handleClose} PaperProps={{
    sx: {
      backgroundColor: '#a5cdf0',   // dialog background
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
  }}>{isEditing ? "Edit Customer" : "Add Customer"}</DialogTitle>
                    <DialogContent>
                        <form onSubmit={handleSubmit}>

                        <FormControl fullWidth margin="dense">
                            <InputLabel>Customer Name</InputLabel>
                            <Select
                                value={formData.customer_id}
                                onChange={(e) => setFormData({ ...formData, customer_id: e.target.value })}
                              MenuProps={{
     PaperProps: {
    sx: {
      backgroundImage: "linear-gradient(135deg, #7dbef4, #ddd0cc)",
      "& .MuiMenuItem-root": {
        color: "#4e342e",
        "&:hover": {
          backgroundImage: "linear-gradient(135deg, #85e7e2, #ff9a9e)",
          color: "#000",
        },
      },
    },
  },
    }}   
                            >
                                {users.map((user) => (
                                    <MenuItem key={user.user_id} value={user.user_id}>
                                        {user.user_name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                            {/* <TextField
                                margin="dense"
                                label="Customer Name"
                                name="customer_name"
                                fullWidth
                                required
                                value={formData.customer_name}
                                onChange={handleChange}
                            /> */}
                             <TextField
                                margin="dense"
                                label="Contact No"
                                name="contact_no"
                                fullWidth
                                required
                                value={formData.contact_no}
                                onChange={handleChange}
                                error={!/^[0-9]{10}$/.test(formData.contact_no) && formData.contact_no !== ""}
    helperText={!/^[0-9]{10}$/.test(formData.contact_no) && formData.contact_no !== "" ? "Enter a valid 10-digit number" : ""}
                            />
                             <TextField
                                margin="dense"
                                label="Email"
                                name="email_id"
                                fullWidth
                                required
                                value={formData.email_id}
                                onChange={handleChange}
                                onChange={handleChange}
    error={!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email_id) && formData.email_id !== ""}
    helperText={!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email_id) && formData.email_id !== "" ? "Enter a valid email address" : ""}
                            />
                            <TextField
                                margin="dense"
                                label="Address"
                                name="address"
                                fullWidth
                                required
                                value={formData.address}
                                onChange={handleChange}
                            />
                           
                            <TextField
                                margin="dense"
                                label="Vehicle No"
                                name="vehicle_no"
                                fullWidth
                                required
                                value={formData.vehicle_no}
                                onChange={handleChange}
                            />
                            <DialogActions>
                                <Button onClick={handleClose} color="secondary">Cancel</Button>
                                <Button type="submit" color="primary">{isEditing ? "Update" : "Add"}</Button>
                            </DialogActions>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );

};
export default CustomersDetails;