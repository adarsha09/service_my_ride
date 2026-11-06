import React, { useEffect, useState, useRef } from 'react';
import AdminNavbar from '../../components/AdminNavbar';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Alert, TextField, MenuItem, Button, Grid } from '@mui/material';
import axios from 'axios';

const mainReportTypes = [
  { value: 'user', label: 'User Report' },
  { value: 'employee', label: 'Employee Report' },
  { value: 'vehicle', label: 'Vehicle Report' },
];

const paymentStatusOptions = [
  { value: '', label: 'All' },
  { value: 'Success', label: 'Success' },
  { value: 'pending', label: 'Pending' },
];

const Reports = () => {
  const [reportType, setReportType] = useState('user');
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    customer: '',
    vehicle: '',
    paymentStatus: '',
  });
  const [customers, setCustomers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [selectedCustomerName, setSelectedCustomerName] = useState('');
  const tableRef = useRef();

  useEffect(() => {
    // Dynamically load html2pdf.js if not present
    if (!window.html2pdf) {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  useEffect(() => {
    // Fetch customers and vehicles for dropdowns
    const fetchOptions = async () => {
      try {
        const [custRes, vehRes] = await Promise.all([
          axios.get('http://localhost:5000/api/customers/customerdetails'),
          axios.get('http://localhost:5000/api/vehicle/vehicle-details'),
        ]);
        setCustomers(custRes.data);
        setVehicles(vehRes.data);
      } catch (err) {
        // ignore for now
      }
    };
    fetchOptions();
  }, []);

  const fetchReport = async (appliedFilters = filters, type = reportType) => {
    try {
      setLoading(true);
      setError(null);
      let url = '';
      let params = {};
      switch (type) {
        case 'user':
          if (appliedFilters.customer) {
            url = 'http://localhost:5000/api/customers/customerdetails/by-id';
            params.customer_id = appliedFilters.customer;
            // Find and set the selected customer name for heading
            const found = customers.find(c => String(c.customer_id) === String(appliedFilters.customer));
            setSelectedCustomerName(found ? found.customer_name : '');
          } else {
            url = 'http://localhost:5000/api/customers/customerdetails';
            setSelectedCustomerName('');
          }
          break;
        case 'employee':
          url = 'http://localhost:5000/api/auth/users';
          params = { user_type: 'employee' };
          break;
        case 'vehicle':
          if (appliedFilters.vehicle) {
            url = 'http://localhost:5000/api/vehicle/vehicle-details/by-number';
            params.vehicle_number = appliedFilters.vehicle;
          } else {
            url = 'http://localhost:5000/api/vehicle/vehicle-details';
          }
          break;
        default:
          url = 'http://localhost:5000/api/customers/customerdetails';
      }
      const res = await axios.get(url, { params });
      setReportData(res.data);
    } catch (err) {
      setError('Failed to fetch report data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport(filters, reportType);
    // eslint-disable-next-line
  }, [reportType]);

  const handleFilterChange = (e) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleReportTypeChange = (e) => {
    setReportType(e.target.value);
    setFilters({ customer: '', vehicle: '', paymentStatus: '' });
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchReport(filters, reportType);
  };

  const handleReset = () => {
    const resetFilters = { customer: '', vehicle: '', paymentStatus: '' };
    setFilters(resetFilters);
    fetchReport(resetFilters, reportType);
  };

  // Helper to get heading for report
  const getReportHeading = () => {
    let heading = '';
    if (reportType === 'user') {
      heading = 'User Report';
      if (filters.customer && selectedCustomerName) heading += ` - Customer: ${selectedCustomerName}`;
    } else if (reportType === 'employee') {
      heading = 'Employee Report';
      // Removed payment status from heading
    } else if (reportType === 'vehicle') {
      heading = 'Vehicle Report';
      if (filters.vehicle) heading += ` - Vehicle: ${filters.vehicle}`;
    }
    return heading;
  };

  // PDF Export logic using html2pdf.js
  const handleDownloadPDF = () => {
    if (!window.html2pdf) {
      alert('PDF export is not ready yet. Please try again in a few seconds.');
      return;
    }
    const element = document.createElement('div');
    element.style.padding = '16px';
    element.innerHTML = `
      <h2 style='text-align:center;margin-bottom:16px;'>${getReportHeading()}</h2>
      ${tableRef.current.outerHTML}
    `;
    const opt = {
      margin: 0.2,
      filename: `${reportType}_report.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'landscape' },
    };
    window.html2pdf().set(opt).from(element).save();
  };

  // Table columns for each report type
  const getTableColumns = () => {
    if (reportType === 'user') {
      return [
        'Customer Name',
        'Address',
        'Contact No',
        'Email',
        'Vehicle No',
      ];
    } else if (reportType === 'employee') {
      return [
        'Employee Name',
        'User Type',
        'Phone',
        'Email',
      ];
    } else if (reportType === 'vehicle') {
      return [
        'Vehicle No',
        'Model No',
        'Insurance No',
        'Customer ID',
        'Date',
      ];
    }
    return [];
  };

  const getTableRows = () => {
    if (reportType === 'user') {
      return reportData.map((row, idx) => (
        <TableRow key={idx}
        >
          <TableCell>{row.customer_name}</TableCell>
          <TableCell>{row.address}</TableCell>
          <TableCell>{row.contact_no}</TableCell>
          <TableCell>{row.email_id}</TableCell>
          <TableCell>{row.vehicle_no}</TableCell>
        </TableRow>
      ));
    } else if (reportType === 'employee') {
      return reportData.filter((row) => row.user_type === 'employee').map((row, idx) => (
        <TableRow key={idx}>
          <TableCell>{row.user_name}</TableCell>
          <TableCell>{row.user_type}</TableCell>
          <TableCell>{row.phone}</TableCell>
          <TableCell>{row.email}</TableCell>
        </TableRow>
      ));
    } else if (reportType === 'vehicle') {
      return reportData.map((row, idx) => (
        <TableRow key={idx}>
          <TableCell>{row.vehicle_number}</TableCell>
          <TableCell>{row.model_number}</TableCell>
          <TableCell>{row.insurance_number}</TableCell>
          <TableCell>{row.customer_id}</TableCell>
          <TableCell>{row.date}</TableCell>
        </TableRow>
      ));
    }
    return null;
  };

  return (
    <div style={{ display: 'flex', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <AdminNavbar />
      <Box sx={{ marginLeft: '260px', padding: '24px', width: '100%',background: 'linear-gradient(135deg, #8dccc9 0%, #72b9b3 50%, #57e8d7 100%)'}}>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
          {getReportHeading()}
        </Typography>
        {/* Report Type Selector */}
        <Paper sx={{ mb: 3, p: 2, borderRadius: 2 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                select
                label="Report Type"
                name="mainReportType"
                value={reportType}
                onChange={handleReportTypeChange}
                fullWidth
              >
                {mainReportTypes.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                ))}
              </TextField>
            </Grid>
            {/* Filters for each report type */}
            {reportType === 'user' && (
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  select
                  label="Customer"
                  name="customer"
                  value={filters.customer}
                  onChange={handleFilterChange}
                  fullWidth
                >
                  <MenuItem value="">All</MenuItem>
                  {customers.map((c) => (
                    <MenuItem key={c.customer_id} value={c.customer_id}>{c.customer_name}</MenuItem>
                  ))}
                </TextField>
              </Grid>
            )}
            {reportType === 'vehicle' && (
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  select
                  label="Vehicle"
                  name="vehicle"
                  value={filters.vehicle}
                  onChange={handleFilterChange}
                  fullWidth
                >
                  <MenuItem value="">All</MenuItem>
                  {vehicles.map((v) => (
                    <MenuItem key={v.vehicle_number} value={v.vehicle_number}>{v.vehicle_number}</MenuItem>
                  ))}
                </TextField>
              </Grid>
            )}
            {reportType === 'employee' && (
              <></>
            )}
            <Grid item xs={12} sm={6} md={2}>
              <Button type="submit" variant="contained" color="primary" fullWidth onClick={handleFilterSubmit}>
                Apply
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Button variant="outlined" color="secondary" onClick={handleReset} fullWidth>
                Reset
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Button variant="contained" color="success" onClick={handleDownloadPDF} fullWidth>
                Download PDF
              </Button>
            </Grid>
          </Grid>
        </Paper>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <TableContainer component={Paper} sx={{
    borderRadius: 2,
    boxShadow: 2,
    
    '& .MuiTableRow-root': {
      backgroundColor: '#b1bccd', // default row color
    },
    '& .MuiTableRow-root:hover': {
  backgroundColor: '#b1bccd',              // hover background
  transform: 'scale(1.01)',                // slight zoom
  transition: 'all 0.3s ease-in-out',      // smoother transition
  boxShadow: `
    0 4px 12px rgba(0,0,0,0.15),           /* existing subtle shadow */
    0 0 15px rgba(0,198,255,0.8),          /* bright glow */
    0 0 30px rgba(0,198,255,0.6)           /* softer spread glow */
  `,
}

  }}>
            <Table ref={tableRef} id="pdf-table">
              <TableHead>
                <TableRow>
                  {getTableColumns().map((col) => (
                    <TableCell key={col}
                    sx={{ color: '#000', fontWeight: 700 }}   // dark + bold header text
                    >{col}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {reportData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={getTableColumns().length} align="center">No report data found.</TableCell>
                  </TableRow>
                ) : (
                  getTableRows()
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </div>
  );
};

export default Reports;
