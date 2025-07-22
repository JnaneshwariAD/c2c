import React from 'react';
import { Grid, Card, CardContent, Typography } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import { useNavigate } from 'react-router-dom';

const Masters = () => {
  const navigate = useNavigate();

  const handleCategory = () => {
    navigate('category');
  };
  const handleUni = () => {
    navigate('university');
  };
  const handleCol = () => {
    navigate('college');
  };
  // const handleBran = () => {
  //   navigate('branch');
  // };
   const handleCourse = () => {
      navigate('course');
    };

  return (
    <MainCard>
      <Typography variant="h3" gutterBottom sx={{ mb: 2 }}>
        Masters
      </Typography>

      <Grid container spacing={2}>
        {/* Category  */}
        <Grid item xs={12} sm={6} md={3}>
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
            onClick={handleCategory}
          >
            <CardContent>
              <Typography variant="h5" sx={{ mb: 1 }}>
                Category
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* University */}
        <Grid item xs={12} sm={6} md={3}>
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
            onClick={handleUni}

          >
            <CardContent>
              <Typography variant="h5" sx={{ mb: 1 }}>
                University
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* College  */}
        <Grid item xs={12} sm={6} md={3}>
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
            onClick={handleCol}

          >
            <CardContent>
              <Typography variant="h5" sx={{ mb: 1 }}>
                College
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Branch  */}
        {/* <Grid item xs={12} sm={6} md={3}>
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
            onClick={handleBran}

          >
            <CardContent>
              <Typography variant="h5" sx={{ mb: 1 }}>
                Branch
              </Typography>
            </CardContent>
          </Card>
        </Grid> */}

        {/* Course  */}
         <Grid item xs={12} sm={6} md={3}>
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
                     onClick={handleCourse}
                   >
                     <CardContent>
                       <Typography variant="h5" sx={{ mb: 1 }}>
                         Course
                       </Typography>
                     </CardContent>
                   </Card>
                 </Grid>
      </Grid>
    </MainCard>
  );
};

export default Masters;
