const express = require('express');
const db = require('../db');
const router = express.Router();



// View pending payments
router.get('/view-status', (req, res) => {
    const username = req.query.username; // Get username from query params

    if (!username) {
        return res.status(400).json({ error: 'Username is required' });
    }

    const query = `
        SELECT * FROM jobcardtable 
        WHERE customer_name = ? AND payment_status = 'pending'
    `;

    db.query(query, [username], (err, results) => {
        if (err) {
            console.error('Error fetching pending payments:', err);
            return res.status(500).json({ error: 'Error fetching pending payments' });
        }

        if (results.length === 0) {
            return res.json({ message: 'No pending payments found' });
        }

        res.json({ pendingPayments: results });
    });
});

// Process payment
router.post('/process-payment', (req, res) => {
    const { jobcard_no, card_number, cvv, expiration_month, expiration_year } = req.body;
    
    // Get username from headers instead of query parameters
    const username = req.headers['user-name'];

    if (!jobcard_no || !card_number || !cvv || !expiration_month || !expiration_year) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    if (!username) {
        return res.status(400).json({ error: 'User authentication required' });
    }

    const getJobCardQuery = `
        SELECT net_total FROM jobcardtable WHERE jobcard_no = ? AND customer_name = ?
    `;

    db.query(getJobCardQuery, [jobcard_no, username], (err, jobcardResults) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error occurred' });
        }
        
        if (jobcardResults.length === 0) {
            return res.status(404).json({ error: 'Job card not found or not authorized' });
        }

        const netTotal = jobcardResults[0].net_total;

        const insertPaymentQuery = `
            INSERT INTO payment (card_number, cvv, expiration_month, expiration_year, account_name, net_total, payment_status, jobcard_no) 
            VALUES (?, ?, ?, ?, ?, ?, 'Success', ?)
        `;

        db.query(insertPaymentQuery, [card_number, cvv, expiration_month, expiration_year, username, netTotal, jobcard_no], (err) => {
            if (err) {
                console.error('Payment insertion error:', err);
                return res.status(500).json({ error: 'Payment failed' });
            }

            const updateJobCardQuery = `
                UPDATE jobcardtable SET payment_status = 'Success' WHERE jobcard_no = ?
            `;

            db.query(updateJobCardQuery, [jobcard_no], (err) => {
                if (err) {
                    console.error('Job card update error:', err);
                    return res.status(500).json({ error: 'Failed to update payment status' });
                }

                res.json({ success: true, message: 'Payment successful' });
            });
        });
    });
});

// Generate invoice
router.get('/invoice', (req, res) => {
    const username = req.userName;

    const query = `
        SELECT p.*, c.* 
        FROM payment p
        JOIN customerdetailstable c ON p.account_name = c.customer_name
        WHERE p.account_name = ?
    `;

    db.query(query, [username], (err, results) => {
        if (err || results.length === 0) {
            return res.status(500).json({ error: 'Error generating invoice' });
        }

        const invoiceData = results[0];
        res.json({ invoice: invoiceData });
    });
});

// Generate invoice
router.get('/invoice/:jobcard_no', (req, res) => {
    // Get username from headers
    const username = req.headers['user-name'];
    const jobcard_no = req.params.jobcard_no;

    // Validate inputs
    if (!username) {
        return res.status(400).json({ error: 'Authentication required' });
    }

    if (!jobcard_no) {
        return res.status(400).json({ error: 'Invalid job card number' });
    }

    console.log(`Fetching invoice for username: ${username}, jobcard_no: ${jobcard_no}`);

    const query = `
        SELECT p.*, c.*, j.* 
        FROM payment p
        JOIN customerdetailstable c ON p.account_name = c.customer_name
        JOIN jobcardtable j ON p.jobcard_no = j.jobcard_no
        WHERE p.account_name = ? AND p.jobcard_no = ?
    `;

    db.query(query, [username, jobcard_no], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Error generating invoice' });
        }
        
        if (results.length === 0) {
            return res.status(404).json({ error: 'Invoice not found' });
        }

        const invoiceData = results[0];
        res.json({ invoice: invoiceData });
    });
});
module.exports = router;
