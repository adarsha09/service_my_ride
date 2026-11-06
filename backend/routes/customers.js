const express = require('express');
const db = require('../db');
const router = express.Router();

router.get('/customerdetails',(req,res)=>{
    const { customer } = req.query;
    let sql = 'SELECT  customer_id, customer_name, address, contact_no, email_id, vehicle_no FROM customerdetailstable';
    let params = [];
    if (customer) {
        sql += ' WHERE customer_name = ?';
        params.push(customer);
    }
    db.query(sql, params, (err,result)=>{
        if(err)return res.status(500).send(err);
        res.json(result);
    });
});

// Add new customer
router.post('/customerdetails', (req, res) => {
    const { customer_name, address, contact_no, email_id, vehicle_no } = req.body;

    if (!customer_name) {
        return res.status(400).json({ error: 'Customer required' });
    }

    if ( !address) {
        return res.status(400).json({ error: 'Address required' });
    }

    if (!contact_no ) {
        return res.status(400).json({ error: 'Contact number required' });
    }

    if ( !email_id ) {
        return res.status(400).json({ error: 'Email Id required' });
    }

    if ( !vehicle_no) {
        return res.status(400).json({ error: 'Vehicle number required' });
    }

    const sql = 'INSERT INTO customerdetailstable ( customer_name, address, contact_no, email_id,vehicle_no) VALUES (?, ?, ?, ?, ?)';


    db.query(sql, [ customer_name, address, contact_no, email_id,vehicle_no], (err, result) => {
        if (err) {
            console.error('Error inserting details:', err);
            return res.status(500).json({ error: 'Failed to submit customers details' });
        }
        res.json({ success: true, message: 'customer added successfully' });
    });
});



// Update customer Details
router.put("/customerdetails/:id", (req, res) => {
    const { customer_name, address, contact_no, email_id,vehicle_no } = req.body;
    
    if (!customer_name || !address || !contact_no || !email_id || !vehicle_no) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const sql = "UPDATE customerdetailstable SET customer_name=?, address=?, contact_no=?, email_id=?, vehicle_no=? WHERE customer_id=?";
    db.query(sql, [customer_name, address, contact_no, email_id,vehicle_no, req.params.id], (err, result) => {
        if (err) {
            console.error("Error updating vehicle:", err);
            return res.status(500).json({ success: false, message: "Update failed" });
        }
        res.json({ success: true, message: "Details updated successfully" });
    });
});

//delete customer
router.delete("/customerdetails/:id", (req, res) => { 
    const sql = "DELETE FROM customerdetailstable WHERE customer_id=?";
    db.query(sql, [req.params.id], (err, result) => {
        if (err) {
            console.error("Error deleting vehicle:", err);
            return res.status(500).json({ success: false, message: "Delete failed" });
        }
        res.json({ success: true, message: "Customer deleted successfully" });
    });
});

// Get customer details by customer_id
router.get('/customerdetails/by-id', (req, res) => {
    const { customer_id } = req.query;
    if (!customer_id) {
        return res.status(400).json({ error: 'customer_id is required' });
    }
    const sql = 'SELECT customer_id, customer_name, address, contact_no, email_id, vehicle_no FROM customerdetailstable WHERE customer_id = ?';
    db.query(sql, [customer_id], (err, result) => {
        if (err) return res.status(500).send(err);
        res.json(result);
    });
});
module.exports = router;