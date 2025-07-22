import React from 'react';
import { Grid, Card, CardContent, Typography } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import { useNavigate } from 'react-router-dom';

const Users = () => {
    const navigate = useNavigate();

    const handleUsers = () => {
      navigate('users');
    };
    const handleCandidates = () => {
      navigate('candidates');
    };
  return (
    <MainCard>
      <Typography variant="h3" gutterBottom sx={{ mb: 2 }}>
      Users
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4}>
          <Card
            sx={{
              border: '1px solid #ccc',
              borderRadius: '8px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
              '&:hover': {
                transform: 'scale(1.03)',
                boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
                cursor: 'pointer'
              },
              margin: { sm: 2, xs: 0 },
              mt: { xs: 2, sm: 0 }
            }}
            onClick={handleUsers}
          >
            <CardContent>
              <Typography variant="h5" sx={{ mb: 1 }}>
                Users
              </Typography>
            </CardContent>
          </Card>
        </Grid>
  
        <Grid item xs={12} sm={6} md={4}>
          <Card
            sx={{
              border: '1px solid #ccc',
              borderRadius: '8px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
              '&:hover': {
                transform: 'scale(1.03)',
                boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
                cursor: 'pointer'
              },
              margin: { sm: 2, xs: 0 },
              mt: { xs: 2, sm: 0 }
            }}
            onClick={handleCandidates}
          >
            <CardContent>
              <Typography variant="h5" sx={{ mb: 1 }}>
                Candidates
              </Typography>
            </CardContent>
          </Card>
        </Grid>
     
      </Grid>
    </MainCard>
  );
};

export default Users;
