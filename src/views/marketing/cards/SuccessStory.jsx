import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Grid, Card, CardContent, Typography, Button, Box } from '@mui/material';
import { fetchSuccess } from 'views/API/SuccessStoryApi';
import MainCard from 'ui-component/cards/MainCard';
import { BaseUrl } from 'BaseUrl';

const SuccessStory = () => {
  const [details, setDetails] = useState([]);
  const [showAll, setShowAll] = useState(false);

  const user = JSON.parse(sessionStorage.getItem('user'));
  const headers = {
    'Content-type': 'application/json',
    Authorization: 'Bearer ' + user.accessToken
  };
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const res = await fetchSuccess(headers);
      const fetchedData = res.data.content;
      console.log(res);
      if (fetchedData) {
        setDetails(fetchedData);
      }
    } catch (error) {
      console.error('Error fetching news:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleViewAll = () => {
    navigate('success-stories');
  };

  const displayedNews = showAll ? details : details.slice(0, 3);

  const ImageUrl = `${BaseUrl}/file/downloadFile/?filePath=`;

  return (
    <MainCard>
      <Typography variant="h3" gutterBottom>
        Success Stories
      </Typography>

      <Grid container spacing={2}>
        {displayedNews.map((news) => (
          <Grid item xs={12} sm={6} md={4} lg={4} key={news.newsId}>
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
                {/* Display the image if photoPath exists */}
                {news.photoPath && (
                  <img
                    src={`${ImageUrl}${news.photoPath}`}
                    alt={news.successstoryName}
                    style={{
                      width: '100%',
                      height: '200px',
                      objectFit: 'cover',
                      marginBottom: '1rem'
                    }}
                  />
                )}
                <Typography variant="h4" sx={{ mb: 2 }}>
                  {news.successstoryName}
                </Typography>
                <Typography variant="body2">{news.description}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Show "View All" button if there are more than 3 news and "View Less" if showing all */}
      <Box sx={{ textAlign: { sm: 'right', xs: 'center' }, mt: 2, mr: 2 }}>
        {!showAll && details.length > 3 && (
          <Button variant="contained" color="primary" onClick={handleViewAll}>
            View All
          </Button>
        )}
      </Box>
    </MainCard>
  );
};

export default SuccessStory;
