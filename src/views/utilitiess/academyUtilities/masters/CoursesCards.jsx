import React from 'react';
import { Grid, Card, CardContent, Typography, Button, TablePagination } from '@mui/material';

const CoursesCards = ({ courses, page, rowsPerPage, onEdit, onDelete, onPageChange, onRowsPerPageChange }) => {
  const count = courses.length;

  return (
    <>
      <Grid container spacing={2} mt={4}>
        {courses
          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
          .map((course) => (
            <Grid item xs={12} sm={6} md={4} key={course.courseId}>
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
                <CardContent style={{textAlign: 'center'}}>
                  <Typography variant="h4"  sx={{ fontWeight: 'bold', mb: 1 }}>
                    {course.courseName}
                  </Typography>
                  <Typography variant="body2"  color="text.secondary">
                    {course.description}
                  </Typography>
                  <Typography variant="h4"  sx={{ mt: 1 }}>
                    University: {course.universityName}
                  </Typography>
                  <Typography variant="h5"  sx={{ mt: 1 }}>
                    Category: {course.categoryName}
                  </Typography>
                  {/* <Typography variant="body2"  sx={{ mt: 1 }}>
                    No. of Semesters: {course.noOfSem}
                  </Typography> */}
                  {/* <Typography variant="body2"  sx={{ mt: 1 }}>
                    Video URL: {course.videoUrl}
                  </Typography> */}
                  <Grid container spacing={1} justifyContent="center" sx={{ mt: 2 }}>
                  <Grid item>
                      <Button variant="outlined" size="small" onClick={() => onEdit(course.courseId)}>
                        View More
                      </Button>
                    </Grid>
                    <Grid item>
                      <Button variant="outlined" size="small" onClick={() => onEdit(course.courseId)}>
                        Edit
                      </Button>
                    </Grid>
                    <Grid item>
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={() => onDelete(course.courseId)}
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

export default CoursesCards;