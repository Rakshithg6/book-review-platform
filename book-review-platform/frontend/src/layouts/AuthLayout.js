import React from 'react';
import { Box, Container, CssBaseline, ThemeProvider } from '@mui/material';
import { Outlet } from 'react-router-dom';
import theme from '../theme';

const AuthLayout = () => {
  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Outlet />
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default AuthLayout;
