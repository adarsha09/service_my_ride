const express = require('express');
const db = require('../db'); 
const router = express.Router();

router.post('/change-password-employee', (req, res) => {
    const { user_id, currentPassword, newPassword } = req.body;
  
    // First, get the specific user by their user_id
    const sql = 'SELECT * FROM user_creationtable WHERE user_id = ?';
    
    db.query(sql, [user_id], (err, result) => {
      if (err) return res.status(500).json({ success: false, message: 'Error occurred', error: err });
  
      if (result.length > 0) {
        const user = result[0]; 
        
        // Check if current password matches
        if (user.password === currentPassword) {
          // Update the password - note we're using user_id, not id
          const updateSql = 'UPDATE user_creationtable SET password = ? WHERE user_id = ?';
          
          db.query(updateSql, [newPassword, user_id], (err) => {
            if (err) return res.status(500).json({ success: false, message: 'Failed to update password', error: err });
            res.json({ success: true, message: 'Password updated successfully' });
          });
        } else {
          res.status(401).json({ success: false, message: 'Incorrect current password' });
        }
      } else {
        res.status(404).json({ success: false, message: 'User not found' });
      }
    });
});

module.exports = router;