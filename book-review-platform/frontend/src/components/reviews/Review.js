import React, { useState } from 'react';
import { format } from 'date-fns';
import { Box, Typography, Avatar, IconButton, Paper, Button } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, ThumbUp as ThumbUpIcon, Warning as WarningIcon } from '@mui/icons-material';
import StarRating from '../books/StarRating';

const Review = ({ review, isOwnReview, onEdit, onDelete, onLike, isLiked }) => {
  const [showFullContent, setShowFullContent] = useState(false);
  
  const toggleShowFullContent = (e) => {
    e.stopPropagation();
    setShowFullContent(!showFullContent);
  };
  
  const handleLike = (e) => {
    e.stopPropagation();
    onLike(review.id);
  };
  
  const handleEdit = (e) => {
    e.stopPropagation();
    onEdit(review);
  };
  
  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(review.id);
  };
  
  return (
    <Paper 
      elevation={2} 
      sx={{ 
        p: 2, 
        mb: 2, 
        '&:hover': { boxShadow: 3 }
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="flex-start">
        <Box display="flex" alignItems="center" mb={1}>
          <Avatar 
            src={review.user?.avatar} 
            alt={review.user?.username}
            sx={{ width: 40, height: 40, mr: 2 }}
          >
            {review.user?.username?.charAt(0)?.toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="subtitle1" fontWeight="bold">
              {review.user?.username || 'Anonymous'}
            </Typography>
            <Box display="flex" alignItems="center">
              <StarRating value={review.rating} size="small" />
              <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                {review.date ? format(new Date(review.date), 'MMM d, yyyy') : ''}
              </Typography>
            </Box>
          </Box>
        </Box>
        
        <Box>
          {isOwnReview && (
            <>
              <IconButton size="small" onClick={handleEdit}>
                <EditIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" onClick={handleDelete}>
                <DeleteIcon fontSize="small" color="error" />
              </IconButton>
            </>
          )}
        </Box>
      </Box>
      
            <Box mt={1} pl={6}>
        <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 'bold', fontSize: '1.1rem', mb: 1 }}>
          {review.title}
        </Typography>
        {review.containsSpoilers ? (
          <Box>
            <Box display="flex" alignItems="center" color="warning.main" mb={1}>
              <WarningIcon fontSize="small" sx={{ mr: 0.5 }} />
              <Typography variant="caption">Contains spoilers</Typography>
            </Box>
            <Box 
              bgcolor="background.paper" 
              p={1.5} 
              borderRadius={1}
              sx={{ borderLeft: '3px solid', borderColor: 'warning.main' }}
            >
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: showFullContent ? 'unset' : 3,
                  WebkitBoxOrient: 'vertical',
                }}
              >
                {review.content}
              </Typography>
              <Button 
                size="small" 
                onClick={toggleShowFullContent}
                sx={{ mt: 1 }}
              >
                {showFullContent ? 'Show less' : 'Show more'}
              </Button>
            </Box>
          </Box>
        ) : (
          <>
            <Typography 
              variant="body1" 
              color="text.primary"
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: showFullContent ? 'unset' : 3,
                WebkitBoxOrient: 'vertical',
              }}
            >
              {review.content}
            </Typography>
            <Button 
              size="small" 
              onClick={toggleShowFullContent}
              sx={{ mt: 1 }}
            >
              {showFullContent ? 'Show less' : 'Show more'}
            </Button>
          </>
        )}
        
        <Box display="flex" alignItems="center" mt={1}>
          <IconButton 
            size="small" 
            color={isLiked ? 'primary' : 'default'}
            onClick={handleLike}
          >
            <ThumbUpIcon fontSize="small" />
          </IconButton>
          <Typography variant="caption" color="text.secondary">
            {review.likes?.length || 0} {review.likes?.length === 1 ? 'like' : 'likes'}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default Review;
