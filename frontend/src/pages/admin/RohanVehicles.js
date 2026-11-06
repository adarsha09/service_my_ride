import React, { useState, useEffect } from 'react';
import { TextField, Button, Grid, Container, Typography, MenuItem, Select, FormControl, InputLabel, IconButton } from '@mui/material';
import axios from 'axios';
// import UserNavbar from '../../Component/UserNavbar';
import { useNavigate } from 'react-router-dom';
import AdminNavbar from '../../components/AdminNavbar';
import{Edit,Delete} from'@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';


const ManageVehicle = () => {
    const navigate = useNavigate();
    // const [vehicle, setVehicle]= useState([]);
    const [customers, setCustomers] = useState([]);
    const [open, setOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const [formData, setFormData] = useState({
        customer_id: '',
        vehicle_number: '',
        model_number: '',
        insurance_number: ''
    });

    // Fetch all customers when component mounts
    // useEffect(() => {
    //     const fetchCustomers = async () => {
    //         try {
    //             const response = await axios.get('http://localhost:5000/api/vehicle/customers');
    //             setCustomers(response.data);
    //         } catch (error) {
    //             console.error('Error fetching customers:', error);
    //         }
    //     };
       
    //     fetchCustomers();
    // }, []);

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/vehicle/customers');
                console.log("Fetched Customers:", response.data); // Debugging
                setCustomers(response.data);
            } catch (error) {
                console.error('Error fetching customers:', error);
            }
        };
    
        fetchCustomers();
    }, []);
    

    // Handle change in customer selection
    const handleCustomerChange = async (e) => {
        const customerId = e.target.value;
        console.log("Selected Customer ID:", customerId); // Debugging
        setFormData(formData =>({

            ...formData,
            customer_id: customerId
        }));

        if (customerId) {
            try {
                const response = await axios.get(`http://localhost:5000/api/vehicle/customer-vehicles/${customerId}`);
                if (response.data.length > 0) {
                    const vehicleData = response.data[0];
                    setFormData(prevData => ({
                        ...prevData,
                        vehicle_number: vehicleData.vehicle_number || '',
                        model_number: vehicleData.model_number || '',
                        insurance_number: vehicleData.insurance_number || ''
                    }));
                }
            } catch (error) {
                console.error('Error fetching vehicle details:', error);
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
            // Check if vehicle exists
            let response;
            try {
                response = await axios.get(`http://localhost:5000/api/vehicle/vehicle-details/${formData.vehicle_number}`);
                // Vehicle exists, update it
                await axios.put(`http://localhost:5000/api/vehicle/vehicle-details/${response.data.vehicle_id}`, {
                    model_number: formData.model_number,
                    insurance_number: formData.insurance_number
                });
                alert('Vehicle details updated successfully!');
            } catch (error) {
                if (error.response && error.response.status === 404) {
                    // Vehicle doesn't exist, create new
                    await axios.post('http://localhost:5000/api/vehicle/vehicle-details', formData);
                    alert('Vehicle details added successfully!');
                } else {
                    throw error;
                }
            }

            // Reset form or navigate
            // navigate('/dashboard'); // Uncomment if you want to redirect after submission
        } catch (error) {
            console.error('Error submitting vehicle details:', error);
            alert('There was an error submitting the form!');
        }
    };

    const handleEdit = (vehicleId) => {
        // Navigate to an edit page or populate the form for editing
        navigate(`/edit-vehicle/${vehicleId}`);
    };
    
    const handleDelete = async (vehicleId) => {
        if (window.confirm("Are you sure you want to delete this vehicle?")) {
            try {
                await axios.delete(`http://localhost:5000/api/vehicle/vehicle-details/${vehicleId}`);
                alert("Vehicle deleted successfully!");
                // Refresh the vehicle list after deletion
                setCustomers(customers.filter(vehicle => vehicle.vehicle_id !== vehicleId));
            } catch (error) {
                console.error("Error deleting vehicle:", error);
                alert("Failed to delete vehicle.");
            }
        }
    };
    

    const columns = [
        { field: "customer_id", headerName: "Customer ID", width: 90 },
        { field: "vehicle_no", headerName: "Vehicle No", width: 200 },
        { field: "model_no", headerName: "Model No", width: 250 },
        { field: "insurance_no", headerName: "Insurance No", width: 300 },
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
        setOpen(true);
        setIsEditing(false); // Ensure it's not in edit mode by default
    };
    
    const handleClose = () => {
        setOpen(false);
    };
    

    return (
        <>

        <div style={{ display: 'flex' }}>
            <AdminNavbar />
            <div style={{ marginLeft: '270px', padding: '20px', width: '100%' }}>
                <h2>Manage Vehicle</h2>
    
                <Button variant="contained" color="primary" onClick={handleOpen} style={{ marginBottom: '10px' }}>
                    Add Vehicle
                </Button>

                <div style={{ height: 400, width: '100%' }}>
                    <DataGrid 
                        rows={customers} 
                        columns={columns} 
                        pageSize={5} 
                        checkboxSelection 
                        getRowId={(row) => row.customer_id} // ✅ Tell DataGrid to use `feedback_id` as the row ID
                    />

                    </div>

                     {/* Add/Edit User Dialog */}
                     <Dialog open={open} onClose={handleClose}>
                        <DialogTitle>{isEditing ? 'Edit Feedback' : 'Add Feedback'}</DialogTitle>
                        <DialogContent>
                            <form onSubmit={handleSubmit}>

                            <FormControl fullWidth>
                            <InputLabel id="customer-select-label">Customer Name</InputLabel>
                            <Select
                                labelId="customer-select-label"
                                name="customer_id"
                                value={formData.customer_id || ''} // Ensure it's not undefined
                                onChange={handleCustomerChange}
                                required
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
                            />
                        
                            <TextField
                                name="model_number"
                                label="Model Number"
                                fullWidth
                                value={formData.model_number}
                                onChange={handleChange}
                            />
                       
                            <TextField
                                name="insurance_number"
                                label="Insurance Number"
                                fullWidth
                                value={formData.insurance_number}
                                onChange={handleChange}
                            />

                             <DialogActions>
                                <Button onClick={handleClose} color="secondary">Cancel</Button>
                                <Button type="submit" color="primary">
                                    {isEditing ? 'Update' : 'Add'}
                                </Button>
                            </DialogActions>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </div>

</>


          
            /* <AdminNavbar />

        
            <Container style={{ marginLeft: '280px' }}>
                <Typography variant="h4" gutterBottom>
                    Vehicle Details
                </Typography>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel id="customer-select-label">Customer Name</InputLabel>
                                <Select
                                    labelId="customer-select-label"
                                    name="customer_id"
                                    value={formData.customer_id}
                                    label="Customer Name"
                                    onChange={handleCustomerChange}
                                    required
                                >
                                    {customers.map((customer) => (
                                        <MenuItem key={customer.customer_id} value={customer.customer_id}>
                                            {customer.customer_name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                name="vehicle_number"
                                label="Vehicle Number"
                                fullWidth
                                value={formData.vehicle_number}
                                onChange={handleChange}
                                onBlur={handleVehicleNumberBlur}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="model_number"
                                label="Model Number"
                                fullWidth
                                value={formData.model_number}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="insurance_number"
                                label="Insurance Number"
                                fullWidth
                                value={formData.insurance_number}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button type="submit" variant="contained" color="primary">
                                Add Vehicle
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Container>
        </> */
    );
};

export default ManageVehicle;