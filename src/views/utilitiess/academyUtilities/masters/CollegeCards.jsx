import React from 'react';
import { Grid, Card, CardContent, Typography, Button, TablePagination } from '@mui/material';

const CollegeCards = ({ colleges, page, rowsPerPage, onEdit, onDelete, onPageChange, onRowsPerPageChange }) => {
  const count = colleges.length;

  return (
    <>
      <Grid container spacing={2} mt={4}>
        {colleges
          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
          .map((college) => (
            <Grid item xs={12} sm={6} md={4} key={college.collegeId}>
              <Card
                sx={{
                  border: '1px solid #ddd',
                  borderRadius: 2,
                  transition: '0.3s',
                  '&:hover': {
                    boxShadow: 6,
                    transform: 'translateY(-4px)',
                  },
                }}
              >
                <CardContent>
                  <Typography variant="h4" align="center" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {college.collegeName}
                  </Typography>
                  <Typography variant="body2" align="center" color="text.secondary">
                    {college.description}
                  </Typography>
                  <Typography variant="h5" align="center"  sx={{ mt: 1 }}>
                    University: {college.universityName}
                  </Typography>
                  <div style={{ display: 'flex', justifyContent: 'center', margin: '12px 0' }}>
                    {college.file && typeof college.file === 'object' ? college.file : null}
                  </div>
                  <Grid container spacing={1} justifyContent="center">
                    <Grid item>
                      <Button variant="outlined" size="small" onClick={() => onEdit(college.collegeId)}>
                        View More
                      </Button>
                    </Grid>
                    <Grid item>
                      <Button variant="outlined" size="small" onClick={() => onEdit(college.collegeId)}>
                        Edit
                      </Button>
                    </Grid>
                    <Grid item>
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={() => onDelete(college.collegeId)}
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
      />
    </>
  );
};

export default CollegeCards;