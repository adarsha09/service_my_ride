const express = require('express');
const db = require('../db');
const router = express.Router();
const cors = require("cors");

// Manage Feedback
router.get('/feedback', (req, res) => {
    const sql = 'SELECT id, name, email, feedback, created_at FROM feedback';
    db.query(sql, (err, result) => {
        if (err) return res.status(500).send(err);
        res.json(result);
    });
});

// Add Feedback Route
router.post('/feedback', (req, res) => {
    const { name, email, feedback, created_at } = req.body;

    if (!name || !email || !feedback) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const sql = 'INSERT INTO feedback (name, email, feedback, created_at) VALUES (?, ?, ?, ?)';
    
    db.query(sql, [name, email, feedback, created_at], (err, result) => {
        if (err) {
            console.error('Error inserting feedback:', err);
            return res.status(500).json({ error: 'Failed to submit feedback' });
        }
        res.json({ success: true, message: 'Feedback submitted successfully' });
    });
});

router.put('/feedback/:id', (req, res) => {
    const { name, email, feedback, created_at } = req.body;
    const feedbackId = req.params.id;

    if (!name || !email || !feedback) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const sql = 'UPDATE feedback SET name=?, email=?, feedback=?, created_at=? WHERE id=?';

    db.query(sql, [name, email, feedback, created_at, feedbackId], (err, result) => {
        if (err) {
            console.error('Error updating feedback:', err);
            return res.status(500).json({ error: 'Failed to update feedback' });
        }

        res.json({ success: true, message: 'Feedback updated successfully' });
    });
});

router.delete('/feedback/:id', (req, res) => {
    const feedbackId = req.params.id;

    const deleteSql = 'DELETE FROM feedback WHERE id = ?';
    const resetAutoIncrementSql = 'ALTER TABLE feedback AUTO_INCREMENT = 1';

    db.query(deleteSql, [feedbackId], (err, result) => {
        if (err) {
            console.error('Error deleting feedback:', err);
            return res.status(500).json({ error: 'Failed to delete feedback' });
        }

        // Reset auto-increment
        db.query(resetAutoIncrementSql, (err) => {
            if (err) {
                console.error('Error resetting auto-increment:', err);
                return res.status(500).json({ error: 'Failed to reset auto-increment' });
            }
            res.json({ success: true, message: 'Feedback deleted and IDs reset' });
        });
    });
});

module.exports = router;
