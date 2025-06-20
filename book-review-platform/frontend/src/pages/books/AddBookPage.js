import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createBook } from '../../redux/slices/booksSlice';
import { Container, TextField, Button, Typography, Paper } from '@mui/material';

const AddBookPage = () => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [genres, setGenres] = useState(''); // comma-separated string
  const [publishedDate, setPublishedDate] = useState('');
  const [language, setLanguage] = useState('');
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.books);

  const handleSubmit = (e) => {
    e.preventDefault();
    const bookData = {
      title,
      author,
      description,
      coverImage,
      genres: genres.split(',').map(g => g.trim()).filter(Boolean),
      publishedDate,
      language
    };
    dispatch(createBook(bookData))
      .unwrap()
      .then(() => {
        navigate('/dashboard/books');
      })
      .catch((err) => {
        console.error('Failed to add book:', err);
      });
  };


  return (
    <Container maxWidth="md">
      <Paper sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Add a New Book
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            required
            sx={{ mb: 2 }}
          />
          <TextField
            label="Author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            fullWidth
            required
            sx={{ mb: 2 }}
          />
          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            multiline
            rows={4}
            required
            sx={{ mb: 2 }}
          />
          <TextField
            label="Cover Image URL"
            value={coverImage}
            onChange={(e) => setCoverImage(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Genres (comma separated)"
            value={genres}
            onChange={(e) => setGenres(e.target.value)}
            fullWidth
            required
            sx={{ mb: 2 }}
            helperText="e.g. Fiction, Mystery, Thriller"
          />
          <TextField
            label="Published Date"
            type="date"
            value={publishedDate}
            onChange={(e) => setPublishedDate(e.target.value)}
            fullWidth
            required
            sx={{ mb: 2 }}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Language"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            fullWidth
            required
            sx={{ mb: 2 }}
          />
          <Button 
            type="submit" 
            variant="contained" 
            color="primary" 
            disabled={loading}
          >
            {loading ? 'Adding...' : 'Add Book'}
          </Button>
          {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
        </form>
      </Paper>
    </Container>
  );
};

export default AddBookPage;
