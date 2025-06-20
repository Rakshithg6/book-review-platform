import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Paper } from '@mui/material';
import StarRating from '../books/StarRating';

const ReviewForm = ({ onSubmit, onCancel, initialValues = {} }) => {
  const [title, setTitle] = useState(initialValues.title || '');
  const [comment, setComment] = useState(initialValues.comment || '');
  const [rating, setRating] = useState(initialValues.rating || 5);
  const [containsSpoilers, setContainsSpoilers] = useState(initialValues.containsSpoilers || false);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ title, content: comment, rating, containsSpoilers });
  };
  
  return (
    <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        {initialValues.id ? 'Edit Your Review' : 'Write a Review'}
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          fullWidth
          margin="normal"
          required
          inputProps={{ maxLength: 100 }}
        />
        <TextField
          label="Your Review"
          value={comment}
          onChange={e => setComment(e.target.value)}
          fullWidth
          multiline
          rows={4}
          margin="normal"
          required
          inputProps={{ maxLength: 5000 }}
        />
        <Box mb={2}>
          <Typography component="legend" gutterBottom>
            Your Rating
          </Typography>
          <StarRating
            value={rating}
            onChange={setRating}
            readOnly={false}
          />
        </Box>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center">
            <input
              type="checkbox"
              id="spoilers"
              checked={containsSpoilers}
              onChange={(e) => setContainsSpoilers(e.target.checked)}
              style={{ marginRight: 8 }}
            />
            <label htmlFor="spoilers">Contains spoilers</label>
          </Box>
          <Box>
            <Button
              type="button"
              onClick={onCancel}
              sx={{ mr: 1 }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={!title.trim() || !comment.trim()}
            >
              {initialValues.id ? 'Update Review' : 'Submit Review'}
            </Button>
          </Box>
        </Box>
      </form>
    </Paper>
  );
};

export default ReviewForm;
