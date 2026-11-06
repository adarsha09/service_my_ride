const express = require('express');
const db = require('../db');
const router = express.Router();

// Update service request and assign job card
router.post('/approve-service', (req, res) => {
    const { jobdate, jobstartingtime, jobcard_no, customer_name, vehicle_no, description, employee_name } = req.body;

    // Update the service request
    const updateRequestQuery = `
        UPDATE requestforservicetable 
        SET jobcard_no = ?, status = 'Approved' 
        WHERE vehicle_number = ? AND status = 'initiated'
    `;

    db.query(updateRequestQuery, [jobcard_no, vehicle_no], (err, updateResult) => {
        if (err) {
            return res.status(500).json({ error: 'Error updating requestforservicetable' });
        }

        // Insert into job card table
        const insertJobCardQuery = `
            INSERT INTO jobcardtable 
            (jobdate, jobstartingtime, jobendingtime, jobcard_no, employee_name, problem, vehicle_number, customer_name) 
            VALUES (?, ?, '', ?, ?, ?, ?, ?)
        `;

        db.query(insertJobCardQuery, [jobdate, jobstartingtime, jobcard_no, employee_name, description, vehicle_no, customer_name], (err, insertResult) => {
            if (err) {
                return res.status(500).json({ error: 'Error inserting into jobcardtable' });
            }

            res.json({ success: true, message: 'Service approved and job card assigned successfully' });
        });
    });
});

// Fetch all initiated service requests
router.get('/initiated-services', (req, res) => {
    const fetchRequestsQuery = `
        SELECT * FROM requestforservicetable WHERE status = 'initiated'
    `;

    db.query(fetchRequestsQuery, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error fetching initiated services' });
        }

        res.json(results);
    });
});

// Fetch customer details by vehicle number
router.get('/customer-details/:vehicleNumber', (req, res) => {
    const { vehicleNumber } = req.params;

    const fetchCustomerQuery = `
        SELECT * FROM customerdetailstable WHERE vehicle_no = ?
    `;

    db.query(fetchCustomerQuery, [vehicleNumber], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error fetching customer details' });
        }

        if (results.length > 0) {
            res.json(results[0]);
        } else {
            res.status(404).json({ message: 'Customer not found' });
        }
    });
});

module.exports = router;