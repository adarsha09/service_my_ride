import React, { useState, useEffect } from "react";
import AdminNavbar from "../../components/AdminNavbar";
import { 
  Typography, 
  Grid, 
  Paper, 
  Box, 
  Card, 
  CardContent, 
  CardHeader,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  LinearProgress,
  Avatar,
  IconButton,
  CircularProgress
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import BuildIcon from '@mui/icons-material/Build';
import PeopleIcon from '@mui/icons-material/People';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ScheduleIcon from '@mui/icons-material/Schedule';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import axios from 'axios';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
const statColors = {
  "Total Appointments": "linear-gradient(135deg, #76a1c3 50%, #1e88e5 100%)", // Blue
  "Services Completed": "linear-gradient(135deg, #43E97B 10%, #388e3c 120%)", // Green
  "Active Customers": "linear-gradient(135deg, #2AF598 0%, #009EFD 100%)",   // Teal
  "Revenue (Monthly)": "linear-gradient(135deg, #F093FB 0%, #f57c00 100%)", // Orange
};


const AdminDash = () => {
  const navigate = useNavigate();
  
  // State for data from API
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([]);
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [servicePerformance, setServicePerformance] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [topTechnicians, setTopTechnicians] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch all data in parallel
        const [statsRes, appointmentsRes, performanceRes, revenueRes, techniciansRes] = await Promise.all([
          axios.get('http://localhost:5000/api/admin/dashboard/stats'),
          axios.get('http://localhost:5000/api/admin/dashboard/appointments'),
          axios.get('http://localhost:5000/api/admin/dashboard/performance'),
          axios.get('http://localhost:5000/api/admin/dashboard/revenue-chart'),
          axios.get('http://localhost:5000/api/admin/dashboard/technicians')
        ]);
        
        // Transform stats data for display
        const statsData = [
          { 
            title: "Total Appointments", 
            value: statsRes.data.appointments.total.toString(), 
            icon: <DirectionsCarIcon sx={{ fontSize: 40 }} color="primary" />, 
            change: statsRes.data.appointments.change 
          },
          { 
            title: "Services Completed", 
            value: statsRes.data.services.total.toString(), 
            icon: <BuildIcon sx={{ fontSize: 40 }} color="success" />, 
            change: statsRes.data.services.change 
          },
          { 
            title: "Active Customers", 
            value: statsRes.data.customers.total.toString(), 
            icon: <PeopleIcon sx={{ fontSize: 40 }} color="info" />, 
            change: statsRes.data.customers.change 
          },
          { 
            title: "Revenue (Monthly)", 
            value: `$${parseFloat(statsRes.data.revenue.total).toLocaleString()}`, 
            icon: <AttachMoneyIcon sx={{ fontSize: 40 }} color="warning" />, 
            change: statsRes.data.revenue.change 
          },
        ];
        
        setStats(statsData);
        setRecentAppointments(appointmentsRes.data);
        setServicePerformance(performanceRes.data);
        setRevenueData(revenueRes.data);
        setTopTechnicians(techniciansRes.data);
        
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  const getStatusColor = (status) => {
    switch(status) {
      case "Completed": return "success.main";
      case "In Progress": return "info.main";
      case "Scheduled": return "warning.main";
      default: return "text.secondary";
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case "Completed": return <CheckCircleIcon sx={{ color: "success.main" }} />;
      case "In Progress": return <BuildIcon sx={{ color: "info.main" }} />;
      case "Scheduled": return <ScheduleIcon sx={{ color: "warning.main" }} />;
      default: return null;
    }
  };

  const getTrendIcon = (change) => {
    return change.startsWith('+') ? 
      <TrendingUpIcon fontSize="small" sx={{ color: 'success.main', ml: 1 }} /> : 
      <TrendingDownIcon fontSize="small" sx={{ color: 'error.main', ml: 1 }} />;
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <Typography color="error">{error}</Typography>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", background: "linear-gradient(135deg, #3ad6ea 20%, #86a6b4 100%, #55b0e1 100%)", minHeight: "100vh" }}>
      <AdminNavbar />
      <Box sx={{ marginLeft: "260px", padding: "24px", width: "100%" }}>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
          Admin Dashboard
        </Typography>
        
        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
               <Card
            sx={{
              background: `linear-gradient(135deg, ${stat.color}33, ${stat.color}66)`,
              boxShadow: `0 4px 20px ${stat.color}55`,
              transition: "transform 0.3s ease",
              "&:hover": { transform: "scale(1.05)", boxShadow: `0 6px 25px ${stat.color}88` },
            }}
          >
            
          </Card>
             <Paper 
  elevation={2} 
  sx={{ 
    p: 2, 
    display: 'flex', 
    flexDirection: 'column', 
    height: '100%',
    borderRadius: 2,
    transition: 'transform 0.3s, box-shadow 0.3s',
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: 3
    },
    background: statColors[stat.title], // 🎨 auto gradient
    color: '#fff' // ensures text is readable
  }}
>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  {stat.icon}
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="body2" color={stat.change.startsWith('+') ? 'success.main' : 'error.main'}>
                      {stat.change}
                    </Typography>
                    {getTrendIcon(stat.change)}
                  </Box>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {stat.value}
                </Typography>
                <Typography variant="body1" >
                  {stat.title}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={3}>
          {/* Recent Appointments */}
          <Grid item xs={12} lg={8}>
            <Paper elevation={2} sx={{ p: 2, borderRadius: 2 ,background: 'linear-gradient(135deg, #8e2de2 0%, #c471ed 30%, #f64f59 130%)',

    color: '#dd9e9e',
    transition: 'transform 0.3s, box-shadow 0.3s',
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: 6,
    },}}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Recent Appointments
                </Typography>
                <IconButton>
                  <MoreVertIcon />
                </IconButton>
              </Box>
              <Divider sx={{ mb: 2 }} />
              <List sx={{ width: '100%' }}>
                {recentAppointments.map((appointment, index) => (
                  <React.Fragment key={appointment.id}>
                    <ListItem 
                      alignItems="flex-start"
                      sx={{ 
                        cursor: 'pointer',
                        '&:hover': { backgroundColor: 'rgba(66, 165, 245, 0.1)' },
                        borderRadius: 1
                      }}
                    >
                      <ListItemIcon>
                        {getStatusIcon(appointment.status)}
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                              {appointment.customer} - {appointment.vehicle}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {appointment.time}
                            </Typography>
                          </Box>
                        }
                        secondary={
                          <React.Fragment>
                            <Typography variant="body2" component="span">
                              {appointment.service} • ID: {appointment.id}
                            </Typography>
                            <Typography 
                              variant="body2" 
                              component="span" 
                              sx={{ 
                                ml: 2, 
                                color: getStatusColor(appointment.status),
                                fontWeight: 500
                              }}
                            >
                              {appointment.status}
                            </Typography>
                          </React.Fragment>
                        }
                      />
                    </ListItem>
                    {index < recentAppointments.length - 1 && <Divider variant="inset" component="li" />}
                  </React.Fragment>
                ))}
              </List>
             
            </Paper>
          </Grid>

          {/* Service Performance */}
          <Grid item xs={12} lg={4}>
            <Paper elevation={3} sx={{ p: 3, borderRadius: 3, height: "100%" ,background: 'linear-gradient(135deg, #91b4cb 0%, #6f96bd 100%)',
               boxShadow: '0 4px 20px rgba(0,0,0,0.1)',}}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Service Performance
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <List>
                {servicePerformance.map((service) => (
                  <ListItem key={service.name} sx={{ px: 0 }}>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {service.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {service.completed}/{service.total}
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <Box sx={{ width: '100%' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Box sx={{ width: '100%', mr: 1 }}>
                              <LinearProgress 
                                variant="determinate" 
                                value={service.value} 
                                 sx={{
    height: 10,
    borderRadius: 5,
    bgcolor: 'rgba(0,0,0,0.1)',
    '& .MuiLinearProgress-bar': {
      background: 'linear-gradient(90deg, #66bb6a, #43a047)',
    },
  }}
                              />
                            </Box>
                            <Box>
                              <Typography variant="body2" color="text.secondary">{`${service.value}%`}</Typography>
                            </Box>
                          </Box>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>

          {/* Monthly Revenue Chart */}
          <Grid item xs={12} md={8}>
            <Paper elevation={3} sx={{ p: 3, borderRadius: 3, height: "100%",background: 'linear-gradient(135deg, #80c660 30%, #a8e063 100%)',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)', }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Monthly Revenue
              </Typography>
              <Divider sx={{ mb: 2 }} />
              {revenueData.length > 0 ? (
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={revenueData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, 'Revenue']} />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="url(#colorRevenue)" 
                        activeDot={{ r: 8 }} 
                        name="Revenue"
                        />
                        <defs>
  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
    <stop offset="5%" stopColor="#42a5f5" stopOpacity={0.8}/>
    <stop offset="95%" stopColor="#42a5f5" stopOpacity={0}/>
  </linearGradient>
</defs>
                      
                    </LineChart>
                  </ResponsiveContainer>
                </Box>
              ) : (
                <Box sx={{ height: 250, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography variant="body1" color="text.secondary">
                    No revenue data available
                  </Typography>
                </Box>
              )}
            </Paper>
          </Grid>

          {/* Top Technicians */}
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 3, borderRadius: 2, height: "100%",background: 'linear-gradient(135deg, #edab5a 20%, #ffd200 100%)',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)', }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Top Technicians
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <List>
                {topTechnicians.length > 0 ? (
                  topTechnicians.map((tech, index) => (
                    <ListItem key={index} sx={{ px: 0 ,'&:hover': { backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: 2 },}}>
                      <ListItemIcon>
                        <Avatar sx={{ bgcolor: `primary.${index === 0 ? 'main' : 'light'}` }}>
                          {tech.employee_name ? tech.employee_name[0].toUpperCase() : 'T'}
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={tech.employee_name || `Technician ${index + 1}`}
                        secondary={`${tech.services_completed} services completed`}
                      />
                    </ListItem>
                  ))
                ) : (
                  <Typography variant="body1" color="text.secondary" sx={{ p: 2 }}>
                    No technician data available
                  </Typography>
                )}
              </List>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default AdminDash;