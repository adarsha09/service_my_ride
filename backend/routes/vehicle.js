// const express = require('express');
// const router = express.Router();
// const db = require('../db'); // Adjust path as needed for your database connection

// // Get all customers for dropdown
// router.get('/customers', (req, res) => {
//     const sql = 'SELECT customer_id, customer_name FROM customerdetailstable ORDER BY customer_name';
//     db.query(sql, (err, results) => {
//         if (err) return res.status(500).json({ error: 'Database error', details: err });
//         res.json(results);
//     });
// });

// // Get vehicle details by customer ID
// router.get('/customer-vehicles/:customer_id', (req, res) => {
//     const customerId = req.params.customer_id;
//     const sql = 'SELECT vehicle_no FROM customerdetailstable  WHERE customer_id = ?';
   
//     db.query(sql, [customerId], (err, results) => {
//         if (err) return res.status(500).json({ error: 'Database error', details: err });
//         res.json(results);
//     });
// });

// // Get vehicle details by vehicle number
// router.get('/vehicle-details/:vehicle_number', (req, res) => {
//     const vehicleNumber = req.params.vehicle_number;
//     const sql = 'SELECT v.vehicle_id, v.vehicle_number, v.model_number, v.insurance_number, v.customer_id FROM vehicledetailstable v WHERE v.vehicle_number = ?';
   
//     db.query(sql, [vehicleNumber], (err, results) => {
//         if (err) return res.status(500).json({ error: 'Database error', details: err });
//         if (results.length === 0) return res.status(404).json({ error: 'Vehicle not found' });
//         res.json(results[0]);
//     });
// });

// // Add new vehicle details
// router.post('/vehicle-details', (req, res) => {
//     const { customer_id, vehicle_number, model_number, insurance_number } = req.body;

//     if (!customer_id || !vehicle_number) {
//         return res.status(400).json({ error: 'Customer ID and vehicle number are required' });
//     }

//     const date = new Date().toISOString().split('T')[0]; // Current date in YYYY-MM-DD format
//     const sql = `INSERT INTO vehicledetailstable (customer_id, vehicle_number, model_number, insurance_number, date) VALUES (?, ?, ?, ?, ?)`;
   
//     db.query(sql, [customer_id, vehicle_number, model_number, insurance_number, date], (err, result) => {
//         if (err) return res.status(500).json({ error: 'Database error', details: err });
//         res.json({ message: 'Vehicle details added successfully', vehicleId: result.insertId });
//     });
// });

// // Update vehicle details
// router.put('/vehicle-details/:vehicle_id', (req, res) => {
//     const vehicleId = req.params.vehicle_id;
//     const { model_number, insurance_number } = req.body;
   
//     const sql = `UPDATE vehicledetailstable SET model_number = ?, insurance_number = ? WHERE vehicle_id = ?`;
   
//     db.query(sql, [model_number, insurance_number, vehicleId], (err, result) => {
//         if (err) return res.status(500).json({ error: 'Database error', details: err });
//         if (result.affectedRows === 0) return res.status(404).json({ error: 'Vehicle not found' });
//         res.json({ message: 'Vehicle details updated successfully' });
//     });
// });

// module.exports = router;

const express = require('express');
const router = express.Router();
const db = require('../db'); // Adjust path as needed for your database connection

// Get all customers for dropdown
router.get('/customers', (req, res) => {
    const sql = 'SELECT customer_id, customer_name FROM customerdetailstable ORDER BY customer_name';
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: 'Database error', details: err });
        res.json(results);
    });
});

// Get vehicle details by customer ID
router.get('/customer-vehicles/:customer_id', (req, res) => {
    const customerId = req.params.customer_id;
    const sql = 'SELECT vehicle_no FROM customerdetailstable  WHERE customer_id = ?';
   
    db.query(sql, [customerId], (err, results) => {
        if (err) return res.status(500).json({ error: 'Database error', details: err });
        res.json(results);
    });
});

// Get vehicle details by vehicle number
router.get('/vehicle-details', (req, res) => {
    // const vehicleNumber = req.params.vehicle_number;
    const sql = 'SELECT * FROM vehicledetailstable';
   
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: 'Database error', details: err });
        if (results.length === 0) return res.status(404).json({ error: 'Vehicle not found' });
        res.json(results);
    });
});

// Add new vehicle details
router.post('/vehicle-details', (req, res) => {
    const { customer_id, vehicle_number, model_number, insurance_number } = req.body;

    if (!customer_id || !vehicle_number) {
        return res.status(400).json({ error: 'Customer ID and vehicle number are required' });
    }

    const date = new Date().toISOString().split('T')[0]; // Current date in YYYY-MM-DD format
    const sql = `INSERT INTO vehicledetailstable (customer_id, vehicle_number, model_number, insurance_number, date) VALUES (?, ?, ?, ?, ?)`;
   
    db.query(sql, [customer_id, vehicle_number, model_number, insurance_number, date], (err, result) => {
        if (err) return res.status(500).json({ error: 'Database error', details: err });
        res.json({ message: 'Vehicle details added successfully', vehicleId: result.insertId });
    });
});

// Update vehicle details
router.put('/vehicle-details/:vehicle_id', (req, res) => {
    const vehicleId = req.params.vehicle_id;
    const { customer_id, vehicle_number, model_number, insurance_number } = req.body;
   
    const sql = `UPDATE vehicledetailstable SET customer_id = ?, vehicle_number = ?, model_number = ?, insurance_number = ? WHERE vehicle_id = ?`;
   
    db.query(sql, [customer_id, vehicle_number, model_number, insurance_number, vehicleId], (err, result) => {
        if (err) return res.status(500).json({ error: 'Database error', details: err });
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Vehicle not found' });
        res.json({ message: 'Vehicle details updated successfully' });
    });
});


// Delete a vehicle
router.delete('/vehicle-details/:id', (req, res) => {
    const vehicleId = req.params.id;
    const query = 'DELETE FROM vehicledetailstable WHERE vehicle_id = ?';
  
    db.query(query, [vehicleId], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send({ error: 'Failed to delete vehicle' });
        }
        res.json({ message: 'Veicle deleted successfully' });
    });
});

// Get vehicle details by vehicle number (query param)
router.get('/vehicle-details/by-number', (req, res) => {
    const { vehicle_number } = req.query;
    if (!vehicle_number) {
        return res.status(400).json({ error: 'vehicle_number is required' });
    }
    const sql = 'SELECT * FROM vehicledetailstable WHERE vehicle_number = ?';
    db.query(sql, [vehicle_number], (err, result) => {
        if (err) return res.status(500).json({ error: 'Database error', details: err });
        res.json(result);
    });
});

module.exports = router;