// src/views/Module/ModuleCards.jsx
import React from 'react';
import { Grid, Paper, Typography, Box, IconButton } from '@mui/material';
import { Edit, DeleteForever } from '@mui/icons-material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { BaseUrl } from 'BaseUrl';

const ModuleCards = ({ modules, page, rowsPerPage, handleEdit, handleDelete }) => {
  const fileDownloadBase = `${BaseUrl}/file/downloadFile/?filePath=`;

  return (
    <Grid container spacing={2}>
      {modules.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((m) => (
        <Grid item xs={12} sm={6} md={4} key={m.moduleId}>
          <Paper sx={{ p: 2, borderRadius: 2, boxShadow: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>{m.moduleName}</Typography>
            <Typography variant="body2" sx={{ whiteSpace: 'pre-line', textAlign: 'justify' }}>
              {m.description}
            </Typography>
            <Box mt={1}>
              <Typography variant="caption" color="text.secondary">
                Subject: {m.subjectName}
              </Typography>
            </Box>
            {/* {m.filePath && (
              <Box mt={1} display="flex" alignItems="center">
                <PictureAsPdfIcon sx={{ color: 'red', mr: 1 }} />
                <a
                  href={fileDownloadBase + m.filePath}
                  target="_blank"
                  rel="noreferrer"
                  style={{ textDecoration: 'none', color: '#03045E' }}
                >
                  <Typography component="span" variant="body2">{m.fileName || 'View PDF'}</Typography>
                </a>
              </Box>
            )} */}
            <Box mt={2} display="flex" justifyContent="flex-end" gap={1}>
              <IconButton color="primary" onClick={() => handleEdit(m)}>
                <Edit />
              </IconButton>
              <IconButton color="error" onClick={() => handleDelete(m.moduleId)}>
                <DeleteForever />
              </IconButton>
            </Box>
          </Paper>
        </Grid>
      ))}
      {modules.length === 0 && (
        <Grid item xs={12}><Typography align="center">No modules</Typography></Grid>
      )}
    </Grid>
  );
};

export default ModuleCards;
