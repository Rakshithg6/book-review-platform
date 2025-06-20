import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Box, Typography, Avatar, TextField, Button, Paper } from '@mui/material';

const UserProfilePage = () => {
  const user = useSelector((state) => state.auth.user);
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState(user || {});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    // Simulate PUT /users/:id (update local state only)
    // In real app, dispatch updateUser action here
    setEdit(false);
  };

  if (!user) {
    return <Typography align="center" color="text.secondary">No user data found.</Typography>;
  }

  return (
    <Paper sx={{ maxWidth: 500, mx: 'auto', p: 4 }}>
      <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
        <Avatar sx={{ width: 80, height: 80, mb: 2 }} src={user.avatar || ''}>
          {user.name?.charAt(0)?.toUpperCase()}
        </Avatar>
        <Typography variant="h5" gutterBottom>
          {user.name}
        </Typography>
        <Typography color="text.secondary" gutterBottom>
          {user.email}
        </Typography>
      </Box>
      {edit ? (
        <Box component="form" display="flex" flexDirection="column" gap={2}>
          <TextField label="Name" name="name" value={form.name || ''} onChange={handleChange} fullWidth />
          <TextField label="Email" name="email" value={form.email || ''} onChange={handleChange} fullWidth />
          <TextField label="Bio" name="bio" value={form.bio || ''} onChange={handleChange} fullWidth multiline rows={3} />
          <Box display="flex" gap={2} mt={2}>
            <Button variant="contained" color="primary" onClick={handleSave}>Save</Button>
            <Button variant="outlined" onClick={() => setEdit(false)}>Cancel</Button>
          </Box>
        </Box>
      ) : (
        <Box>
          <Typography variant="body1" mb={2}>{user.bio || 'No bio provided.'}</Typography>
          <Button variant="contained" onClick={() => setEdit(true)}>Edit Profile</Button>
        </Box>
      )}
    </Paper>
  );
};

export default UserProfilePage;
