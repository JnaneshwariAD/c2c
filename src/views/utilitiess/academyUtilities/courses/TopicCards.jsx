// src/views/Topic/TopicCards.jsx
import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TablePagination
} from '@mui/material';

const TopicCards = ({ 
  topics, 
  page, 
  rowsPerPage, 
  onEdit, 
  onDelete, 
  onPageChange, 
  onRowsPerPageChange,
  ImageUrl 
}) => {
  const count = topics.length;

  return (
    <>
      <Grid container spacing={2} mt={2}>
        {topics
          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
          .map((topic) => (
            <Grid item xs={12} sm={6} md={4} key={topic.topicId}>
              <Card
                sx={{
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
                <CardContent
                  sx={{ 
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    p: 1 
                  }}
                >
                  <Typography
                    variant="h5"
                    align="center"
                    sx={{ 
                      fontWeight: 'bold', 
                      mt: 1,
                      minHeight: '48px',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}
                  >
                    Topic : {topic.topicName}
                  </Typography>

                  <Typography 
                    variant="h6" 
                    align="center" 
                    sx={{ mb: 2, fontWeight: 500 }}
                  >
                    {topic.moduleName}
                  </Typography>
                  
                  <Grid container spacing={1} justifyContent="center">
                    <Grid item>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => onEdit(topic)} // ✅ pass full object
                      >
                        View More
                      </Button>
                    </Grid>
                    <Grid item>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => onEdit(topic)} // ✅ pass full object
                      >
                        Edit
                      </Button>
                    </Grid>
                    <Grid item>
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={() => onDelete(topic.originalId)} // still use ID for delete
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
        rowsPerPageOptions={[5, 10, 25]}
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

export default TopicCards;
