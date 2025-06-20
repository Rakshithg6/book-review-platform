import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography, Paper, TextField, Button, Divider, Alert } from '@mui/material';
// import { updatePassword } from '../../redux/slices/authSlice'; // Uncomment and implement this action if needed

const AccountSettingsPage = () => {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.auth);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [success, setSuccess] = useState('');
  const [formError, setFormError] = useState('');

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setFormError('');
    setSuccess('');
    if (newPassword !== confirmPassword) {
      setFormError('New passwords do not match.');
      return;
    }
    if (newPassword.length < 6) {
      setFormError('Password must be at least 6 characters.');
      return;
    }
    // Uncomment and implement the updatePassword action in your slice
    // try {
    //   await dispatch(updatePassword({ currentPassword, newPassword })).unwrap();
    //   setSuccess('Password updated successfully!');
    //   setCurrentPassword('');
    //   setNewPassword('');
    //   setConfirmPassword('');
    // } catch (err) {
    //   setFormError(err.message || 'Failed to update password.');
    // }
    setSuccess('Password update logic goes here.');
  };

  return (
    <Box maxWidth={500} mx="auto" mt={5}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" fontWeight={600} gutterBottom>
          Account Settings
        </Typography>
        <Divider sx={{ mb: 3 }} />
        <Typography variant="subtitle1" gutterBottom>Change Password</Typography>
        <form onSubmit={handlePasswordChange}>
          <TextField
            label="Current Password"
            type="password"
            fullWidth
            required
            margin="normal"
            value={currentPassword}
            onChange={e => setCurrentPassword(e.target.value)}
          />
          <TextField
            label="New Password"
            type="password"
            fullWidth
            required
            margin="normal"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
          />
          <TextField
            label="Confirm New Password"
            type="password"
            fullWidth
            required
            margin="normal"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
          />
          {formError && <Alert severity="error" sx={{ mt: 2 }}>{formError}</Alert>}
          {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 3 }}
            disabled={loading}
          >
            Change Password
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default AccountSettingsPage;
