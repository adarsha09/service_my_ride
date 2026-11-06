const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const otpRoutes = require('./routes/otpRoutes');
// const feedbackRoutes = require('./routes/route');
// const vehicleRoutes=require('./routes/vmanage');
const CustomerRoutes=require('./routes/customers');
const vehicleRoutes=require('./routes/vehicle');
const EmpPassword=require('./routes/password');
const feedbackRoutes=require('./routes/route');
const requestServiceRoutes = require('./routes/requestServiceRoutes');
const employeeRoutes = require('./routes/employeeServiceRoutes');
const jobCardRoutes = require('./routes/jobCardRoutes');
const viewStatusRoutes = require('./routes/viewStatusRoutes');
const admindashRoutes = require('./routes/admindashRoutes');
const bodyParser = require('body-parser');

dotenv.config();
const app = express();

app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(bodyParser.json());


app.use('/api/auth', authRoutes);
app.use('/api/otp', otpRoutes);
// app.use('/api/feedback',feedbackRoutes);
app.use('/api/vehicle',vehicleRoutes);
app.use('/api/customers',CustomerRoutes);
app.use('/api/password', EmpPassword);
app.use('/api',feedbackRoutes);
app.use('/api', requestServiceRoutes);
app.use('/api', employeeRoutes);
app.use('/api', jobCardRoutes);
app.use('/api', viewStatusRoutes);
app.use('/api/admin', admindashRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
   });

  