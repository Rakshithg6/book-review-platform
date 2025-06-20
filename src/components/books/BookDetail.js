import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Box, Divider, Button, TextField } from '@mui/material';

const BookDetail = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState('');

  // Dummy data
  const dummyBook = {
    id: 1,
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    genre: 'Classic',
    description: 'A story of decadence and excess...',
  };

  const dummyReviews = [
    { id: 1, user: 'John', content: 'Great book!', rating: 5 },
    { id: 2, user: 'Jane', content: 'Interesting read', rating: 4 },
  ];

  useEffect(() => {
    // In real app, these would be API calls
    setBook(dummyBook);
    setReviews(dummyReviews);
  }, [id]);

  const handleSubmitReview = () => {
    const review = {
      id: reviews.length + 1,
      user: 'Current User',
      content: newReview,
      rating: 5,
    };
    setReviews([...reviews, review]);
    setNewReview('');
  };

  if (!book) return <div>Loading...</div>;

  return (
    <Box>
      <Typography variant="h4">{book.title}</Typography>
      <Typography variant="h6">{book.author}</Typography>
      <Typography variant="subtitle1">{book.genre}</Typography>
      <Typography paragraph>{book.description}</Typography>

      <Divider sx={{ my: 3 }} />

      <Typography variant="h5">Reviews</Typography>
      {reviews.map(review => (
        <Box key={review.id} sx={{ my: 2 }}>
          <Typography variant="subtitle1">{review.user}</Typography>
          <Typography>{review.content}</Typography>
        </Box>
      ))}

      <Box sx={{ mt: 3 }}>
        <TextField
          fullWidth
          multiline
          rows={4}
          label="Write a review"
          value={newReview}
          onChange={(e) => setNewReview(e.target.value)}
        />
        <Button
          variant="contained"
          onClick={handleSubmitReview}
          sx={{ mt: 2 }}
        >
          Submit Review
        </Button>
      </Box>
    </Box>
  );
};

export default BookDetail;