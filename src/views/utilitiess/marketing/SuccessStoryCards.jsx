import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  TablePagination,
  Box
} from '@mui/material';

const SuccessStoryCards = ({ news, page, rowsPerPage, onEdit, onDelete, ImageUrl, onPageChange, onRowsPerPageChange }) => {
  const count = news.length;

  return (
    <>
      <Grid container spacing={2} mt={4}>
        {news
          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
          .map((story) => (
            <Grid item xs={12} sm={6} md={4} key={story.successstoryId}>
              <Card
                sx={{
                  height: 350,
                  display: 'flex',
                  flexDirection: 'column',
                  border: '1px solid #ddd',
                  borderRadius: 2,
                  transition: '0.3s',
                  '&:hover': {
                    boxShadow: 6,
                    transform: 'translateY(-4px)',
                  },
                }}
              >
                {story.photoPath && (
                  <CardMedia
                    component="img"
                    height="140"
                    image={ImageUrl + story.photoPath}
                    alt={story.successstoryName}
                    sx={{ 
                      objectFit: 'contain',
                      flexShrink: 0
                    }}
                  />
                )}
                <CardContent sx={{ 
                  flexGrow: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  p: 2 
                }}>
                  <Typography
                    variant="h4"
                    align="center"
                    sx={{ 
                      fontWeight: 'bold', 
                      mb: 1,
                      minHeight: '48px',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}
                  >
                    {story.successstoryName}
                  </Typography>
                  
                  <Box sx={{ flexGrow: 1, mb: 2 }}>
                    <Typography 
                      variant="body2" 
                      color="text.secondary" 
                      sx={{
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                    >
                      {story.description}
                    </Typography>
                  </Box>
                  
                  <Grid container spacing={1} justifyContent="center">
                    <Grid item>
                      <Button variant="outlined" size="small" onClick={() => onEdit(story.originalId)}>
                        View More
                      </Button>
                    </Grid>
                      <Grid item>
                      <Button variant="outlined" size="small" onClick={() => onEdit(story.originalId)}>
                        Edit
                      </Button>
                    </Grid>
                    <Grid item>
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={() => onDelete(story.originalId)}
                      >
                        Delete
                      </Button>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          ))}
      </Grid>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={count}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        sx={{ mt: 2 }}
      />
    </>
  );
};

export default SuccessStoryCards;