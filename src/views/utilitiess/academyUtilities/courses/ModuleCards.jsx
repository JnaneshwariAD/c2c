// src/views/Modules/ModuleCards.jsx
import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TablePagination
} from '@mui/material';

const ModuleCards = ({ modules, page, rowsPerPage, onEdit, onDelete, onPageChange, onRowsPerPageChange }) => {
  const count = modules.length;

  return (
    <>
      <Grid container spacing={2}>
        {modules.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((mod) => (
          <Grid item xs={12} sm={6} md={4} key={mod.moduleId}>
            <Card
              sx={{
                border: '1px solid #ddd',
                borderRadius: 2,
                transition: '0.3s',
                '&:hover': { boxShadow: 6, transform: 'translateY(-4px)' }
              }}
            >
              <CardContent>
                <Typography variant="h5" align="center" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {mod.moduleName}
                </Typography>
                <Typography variant="body2" align="center" color="text.secondary" sx={{ mb: 1 }}>
                  {mod.description}
                </Typography>
                <Typography variant="body2" align="center" color="primary" sx={{ mb: 2 }}>
                  Subject: {mod.subjectName}
                </Typography>
                <div style={{ textAlign: 'center', marginBottom: 12 }}>
                  {mod.file}
                </div>
                <Grid container spacing={1} justifyContent="center">
                  <Grid item>
                    <Button variant="outlined" size="small" onClick={() => onEdit(mod.moduleId)}>
                      Edit
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button variant="outlined" color="error" size="small" onClick={() => onDelete(mod.moduleId)}>
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

export default ModuleCards;
