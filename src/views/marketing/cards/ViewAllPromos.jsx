import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Grid, Card, CardContent, Typography, Button, Box } from '@mui/material';
import { fetchPromo } from 'views/API/PromoApi';
import MainCard from 'ui-component/cards/MainCard';

const ViewAllPromos = () => {
  const [details, setDetails] = useState([]);

  const location = useLocation();
  const user = JSON.parse(sessionStorage.getItem('user'));
  const headers = {
    'Content-type': 'application/json',
    Authorization: 'Bearer ' + user.accessToken
  };
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const res = await fetchPromo(headers);
      const fetchedData = res.content;
      console.log(res);
      if (fetchedData) {
        setDetails(fetchedData);
      }
    } catch (error) {
      console.error('Error fetching promos:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <MainCard>
      <Typography variant="h3" gutterBottom>
        Promo
      </Typography>

      <Grid container spacing={2}>
        {details.map((promo) => (
          <Grid item xs={12} sm={6} md={4} lg={4} key={promo.promoId}>
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
                margin: {sm:2,xs:0},
                mt:{xs:2,sm:0}
              }}
            >
              <CardContent>
                {promo.youTube && (
                  <iframe
                    title="YouTube Video"
                    src={`https://www.youtube.com/embed/${promo.youTube}`}
                    frameBorder="0"
                    allowFullScreen
                    style={{ width: '100%', height: '190px', marginBottom: '1rem' }}
                  ></iframe>
                )}
                <Typography variant="h5" sx={{ mb: 1 }}>
                  {promo.promoName}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {promo.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </MainCard>
  );
};

export default ViewAllPromos;
