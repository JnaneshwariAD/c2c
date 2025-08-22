import React from 'react';
import { Grid, Card, CardContent, Typography, Button, TablePagination } from '@mui/material';

const UniversityCards = ({
  universities,
  page,
  rowsPerPage,
  onEdit,
  onDelete,
  onPageChange,
  onRowsPerPageChange
}) => {
  const count = universities.length;

  return (
    <>
      <Grid container spacing={2} mt={4}>
        {universities
          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
          .map((uni) => (
            <Grid item xs={12} sm={6} md={4} key={uni.universityId}>
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
                    {uni.universityName}
                  </Typography>
                  <Typography variant="body2" align="center" color="text.secondary">
                    {uni.description}
                  </Typography>
                  <div style={{ display: 'flex', justifyContent: 'center', margin: '12px 0' }}>
                    {uni.file && typeof uni.file === 'object' ? uni.file : null}
                  </div>
                  <Grid container spacing={1} justifyContent="center">
                    <Grid item>
                      <Button variant="outlined" size="small" onClick={() => onEdit(uni.universityId)}>
                        View More
                      </Button>
                    </Grid>
                    <Grid item>
                      <Button variant="outlined" size="small" onClick={() => onEdit(uni.universityId)}>
                        Edit
                      </Button>
                    </Grid>
                    <Grid item>
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={() => onDelete(uni.universityId)}
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

export default UniversityCards;
