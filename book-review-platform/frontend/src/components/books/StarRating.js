import React, { useState } from 'react';
import { Box } from '@mui/material';
import { Star as StarIcon, StarBorder as StarBorderIcon, StarHalf as StarHalfIcon } from '@mui/icons-material';

const StarRating = ({ value, precision = 0.5, readOnly = true, onChange, size = 'medium' }) => {
  const [hover, setHover] = useState(-1);
  
  const handleClick = (newValue) => {
    if (!readOnly && onChange) {
      onChange(newValue);
    }
  };
  
  const handleMouseOver = (newHover) => {
    if (!readOnly) {
      setHover(newHover);
    }
  };
  
  const handleMouseLeave = () => {
    if (!readOnly) {
      setHover(-1);
    }
  };
  
  const displayValue = hover !== -1 ? hover : value;
  
  return (
    <Box display="flex" alignItems="center">
      {[1, 2, 3, 4, 5].map((index) => {
        const activeState = displayValue;
        const showEmptyIcon = activeState < index + 0.5;
        const showHalfIcon = activeState >= index - 0.5 && activeState < index + 0.5;
        
        return (
          <Box
            key={index}
            sx={{
              cursor: readOnly ? 'default' : 'pointer',
              position: 'relative',
              display: 'inline-block',
              width: size === 'small' ? '20px' : '24px',
              height: size === 'small' ? '20px' : '24px',
            }}
            onClick={() => handleClick(index)}
            onMouseOver={() => handleMouseOver(index)}
            onMouseLeave={handleMouseLeave}
          >
            {showEmptyIcon ? (
              <StarBorderIcon
                sx={{
                  position: 'absolute',
                  color: 'warning.main',
                  fontSize: size === 'small' ? '1.25rem' : '1.5rem',
                }}
              />
            ) : showHalfIcon ? (
              <StarHalfIcon
                sx={{
                  position: 'absolute',
                  color: 'warning.main',
                  fontSize: size === 'small' ? '1.25rem' : '1.5rem',
                }}
              />
            ) : (
              <StarIcon
                sx={{
                  position: 'absolute',
                  color: 'warning.main',
                  fontSize: size === 'small' ? '1.25rem' : '1.5rem',
                }}
              />
            )}
          </Box>
        );
      })}
    </Box>
  );
};

export default StarRating;
