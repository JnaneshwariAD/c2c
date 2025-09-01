// CandidateCards.js
import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TablePagination
} from '@mui/material';

const CandidateCards = ({ candidates, page, rowsPerPage, onEdit, onDelete, onPageChange, onRowsPerPageChange }) => {
  const count = candidates.length;

  return (
    <>
      <Grid container spacing={2}>
        {candidates
          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
          .map((candidate) => (
            <Grid item xs={12} sm={6} md={4} key={candidate.mobileUserId}>
              <Card
                sx={{
                  border: '1px solid #ddd',
                //   border: '1px solid black',

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
                    {candidate.fullName}
                  </Typography>
                  <Typography variant="body2" align="center" color="text.secondary">
                    Username: {candidate.userName}
                  </Typography>
                  {/* <Typography variant="body2" align="center" color="text.secondary">
                    Gender: {candidate.gender}
                  </Typography> */}
                  <Typography variant="body2" align="center" color="text.secondary">
                    Email: {candidate.mailId}
                  </Typography>
                  <Typography variant="body2" align="center" color="text.secondary">
                    Mobile: {candidate.mobileNumber}
                  </Typography>
                  
                  <Grid container spacing={1} justifyContent="center" sx={{ mt: 2 }}>
                    <Grid item>
                      <Button variant="outlined" size="small" onClick={() => onEdit(candidate.mobileUserId)}>
                        View More
                      </Button>
                    </Grid>
                    <Grid item>
                      <Button variant="outlined" size="small" onClick={() => onEdit(candidate.mobileUserId)}>
                        Edit
                      </Button>
                    </Grid>
                    <Grid item>
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={() => onDelete(candidate.mobileUserId)}
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

export default CandidateCards;