import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography, Avatar } from '@mui/material';

const UserProfile = () => {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    bio: '',
  });

  useEffect(() => {
    // In real app, this would be an API call
    setProfile({
      name: 'John Doe',
      email: 'john@example.com',
      bio: 'Book lover and avid reader',
    });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    // In real app, this would be an API call to update profile
    console.log('Profile updated:', profile);
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Avatar sx={{ width: 100, height: 100, mr: 2 }} />
        <Typography variant="h5">User Profile</Typography>
      </Box>

      <TextField
        fullWidth
        label="Name"
        value={profile.name}
        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
        sx={{ mb: 2 }}
      />

      <TextField
        fullWidth
        label="Email"
        value={profile.email}
        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
        sx={{ mb: 2 }}
      />

      <TextField
        fullWidth
        multiline
        rows={4}
        label="Bio"
        value={profile.bio}
        onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
        sx={{ mb: 2 }}
      />

      <Button variant="contained" type="submit">
        Update Profile
      </Button>
    </Box>
  );
};

export default UserProfile;