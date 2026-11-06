import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import LogoutButton from './LogoutButton';
import { Box } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import GroupIcon from '@mui/icons-material/Group';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import FeedbackIcon from '@mui/icons-material/Feedback';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SettingsIcon from '@mui/icons-material/Settings';

const AdminNavbar = () => {
    const location = useLocation();

    return (
        <Box sx={navStyle}>
            <h2 style={headerStyle}>Admin Panel</h2>

            <NavItem to="/admin/AdminDash" icon={<DashboardIcon />} label="Dashboard" active={location.pathname === "/admin/AdminDash"} />
            <NavItem to="/admin/ManageUsers" icon={<PeopleIcon />} label="Manage User" active={location.pathname === "/admin/ManageUsers"} />
            <NavItem to="/admin/CustomersDetails" icon={<GroupIcon />} label="Customers Details" active={location.pathname === "/admin/CustomersDetails"} />
            <NavItem to="/admin/ManageVehicle" icon={<DirectionsCarIcon />} label="Manage Vehicle" active={location.pathname === "/admin/ManageVehicle"} />
            <NavItem to="/admin/ManageFeedback" icon={<FeedbackIcon />} label="Manage Feedback" active={location.pathname === "/admin/ManageFeedback"} />
            <NavItem to="/admin/Reports" icon={<AssessmentIcon />} label="Reports" active={location.pathname === "/admin/Reports"} />
            <NavItem to="/admin/settings" icon={<SettingsIcon />} label="Settings" active={location.pathname === "/admin/settings"} />

            <div style={{ marginTop: 'auto' }}>
                <LogoutButton style={logoutStyle} />
            </div>
        </Box>
    );
};

const NavItem = ({ to, icon, label, active }) => (
    <Link to={to} style={{ ...linkStyle, ...(active ? activeLinkStyle : {}) }}>
        <span style={iconStyle}>{icon}</span>
        {label}
    </Link>
);

const navStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    padding: '30px 22px',
    background: 'linear-gradient(160deg, #0f2027, #203a43, #2c5364)',
    backdropFilter: 'blur(14px)',
    height: '100vh',
    width: '260px',
    position: 'fixed',
    overflowY: 'auto',
    boxShadow: '8px 0 24px rgba(0,0,0,0.6)',
    borderRight: '1px solid rgba(255,255,255,0.08)',
};

const headerStyle = {
    color: '#e0f7fa',
    fontSize: '22px',
    fontWeight: '700',
    marginBottom: '35px',
    textAlign: 'center',
    letterSpacing: '2px',
    borderBottom: '1px solid rgba(255,255,255,0.15)',
    paddingBottom: '12px',
    textTransform: 'uppercase',
};

const linkStyle = {
    color: '#b0bec5',
    textDecoration: 'none',
    fontSize: '15px',
    fontWeight: '500',
    padding: '14px 18px',
    borderRadius: '12px',
    transition: 'all 0.35s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
};

const activeLinkStyle = {
    background: 'rgba(0, 229, 255, 0.15)',
    color: '#00e5ff',
    boxShadow: '0 0 12px rgba(0, 229, 255, 0.6)',
    transform: 'translateX(6px)',
};

const iconStyle = {
    display: 'flex',
    alignItems: 'center',
    fontSize: '20px',
    color: '#00e5ff',
};

const logoutStyle = {
    background: 'linear-gradient(90deg, #ff1744, #d50000)',
    color: '#fff',
    fontWeight: '600',
    borderRadius: '10px',
    padding: '12px 18px',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 0 12px rgba(255,23,68,0.6)',
};

export default AdminNavbar;
