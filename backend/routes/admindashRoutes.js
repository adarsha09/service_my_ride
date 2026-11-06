const express = require('express');
const db = require('../db'); 
const router = express.Router();
const mysql = require('mysql2/promise'); // Use promise-based mysql2
const dotenv = require('dotenv');

dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10, // Adjust the limit as needed
    queueLimit: 0
});

module.exports = { pool };
// Get dashboard stats
router.get('/dashboard/stats', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    
    // Total appointments (from requestforservicetable)
    const [appointmentsResult] = await connection.query(
      'SELECT COUNT(*) as total FROM requestforservicetable'
    );
    
    // Services completed (from jobcardtable where job has ended)
    const [servicesResult] = await connection.query(
      'SELECT COUNT(*) as total FROM jobcardtable WHERE jobendingtime IS NOT NULL'
    );
    
    // Active customers (from customerdetailstable)
    const [customersResult] = await connection.query(
      'SELECT COUNT(*) as total FROM customerdetailstable'
    );
    
    // Monthly revenue (from jobcardtable)
    const [revenueResult] = await connection.query(
      'SELECT SUM(net_total) as total FROM jobcardtable WHERE MONTH(STR_TO_DATE(jobdate, "%Y-%m-%d")) = MONTH(CURRENT_DATE())'
    );
    
    // Calculate percentage changes - this would normally compare to previous period
    // For demo, using fixed values that match the mock data
    const data = {
      appointments: {
        total: appointmentsResult[0].total,
        change: '+12%'
      },
      services: {
        total: servicesResult[0].total,
        change: '+8%'
      },
      customers: {
        total: customersResult[0].total,
        change: '+15%'
      },
      revenue: {
        total: revenueResult[0].total || 0,
        change: '+5%'
      }
    };

    connection.release();
    res.json(data);
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ message: 'Error fetching dashboard stats' });
  }
});

// Get recent appointments
router.get('/dashboard/appointments', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    
    const [rows] = await connection.query(`
      SELECT 
        r.jobcard_no as id,
        c.customer_name,
        r.description as service,
        v.model_number as vehicle_model,
        vd.vehicle_number,
        CASE
          WHEN j.jobendingtime IS NOT NULL THEN 'Completed'
          WHEN j.jobstartingtime IS NOT NULL THEN 'In Progress'
          ELSE 'Scheduled'
        END as status,
        r.date as time
      FROM requestforservicetable r
      LEFT JOIN customerdetailstable c ON r.customer_name = c.customer_name
      LEFT JOIN vehicledetailstable v ON r.vehicle_number = v.vehicle_number
      LEFT JOIN vehicledetailstable vd ON c.vehicle_no = vd.vehicle_number
      LEFT JOIN jobcardtable j ON r.jobcard_no = j.jobcard_no
      ORDER BY r.date DESC
      LIMIT 5
    `);
    
    connection.release();
    
    // Format the data for frontend
    const appointments = rows.map(row => ({
      id: row.id,
      customer: row.customer_name,
      service: row.service,
      vehicle: row.vehicle_model ? `${row.vehicle_model} (${row.vehicle_number})` : row.vehicle_number,
      status: row.status,
      time: new Date(row.time).toLocaleString()
    }));
    
    res.json(appointments);
  } catch (error) {
    console.error('Error fetching recent appointments:', error);
    res.status(500).json({ message: 'Error fetching recent appointments' });
  }
});

// Get service performance
router.get('/dashboard/performance', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    
    // For this example, we'll categorize services based on descriptions
    // In a real app, you might have a services table with categories
    const [rows] = await connection.query(`
      SELECT 
        CASE
          WHEN description LIKE '%engine%' THEN 'Engine Repair'
          WHEN description LIKE '%oil%' THEN 'Oil Change'
          WHEN description LIKE '%tire%' OR description LIKE '%wheel%' THEN 'Tire Services'
          WHEN description LIKE '%inspect%' OR description LIKE '%service%' THEN 'Vehicle Inspection'
          ELSE 'Other Services'
        END as name,
        COUNT(*) as total,
        SUM(CASE WHEN j.jobendingtime IS NOT NULL THEN 1 ELSE 0 END) as completed
      FROM jobcardtransaction jt
      JOIN jobcardtable j ON jt.jobcard_no = j.jobcard_no
      GROUP BY name
    `);
    
    connection.release();
    
    // Format the data for frontend
    const performance = rows.map(row => ({
      name: row.name,
      completed: row.completed,
      total: row.total,
      value: Math.round((row.completed / row.total) * 100)
    }));
    
    res.json(performance);
  } catch (error) {
    console.error('Error fetching service performance:', error);
    res.status(500).json({ message: 'Error fetching service performance' });
  }
});

// Get monthly revenue data for chart
router.get('/dashboard/revenue-chart', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    
    // Get revenue for the last 6 months
    const [rows] = await connection.query(`
      SELECT 
        DATE_FORMAT(STR_TO_DATE(jobdate, '%Y-%m-%d'), '%Y-%m') as month,
        SUM(net_total) as revenue
      FROM jobcardtable
      WHERE STR_TO_DATE(jobdate, '%Y-%m-%d') >= DATE_SUB(CURRENT_DATE(), INTERVAL 6 MONTH)
      GROUP BY month
      ORDER BY month ASC
    `);
    
    connection.release();
    
    // Format months for chart display
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const revenueData = rows.map(row => {
      const [year, month] = row.month.split('-');
      return {
        month: `${monthNames[parseInt(month) - 1]} ${year}`,
        revenue: parseFloat(row.revenue)
      };
    });
    
    res.json(revenueData);
  } catch (error) {
    console.error('Error fetching revenue chart data:', error);
    res.status(500).json({ message: 'Error fetching revenue chart data' });
  }
});

// Get top technicians
router.get('/dashboard/technicians', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    
    // Get technicians with most completed jobs
    const [rows] = await connection.query(`
      SELECT
        employee_name,
        COUNT(*) as services_completed
      FROM jobcardtable
      WHERE jobendingtime IS NOT NULL
      GROUP BY employee_name
      ORDER BY services_completed DESC
      LIMIT 3
    `);
    
    connection.release();
    res.json(rows);
  } catch (error) {
    console.error('Error fetching top technicians:', error);
    res.status(500).json({ message: 'Error fetching top technicians' });
  }
});

// Get detailed report for admin with filtering
router.get('/dashboard/report', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    // Extract filters from query params
    const { startDate, endDate, customer, vehicle, paymentStatus, reportType } = req.query;
    let baseQuery = `
      SELECT 
        j.jobcard_no,
        j.jobdate,
        c.customer_name,
        v.vehicle_number,
        v.model_number,
        j.employee_name,
        j.problem,
        j.payment_status,
        j.net_total
      FROM jobcardtable j
      LEFT JOIN customerdetailstable c ON j.customer_name = c.customer_name
      LEFT JOIN vehicledetailstable v ON j.vehicle_number = v.vehicle_number
      WHERE 1=1
    `;
    const params = [];
    if (startDate) {
      baseQuery += ' AND STR_TO_DATE(j.jobdate, "%Y-%m-%d") >= ?';
      params.push(startDate);
    }
    if (endDate) {
      baseQuery += ' AND STR_TO_DATE(j.jobdate, "%Y-%m-%d") <= ?';
      params.push(endDate);
    }
    if (customer) {
      baseQuery += ' AND c.customer_name = ?';
      params.push(customer);
    }
    if (vehicle) {
      baseQuery += ' AND v.vehicle_number = ?';
      params.push(vehicle);
    }
    if (paymentStatus) {
      baseQuery += ' AND j.payment_status = ?';
      params.push(paymentStatus);
    }
    // Example for different report types (future extension)
    if (reportType === 'pending') {
      baseQuery += ' AND j.payment_status = "pending"';
    } else if (reportType === 'completed') {
      baseQuery += ' AND j.payment_status = "Success"';
    }
    baseQuery += ' ORDER BY j.jobdate DESC';
    const [rows] = await connection.query(baseQuery, params);
    connection.release();
    res.json(rows);
  } catch (error) {
    console.error('Error fetching report:', error);
    res.status(500).json({ message: 'Error fetching report' });
  }
});

module.exports = router;
