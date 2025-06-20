import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box, Container, Avatar, IconButton, Menu, MenuItem, Divider, Tooltip, Badge, ListItemIcon } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LogoutIcon from '@mui/icons-material/Logout';
import SettingsIcon from '@mui/icons-material/Settings';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const navItems = []; // Profile moved to dropdown


const DashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifAnchorEl, setNotifAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const notifOpen = Boolean(notifAnchorEl);

  // Dummy user data for avatar (replace with Redux/user data)
  const user = {
    name: 'John Doe',
    avatar: '', // fallback to initials
    notifications: [
      { id: 1, text: 'Welcome to Book Review Dashboard!' },
      // ...
    ],
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const handleNotifOpen = (event) => {
    setNotifAnchorEl(event.currentTarget);
  };
  const handleNotifClose = () => {
    setNotifAnchorEl(null);
  };
  const handleLogout = () => {
    // TODO: Implement real logout logic (Redux, API, etc.)
    localStorage.clear();
    navigate('/');
  };
  const handleAccountSettings = () => {
    navigate('/dashboard/profile/settings');
    handleMenuClose();
  };
  const handleProfile = () => {
    navigate('/dashboard/profile');
    handleMenuClose();
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="fixed" color="primary" elevation={2}>
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ minHeight: 64 }}>
            <Typography
              variant="h5"
              noWrap
              component="div"
              sx={{ flexGrow: 1, fontWeight: 700, letterSpacing: 2, cursor: 'pointer', color: 'white' }}
              onClick={() => navigate("/dashboard/books")}
            >
              Book Review Dashboard
            </Typography>
            {navItems.map((item) => (
              <Button
                key={item.label}
                color={location.pathname.startsWith(item.path) ? 'secondary' : 'inherit'}
                component={NavLink}
                to={item.path}
                sx={{ ml: 2, fontWeight: 600, letterSpacing: 1 }}
              >
                {item.label}
              </Button>
            ))}
            <Tooltip title="Notifications">
              <IconButton color="inherit" sx={{ ml: 1 }} onClick={handleNotifOpen}>
                <Badge badgeContent={user.notifications.length} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>
            <Menu anchorEl={notifAnchorEl} open={notifOpen} onClose={handleNotifClose}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              {user.notifications.length === 0 ? (
                <MenuItem disabled>No notifications</MenuItem>
              ) : (
                user.notifications.map((notif) => (
                  <MenuItem key={notif.id}>{notif.text}</MenuItem>
                ))
              )}
            </Menu>
            <Tooltip title="Account">
              <IconButton onClick={handleMenuOpen} sx={{ ml: 2 }} size="large">
                {user.avatar ? (
                  <Avatar src={user.avatar} />
                ) : (
                  <Avatar>{user.name.charAt(0)}</Avatar>
                )}
              </IconButton>
            </Tooltip>
            <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              <MenuItem onClick={handleProfile}>
                <ListItemIcon><AccountCircleIcon fontSize="small" /></ListItemIcon>
                Profile
              </MenuItem>
              <MenuItem onClick={handleAccountSettings}>
                <ListItemIcon><SettingsIcon fontSize="small" /></ListItemIcon>
                Account Settings
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout}>
                <ListItemIcon><LogoutIcon fontSize="small" /></ListItemIcon>
                Logout
              </MenuItem>
            </Menu>
          </Toolbar>
        </Container>
      </AppBar>
      <Toolbar />
      <Container maxWidth="xl" sx={{ mt: 2 }}>
        <Outlet />
      </Container>
    </Box>
  );
};

export default DashboardLayout;
