const express = require('express');
const db = require('../db');
const router = express.Router();

// Search job card by job card number
router.post('/search-jobcard', (req, res) => {
    const { jobcard_no } = req.body;

    if (!jobcard_no) {
        return res.status(400).json({ error: 'Jobcard number is required' });
    }

    const fetchJobCardQuery = `
        SELECT * FROM jobcardtable WHERE jobcard_no = ?
    `;

    db.query(fetchJobCardQuery, [jobcard_no], (err, jobcardResults) => {
        if (err) {
            return res.status(500).json({ error: 'Error fetching job card details' });
        }

        if (jobcardResults.length === 0) {
            return res.status(404).json({ message: 'Jobcard not found' });
        }

        const jobcard = jobcardResults[0];
        const fetchCustomerQuery = `
            SELECT * FROM customerdetailstable WHERE vehicle_no = ?
        `;

        db.query(fetchCustomerQuery, [jobcard.vehicle_number], (err, customerResults) => {
            if (err) {
                return res.status(500).json({ error: 'Error fetching customer details' });
            }

            res.json({
                jobcard,
                customerDetails: customerResults.length > 0 ? customerResults : null,
            });
        });
    });
});

// Update job card details
router.post('/update-jobcard', (req, res) => {
    const { jobcard_no, description, grossTotal, gst, netTotal, jobendingtime, noofhours } = req.body;

    if (!jobcard_no || !description || !grossTotal || !gst || !netTotal || !jobendingtime || !noofhours) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const updateJobCardQuery = `
        UPDATE jobcardtable 
        SET jobendingtime = ?, noofhours = ?, net_total = ?, payment_status = 'pending' 
        WHERE jobcard_no = ?
    `;

    db.query(updateJobCardQuery, [jobendingtime, noofhours, netTotal, jobcard_no], (err) => {
        if (err) {
            return res.status(500).json({ error: 'Error updating job card' });
        }

        const insertTransactionQuery = `
            INSERT INTO jobcardtransaction (jobcard_no, description, gross_total, gst, net_total) 
            VALUES (?, ?, ?, ?, ?)
        `;

        db.query(insertTransactionQuery, [jobcard_no, description, grossTotal, gst, netTotal], (err) => {
            if (err) {
                return res.status(500).json({ error: 'Error adding job card transaction' });
            }

            res.json({ success: true, message: 'Job card updated successfully' });
        });
    });
});

module.exports = router;