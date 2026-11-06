import React, { useState } from "react";
import { Container, TextField, Button, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Alert } from "@mui/material";
import axios from "axios";
import UserHeader from "../../components/UserHeader";
import UserFooter from "../../components/UserFooter";

const RequestService = () => {
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [vehicleDetails, setVehicleDetails] = useState(null);
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  // Search for Vehicle
  const searchVehicle = async () => {
    setError("");
    try {
      const response = await axios.post("http://localhost:5000/api/search-vehicle", { vehicleNumber });
      if (response.data.message) {
        setError(response.data.message);
        setVehicleDetails(null);
      } else {
        setVehicleDetails(response.data);
      }
    } catch (err) {
      setError("Error searching vehicle");
    }
  };

  // Submit Service Request
  const submitRequest = async () => {
    setError("");
    if (!vehicleDetails) {
      setError("Please search and select a vehicle first");
      return;
    }

    try {
    const customerName = localStorage.getItem("user_name") || "Unknown"; // Fetch from local storage
    const response = await axios.post("http://localhost:5000/api/request-service", {
      vehicle_number: vehicleNumber,
      customer_name: customerName,
      description,
    });

      alert(response.data.message);
      setVehicleNumber("");
      setDescription("");
      setVehicleDetails(null);
    } catch (err) {
      setError("Error submitting request");
    }
  };

  return (
    <>
      <UserHeader />
      <Container maxWidth="md" sx={{ marginTop: 4, padding: 2, backgroundColor: "#f9f9f9", borderRadius: 2, boxShadow: 3 }}>
        <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: "bold", color: "#333" }}>
          Request for Services
        </Typography>

        {error && <Alert severity="error" sx={{ marginBottom: 2 }}>{error}</Alert>}

        {/* Vehicle Search */}
        <TextField
          fullWidth
          label="Search by Vehicle Number"
          variant="outlined"
          value={vehicleNumber}
          onChange={(e) => setVehicleNumber(e.target.value)}
          margin="normal"
          sx={{ backgroundColor: "#fff", borderRadius: 1 }}
        />
        <Button
          variant="contained"
          color="primary"
          sx={{ backgroundColor: "red", color: "#fff", marginTop: 1 }}
          onClick={searchVehicle}
        >
          Search
        </Button>

        {/* Vehicle Details */}
        {vehicleDetails && (
          <TableContainer component={Paper} sx={{ marginTop: 3, borderRadius: 2, boxShadow: 2 }}>
            <Table>
              <TableHead sx={{ backgroundColor: "red" }}>
                <TableRow>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Vehicle Number</TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Model Number</TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Insurance Number</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {vehicleDetails.map((vehicle, index) => (
                  <TableRow key={index}>
                    <TableCell>{vehicle.vehicle_number}</TableCell>
                    <TableCell>{vehicle.model_number}</TableCell>
                    <TableCell>{vehicle.insurance_number}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Service Request Form */}
        <TextField
          fullWidth
          label="Description"
          variant="outlined"
          multiline
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          margin="normal"
          sx={{ backgroundColor: "#fff", borderRadius: 1 }}
        />

        <Button
          variant="contained"
          color="success"
          sx={{ backgroundColor: "red", color: "#fff", marginTop: 2 }}
          onClick={submitRequest}
        >
          Request Service
        </Button>
      </Container>
      <UserFooter />
    </>
  );
};

export default RequestService;
