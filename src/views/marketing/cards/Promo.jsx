import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Card, CardContent, Typography, Button, Box } from '@mui/material';
import { fetchPromo } from 'views/API/PromoApi';
import MainCard from 'ui-component/cards/MainCard';

const Promo = () => {
  const [details, setDetails] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [embedErrors, setEmbedErrors] = useState({});

  const user = JSON.parse(sessionStorage.getItem('user'));
  const headers = {
    'Content-type': 'application/json',
    Authorization: 'Bearer ' + user.accessToken
  };
  const navigate = useNavigate();

  // Helper function to extract YouTube ID
  const getYouTubeId = (url) => {
    if (!url) return null;
    
    // Handle full URLs
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    
    return (match && match[2].length === 11) ? match[2] : url;
  };

  // Helper function to validate YouTube URLs
  const isValidYouTubeUrl = (url) => {
    if (!url) return false;
    
    // Check if it's just an ID (11 characters)
    if (url.length === 11) return true;
    
    // Check various YouTube URL patterns
    const patterns = [
      /youtube\.com\/watch\?v=/,
      /youtu\.be\//,
      /youtube\.com\/embed\//,
      /youtube\.com\/v\//,
      /youtube\.com\/user\/.*\/videos/,
      /youtube\.com\/.*\/videos/
    ];
    
    return patterns.some(pattern => pattern.test(url));
  };

  const fetchData = async () => {
    try {
      const res = await fetchPromo(headers);
      const fetchedData = res.content;
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

  const handleViewAll = () => {
    navigate('promos');
  };

  const handleEmbedError = (promoId) => {
    setEmbedErrors(prev => ({ ...prev, [promoId]: true }));
  };

  const displayedPromos = showAll ? details : details.slice(0, 3);

  return (
    <MainCard>
      <Typography variant="h3" gutterBottom>
        Promos
      </Typography>

      <Grid container spacing={3}>
        {displayedPromos.map((promo) => (
          <Grid item xs={12} sm={6} md={4} key={promo.promoId}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                border: '1px solid #ccc',
                borderRadius: '8px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                '&:hover': {
                  transform: 'scale(1.03)',
                  boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
                  cursor: 'pointer'
                }
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                {promo.youTube && !embedErrors[promo.promoId] && isValidYouTubeUrl(promo.youTube) ? (
                  <Box sx={{ 
                    position: 'relative',
                    paddingTop: '56.25%',
                    mb: 2,
                    borderRadius: '8px',
                    overflow: 'hidden'
                  }}>
                    <iframe
                      title={`${promo.promoName} YouTube Video`}
                      src={`https://www.youtube.com/embed/${getYouTubeId(promo.youTube)}?rel=0`}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      onError={() => handleEmbedError(promo.promoId)}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        border: 'none'
                      }}
                    />
                  </Box>
                ) : (
                  <Box sx={{
                    position: 'relative',
                    paddingTop: '56.25%',
                    mb: 2,
                    backgroundColor: '#f5f5f5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '8px'
                  }}>
                    <Typography color="textSecondary">
                      {embedErrors[promo.promoId] ? 'Video unavailable' : 'Invalid YouTube URL'}
                    </Typography>
                  </Box>
                )}
                <Typography variant="h5" gutterBottom>
                  {promo.promoName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {promo.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {details.length > 3 && !showAll && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleViewAll}
            sx={{
              backgroundColor: '#03045E',
              '&:hover': {
                backgroundColor: '#03045E',
                opacity: 0.9
              }
            }}
          >
            View All
          </Button>
        </Box>
      )}
    </MainCard>
  );
};

export default Promo; 