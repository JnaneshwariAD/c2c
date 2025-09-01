// src/views/Modules/ModuleCards.jsx
import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TablePagination,
  Box
} from '@mui/material';
import { BaseUrl } from 'BaseUrl';

const ModuleCards = ({ modules, page, rowsPerPage, onEdit, onDelete, onPageChange, onRowsPerPageChange }) => {
  const count = modules.length;

  return (
    <>
      <Grid container spacing={2} mt={4}>
        {modules
          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
          .map((module) => (
            <Grid item xs={12} sm={6} md={4} key={module.moduleId}>
              <Card
                sx={{
                  border: '1px solid #ddd',
                  borderRadius: 2,
                  transition: '0.3s',
                  '&:hover': {
                    boxShadow: 6,
                    transform: 'translateY(-4px)',
                  },
                  height: '100%'
                }}
              >
                <CardContent style={{textAlign: 'center'}}>
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: 'bold', mb: 1 }}
                  >
                    {module.moduleName}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    <strong>Subject:</strong> {module.subjectName}
                  </Typography>

                  <Typography variant="body2" sx={{ mb: 2 }}>
                    {module.rawDescription?.substring(0, 100)}...
                  </Typography>

                  {module.filePath && (
                    <Box sx={{ mb: 2, textAlign: 'center' }}>
                      <Button
                        href={`${BaseUrl}/file/downloadFile/?filePath=${module.filePath}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        variant="outlined"
                        size="small"
                        fullWidth
                      >
                        Download PDF
                      </Button>
                    </Box>
                  )}

                  <Grid container spacing={1} justifyContent="center">
                    <Grid item>
                      <Button variant="outlined" size="small" onClick={() => onEdit(module.moduleId)}>
                        View More
                      </Button>
                    </Grid>
                    <Grid item>
                      <Button variant="outlined" size="small" onClick={() => onEdit(module.moduleId)}>
                        Edit
                      </Button>
                    </Grid>
                    <Grid item>
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={() => onDelete(module.moduleId)}
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

export default ModuleCards;