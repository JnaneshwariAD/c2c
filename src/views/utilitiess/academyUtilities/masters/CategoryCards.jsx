import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TablePagination
} from '@mui/material';

const CategoryCards = ({ categories, page, rowsPerPage, onEdit, onDelete, onPageChange, onRowsPerPageChange }) => {
  const count = categories.length;

  return (
    <>
      <Grid container spacing={2}>
        {categories
          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
          .map((cat) => (
            <Grid item xs={12} sm={6} md={4} key={cat.categoryId}>
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
                  <Typography
                    variant="h4"
                    align="center"
                    sx={{ fontWeight: 'bold', mb: 1 }}
                  >
                    {cat.categoryName}
                  </Typography>
                  <Typography variant="body2" align="center" color="text.secondary">
                    {cat.description}
                  </Typography>
                  
                  <Grid container spacing={1} justifyContent="center" sx={{ mt: 2 }}>
                    <Grid item>
                      <Button variant="outlined" size="small" onClick={() => onEdit(cat.categoryId)}>
                        ViewMore
                      </Button>
                    </Grid>

                    <Grid item>
                      <Button variant="outlined" size="small" onClick={() => onEdit(cat.categoryId)}>
                        Edit
                      </Button>
                    </Grid>
                    <Grid item>
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={() => onDelete(cat.categoryId)}
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

export default CategoryCards;
