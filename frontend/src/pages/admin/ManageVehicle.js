import React, { useState, useEffect } from 'react';
import { TextField, Button, Grid, Container, Typography, MenuItem, Select, FormControl, InputLabel, IconButton } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AdminNavbar from '../../components/AdminNavbar';
import { Edit, Delete } from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';

const ManageVehicle = () => {
    const navigate = useNavigate();
    const [vehicle, setVehicle] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [open, setOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [vehiclesWithCustomerNames, setVehiclesWithCustomerNames] = useState([]);
    const [editVehicleId, setEditVehicleId] = useState('');

    const [formData, setFormData] = useState({
        vehicle_id: '',
        customer_id: '',
        vehicle_number: '',
        model_number: '',
        insurance_number: ''
    });

    const fetchCustomers = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/vehicle/customers');
            console.log("Fetched Customers:", response.data);
            setCustomers(response.data);
            return response.data;
        } catch (error) {
            console.error('Error fetching customers:', error);
            return [];
        }
    };

    const fetchVehicles = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/vehicle/vehicle-details');
            console.log("Fetched Vehicles:", response.data);
            setVehicle(response.data);
            return response.data;
        } catch (error) {
            console.error('Error fetching vehicles:', error);
            return [];
        }
    };

    useEffect(() => {
        const loadData = async () => {
            const customersData = await fetchCustomers();
            const vehiclesData = await fetchVehicles();
            
            // Create a map of customer IDs to customer names for easy lookup
            const customerMap = {};
            customersData.forEach(customer => {
                customerMap[customer.customer_id] = customer.customer_name;
            });
            
            // Add customer_name property to each vehicle object
            const enhancedVehicles = vehiclesData.map(vehicle => ({
                ...vehicle,
                customer_name: customerMap[vehicle.customer_id] || 'Unknown Customer'
            }));
            
            setVehiclesWithCustomerNames(enhancedVehicles);
        };
        
        loadData();
    }, []);

    // Handle change in customer selection
    const handleCustomerChange = async (e) => {
        const customerId = e.target.value;
        console.log("Selected customer ID:", customerId);
    
        setFormData(prevData => ({
            ...prevData,
            customer_id: customerId,
            vehicle_number: '',
            model_number: '',
            insurance_number: ''
        }));
    
        if (customerId) {
            try {
                const response = await axios.get(`http://localhost:5000/api/vehicle/customer-vehicles/${customerId}`);
                console.log(" API response:", response.data);
    
                if (Array.isArray(response.data) && response.data.length > 0) {
                    const vehicleData = response.data[0]; // First vehicle
                    console.log(" Vehicle Data:", vehicleData);
    
                    setFormData(prevData => ({
                        ...prevData,
                        vehicle_number: vehicleData.vehicle_no || '',  // Adjusted field name
                        model_number: vehicleData.model_number || '',
                        insurance_number: vehicleData.insurance_number || ''
                    }));
                } else {
                    console.log("⚠ No vehicles found for this customer");
                }
            } catch (error) {
                console.error(" Error fetching vehicle details:", error.response ? error.response.data : error.message);
            }
        }
    };

    // Handle form field changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    // Handle vehicle number field blur to fetch vehicle details
    const handleVehicleNumberBlur = async () => {
        const vehicleNumber = formData.vehicle_number.trim();
        if (vehicleNumber) {
            try {
                const response = await axios.get(`http://localhost:5000/api/vehicle/vehicle-details/${vehicleNumber}`);
                const vehicleData = response.data;
               
                setFormData({
                    customer_id: vehicleData.customer_id,
                    vehicle_number: vehicleData.vehicle_number,
                    model_number: vehicleData.model_number || '',
                    insurance_number: vehicleData.insurance_number || ''
                });
            } catch (error) {
                // If 404, vehicle doesn't exist - keep current values for new entry
                if (error.response && error.response.status !== 404) {
                    console.error('Error fetching vehicle details:', error);
                }
            }
        }
    };

    // Submit form data
    const handleSubmit = async (e) => {
        e.preventDefault();
       
        if (!formData.customer_id || !formData.vehicle_number) {
            alert('Customer name and vehicle number are required');
            return;
        }

        try {
            if (isEditing && editVehicleId) {
                // Update existing vehicle
                await axios.put(`http://localhost:5000/api/vehicle/vehicle-details/${editVehicleId}`, {
                    customer_id: formData.customer_id,
                    vehicle_number: formData.vehicle_number,
                    model_number: formData.model_number,
                    insurance_number: formData.insurance_number
                });
            } else {
                // Create new vehicle
                await axios.post('http://localhost:5000/api/vehicle/vehicle-details', {
                    customer_id: formData.customer_id,
                    vehicle_number: formData.vehicle_number,
                    model_number: formData.model_number,
                    insurance_number: formData.insurance_number
                });
            }
            
            // Refresh data after submission
            const vehiclesData = await fetchVehicles();
            const customersData = customers;
            
            // Create a map of customer IDs to customer names for easy lookup
            const customerMap = {};
            customersData.forEach(customer => {
                customerMap[customer.customer_id] = customer.customer_name;
            });
            
            // Add customer_name property to each vehicle object
            const enhancedVehicles = vehiclesData.map(vehicle => ({
                ...vehicle,
                customer_name: customerMap[vehicle.customer_id] || 'Unknown Customer'
            }));
            
            setVehiclesWithCustomerNames(enhancedVehicles);
            
            handleClose();
        } catch (error) {
            console.error('Error submitting vehicle details:', error);
            alert('There was an error submitting the form!');
        }
    };

    const handleEdit = (vehicleId) => {
        // Find the vehicle to edit
        const vehicleToEdit = vehicle.find(v => v.vehicle_id === vehicleId);
        if (vehicleToEdit) {
            setFormData({
                vehicle_id: vehicleToEdit.vehicle_id,
                customer_id: vehicleToEdit.customer_id,
                vehicle_number: vehicleToEdit.vehicle_number,
                model_number: vehicleToEdit.model_number || '',
                insurance_number: vehicleToEdit.insurance_number || ''
            });
            setEditVehicleId(vehicleId);
            setIsEditing(true);
            setOpen(true);
        }
    };
    
    const handleDelete = async (vehicleId) => {
        if (window.confirm("Are you sure you want to delete this vehicle?")) {
            try {
                await axios.delete(`http://localhost:5000/api/vehicle/vehicle-details/${vehicleId}`);
                
                // Refresh the vehicle list after deletion
                const vehiclesData = await fetchVehicles();
                const customersData = customers;
                
                // Create a map of customer IDs to customer names for easy lookup
                const customerMap = {};
                customersData.forEach(customer => {
                    customerMap[customer.customer_id] = customer.customer_name;
                });
                
                // Add customer_name property to each vehicle object
                const enhancedVehicles = vehiclesData.map(vehicle => ({
                    ...vehicle,
                    customer_name: customerMap[vehicle.customer_id] || 'Unknown Customer'
                }));
                
                setVehiclesWithCustomerNames(enhancedVehicles);
            } catch (error) {
                console.error("Error deleting vehicle:", error);
                alert("Failed to delete vehicle.");
            }
        }
    };
    
    const columns = [
        { field: 'vehicle_id', headerName: 'Vehicle ID', width: 120 },
        { 
            field: 'customer_name', 
            headerName: 'Customer Name', 
            width: 200 
        },
        { field: "vehicle_number", headerName: "Vehicle No", width: 180 },
        { field: "model_number", headerName: "Model No", width: 180 },
        { field: "insurance_number", headerName: "Insurance No", width: 180 },
        {
            field: "actions",
            headerName: "Actions",
            width: 150,
            renderCell: (params) => (
                <>
                    <IconButton onClick={() => handleEdit(params.row.vehicle_id)} color="primary">
                        <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(params.row.vehicle_id)} color="secondary">
                        <Delete />
                    </IconButton>
                </>
            ),
        },
    ];

    const handleOpen = () => {
        setFormData({
            vehicle_id: '',
            customer_id: '',
            vehicle_number: '',
            model_number: '',
            insurance_number: ''
        });
        setEditVehicleId('');
        setOpen(true);
        setIsEditing(false);
    };
    
    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>
            <div style={{ display: 'flex' }}>
                <AdminNavbar />
                <div style={{ marginLeft: '260px', padding: '20px', width: '100%',background: 'linear-gradient(135deg, #bc84b62e 0%, #ffe082 20%, #80aeb5 100%)' }}>
                    <h2>Manage Vehicle</h2>
        
                    <Button variant="contained" color="primary" onClick={handleOpen} style={{ marginBottom: '10px' }}>
                        Add Vehicle
                    </Button>

                    <div style={{ height: 600, width: '100%' }}>
                        <DataGrid 
                            rows={vehiclesWithCustomerNames} 
                            getRowId={(row) => row.vehicle_id}
                            columns={columns} 
                            pageSize={5} 
                            checkboxSelection 
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
  backgroundColor: '#ffe082',              // warm yellow background on hover
  transform: 'scale(1.01)',                // slight zoom
  transition: 'all 0.3s ease-in-out',      // smoother transition
  boxShadow: `
    0 4px 12px rgba(0,0,0,0.15),           /* existing subtle shadow */
    0 0 15px rgba(255,193,7,0.8),          /* bright golden glow */
    0 0 30px rgba(255,193,7,0.6)           /* softer spread glow */
  `,
},
  }}
                        />
                    </div>

                    <Dialog open={open} onClose={handleClose}PaperProps={{
    sx: {
      backgroundColor: '#e2b67d',   // dialog background
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
  }}>{isEditing ? 'Edit Vehicle' : 'Add Vehicle'}</DialogTitle>
                        <DialogContent sx={{padding:'20px'}}>
                            <form onSubmit={handleSubmit}>
                                <FormControl fullWidth >
                                    <InputLabel id="customer-select-label">Customer Name</InputLabel>
                                    <Select
                                        labelId="customer-select-label"
                                        name="customer_id"
                                        value={formData.customer_id || ''} 
                                        onChange={handleCustomerChange}
                                        required
                                        sx={{mb:'16px'}}
                                      MenuProps={{
      PaperProps: {
        sx: {
          // Gradient background for dropdown
          backgroundImage: "linear-gradient(135deg, #dfc89b, #eddb86)", 
          "& .MuiMenuItem-root": {
            color: "#fff", // text color
            "&:hover": {
              backgroundImage: "linear-gradient(135deg, #e3fb6a, #b1bfe4)", 
              color: "#000", // hover text color
            },
          },
        },
      },
    }}   
                                    >
                                        {customers.map((customer) => (
                                            <MenuItem key={customer.customer_id} value={customer.customer_id}>
                                                {customer.customer_name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                <TextField
                                    required
                                    name="vehicle_number"
                                    label="Vehicle Number"
                                    fullWidth
                                    value={formData.vehicle_number}
                                    onChange={handleChange}
                                    onBlur={handleVehicleNumberBlur}
                                    sx={{mb:'16px'}}
                                />
                            
                                <TextField
                                    name="model_number"
                                    label="Model Number"
                                    fullWidth
                                    value={formData.model_number}
                                    onChange={handleChange}
                                    sx={{mb:'16px'}}
                                />
                           
                                <TextField
                                    name="insurance_number"
                                    label="Insurance Number"
                                    fullWidth
                                    value={formData.insurance_number}
                                    onChange={handleChange}
                                    sx={{mb:'16px'}}
                                />

                                <DialogActions>
                                    <Button onClick={handleClose}  sx={{ backgroundColor:'#e74c3c',color: '#fff' }}>Cancel</Button>
                                    <Button color="primary" onClick={handleSubmit}>
                                        {isEditing ? 'Update' : 'Add'}
                                    </Button>
                                </DialogActions>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </>
    );
};

export default ManageVehicle;