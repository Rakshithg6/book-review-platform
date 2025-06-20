export const a11yProps = (index) => ({
  id: `book-tab-${index}`,
  'aria-controls': `book-tabpanel-${index}`,
});

export const getTabStyles = (theme, value, index) => ({
  textTransform: 'none',
  minWidth: 72,
  fontWeight: theme.typography.fontWeightRegular,
  fontSize: theme.typography.pxToRem(15),
  marginRight: theme.spacing(1),
  color: 'rgba(0, 0, 0, 0.7)',
  '&.Mui-selected': {
    color: theme.palette.primary.main,
    fontWeight: theme.typography.fontWeightMedium,
  },
  '&:hover': {
    color: theme.palette.primary.main,
    opacity: 1,
  },
});
