import React, { useState, useEffect } from 'react';
import { Grid, Card, CardContent, TextField, Select, MenuItem, FormControl, InputLabel, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState('');
  const [genre, setGenre] = useState('all');

  // Dummy data
  const dummyBooks = [
    { id: 1, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', genre: 'Classic' },
    { id: 2, title: 'To Kill a Mockingbird', author: 'Harper Lee', genre: 'Fiction' },
    { id: 3, title: '1984', author: 'George Orwell', genre: 'Science Fiction' },
  ];

  useEffect(() => {
    // In real app, this would be an API call
    setBooks(dummyBooks);
  }, []);

  const filteredBooks = books.filter(book => 
    book.title.toLowerCase().includes(search.toLowerCase()) &&
    (genre === 'all' || book.genre === genre)
  );

  return (
    <div>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Search Books"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Genre</InputLabel>
            <Select value={genre} onChange={(e) => setGenre(e.target.value)}>
              <MenuItem value="all">All Genres</MenuItem>
              <MenuItem value="Classic">Classic</MenuItem>
              <MenuItem value="Fiction">Fiction</MenuItem>
              <MenuItem value="Science Fiction">Science Fiction</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        {filteredBooks.map(book => (
          <Grid item xs={12} sm={6} md={4} key={book.id}>
            <Card component={Link} to={`/dashboard/books/${book.id}`} sx={{ textDecoration: 'none' }}>
              <CardContent>
                <Typography variant="h6">{book.title}</Typography>
                <Typography color="textSecondary">{book.author}</Typography>
                <Typography>{book.genre}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default BookList;