const express = require('express');
const db = require('../db');
const router = express.Router();

// Fetch all vehicles
router.get('/fetchvehicle', (req, res) => {
    const sql = 'SELECT vehicle_id, user_id, vehicle_no, model_no, insurance_no, on_time FROM vehicle_master';
    db.query(sql, (err, result) => {
        if (err) return res.status(500).send(err);
        res.json(result);
    });
});

router.post('/addvehicle', (req, res) => {
    const { user_id, vehicle_no, model_no, insurance_no } = req.body;

    if (!user_id) return res.status(400).json({ error: 'User ID is required' });
    if (!vehicle_no) return res.status(400).json({ error: 'Vehicle Number is required' });
    if (!model_no) return res.status(400).json({ error: 'Model Number is required' });
    if (!insurance_no) return res.status(400).json({ error: 'Insurance Number is required' });

    
    const checkUserSql = "SELECT id FROM customer_details WHERE id = ?";
    db.query(checkUserSql, [user_id], (err, result) => {
        if (err) {
            console.error('Error checking user_id:', err);
            return res.status(500).json({ error: 'Database error' });
        }

        if (result.length === 0) {
            return res.status(400).json({ error: 'Invalid user_id. Customer does not exist.' });
        }

        // Insert into vehicle_master
        const sql = 'INSERT INTO vehicle_master (user_id, vehicle_no, model_no, insurance_no) VALUES (?, ?, ?, ?)';
        db.query(sql, [user_id, vehicle_no, model_no, insurance_no], (err, result) => {
            if (err) {
                console.error('Error inserting vehicle:', err);
                return res.status(500).json({ error: 'Failed to submit vehicle details' });
            }
            res.json({ success: true, message: 'Vehicle added successfully' });
        });
    });
});




// Update vehicle
router.put("/updatevehicle/:id", (req, res) => {
    const { user_id, vehicle_no, model_no, insurance_no } = req.body;
    
    if (!user_id || !vehicle_no || !model_no || !insurance_no) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const sql = "UPDATE vehicle_master SET user_id=?, vehicle_no=?, model_no=?, insurance_no=? WHERE vehicle_id=?";
    db.query(sql, [user_id, vehicle_no, model_no, insurance_no, req.params.id], (err, result) => {
        if (err) {
            console.error("Error updating vehicle:", err);
            return res.status(500).json({ success: false, message: "Update failed" });
        }
        res.json({ success: true, message: "Vehicle updated successfully" });
    });
});

//delete vehicle
router.delete("/updatevehicle/:id", (req, res) => { 
    const sql = "DELETE FROM vehicle_master WHERE vehicle_id=?";
    db.query(sql, [req.params.id], (err, result) => {
        if (err) {
            console.error("Error deleting vehicle:", err);
            return res.status(500).json({ success: false, message: "Delete failed" });
        }
        res.json({ success: true, message: "Vehicle deleted successfully" });
    });
});

module.exports = router;
