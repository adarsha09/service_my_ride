const express = require('express');
const db = require('../db'); 
const router = express.Router();


router.post("/search-vehicle", (req, res) => {
    const { vehicleNumber } = req.body;
    const sql = "SELECT vehicle_number, model_number, insurance_number FROM vehicledetailstable WHERE vehicle_number = ?";
    
    db.query(sql, [vehicleNumber], (err, result) => {
      if (err) return res.status(500).json({ error: "Database error" });
      
      if (result.length > 0) {
        res.json(result);
      } else {
        res.json({ message: "No vehicle found" });
      }
    });
  });
  
  // Request for Service (Without Job Card Number)
  router.post("/request-service", (req, res) => {
    const { vehicle_number, customer_name, description } = req.body;
    const date = new Date();
  
    const sql = "INSERT INTO requestforservicetable (vehicle_number, customer_name, description, status, date) VALUES (?, ?, ?, 'initiated', ?)";
  
    db.query(sql, [vehicle_number, customer_name, description, date], (err, result) => {
      if (err) return res.status(500).json({ error: "Failed to add request" });
  
      res.json({ success: true, message: "Service request submitted successfully" });
    });
  });

  module.exports = router;