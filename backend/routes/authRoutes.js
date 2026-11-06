const express = require('express');
const db = require('../db'); 
const router = express.Router();

// Register
router.post('/register', (req, res) => {
    const { user_name, password, user_type, phone } = req.body;  
    const sql = 'INSERT INTO user_creationtable (user_name, password, user_type, phone) VALUES (?, ?, ?, ?)';
    db.query(sql, [user_name, password, user_type, phone], (err, result) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') { 
                return res.status(400).json({ message: 'Username already taken' });
            }
            return res.status(500).json({ message: 'Server error', error: err });
        }
        res.json({ message: 'Registration successful' });
    });
});

// Login
router.post('/login', (req, res) => {
    const { user_name, password } = req.body;
    const sql = 'SELECT * FROM user_creationtable WHERE user_name = ? AND password = ?';
    db.query(sql, [user_name, password], (err, result) => {
        if (err) return res.status(500).send(err);
        if (result.length > 0) {
            res.json({ success: true, user_id: result[0].user_id, user_type: result[0].user_type, user_name: result[0].user_name });
        } else {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
    });
});

router.post('/change-password', (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const sql = 'SELECT * FROM user_creationtable WHERE user_type = "admin"';

    db.query(sql, (err, result) => {
        if (err) return res.status(500).send('Error occurred');
        const user = result[0]; // Assuming there's only one admin user
        if (user) {
            // Directly compare the current password (without bcrypt)
            if (user.password === currentPassword) {
                // Update password directly
                const updateSql = 'UPDATE user_creationtable SET password = ? WHERE user_id = ?';
                db.query(updateSql, [newPassword, user.user_id], (err) => {
                    if (err) return res.status(500).send('Failed to update password');
                    res.json({ success: true });
                });
            } else {
                res.status(401).send('Incorrect current password');
            }
        } else {
            res.status(404).send('User not found');
        }
    });
});

router.get('/users', (req, res) => {
    const sql = 'SELECT * FROM user_creationtable';  // Changed to select all fields for debugging
    db.query(sql, (err, result) => {
        if (err) return res.status(500).send(err);
        // Map the result to include the id property for DataGrid
        const users = result.map(user => ({
            ...user,
            id: user.user_id  // Add id field for DataGrid
        }));
        res.json(users);
    });
});

// Fixed the routes to match what frontend expects
router.delete('/users/:id', (req, res) => {  // Changed from /user/:id to /users/:id
    const { id } = req.params;
    const sql = 'DELETE FROM user_creationtable WHERE user_id = ?';
    db.query(sql, [id], (err) => {
        if (err) return res.status(500).send(err);
        res.send('User deleted successfully');
    });
});

router.put('/users/:id', (req, res) => {  // Changed from /user/:id to /users/:id
    const { id } = req.params;
    const { user_name, user_type, phone } = req.body;
    const sql = 'UPDATE user_creationtable SET user_name = ?, user_type = ?, phone = ? WHERE user_id = ?';
    db.query(sql, [user_name, user_type, phone, id], (err) => {
        if (err) return res.status(500).send(err);
        res.send('User updated successfully');
    });
});

module.exports = router;