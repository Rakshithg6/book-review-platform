import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import BookList from '../books/BookList';
import BookDetail from '../books/BookDetail';
import UserProfile from '../profile/UserProfile';
import { Container, Grid, Paper, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { Book, Person, Reviews } from '@mui/icons-material';

const DashboardLayout = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2 }}>
            <List>
              <ListItem button component={Link} to="/dashboard/books">
                <ListItemIcon><Book /></ListItemIcon>
                <ListItemText primary="Books" />
              </ListItem>
              <ListItem button component={Link} to="/dashboard/profile">
                <ListItemIcon><Person /></ListItemIcon>
                <ListItemText primary="Profile" />
              </ListItem>
            </List>
          </Paper>
        </Grid>
        <Grid item xs={12} md={9}>
          <Paper sx={{ p: 2 }}>
            <Routes>
              <Route path="/books" element={<BookList />} />
              <Route path="/books/:id" element={<BookDetail />} />
              <Route path="/profile" element={<UserProfile />} />
            </Routes>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default DashboardLayout;