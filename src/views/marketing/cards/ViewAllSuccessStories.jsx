import React, { useState, useEffect } from 'react';
import { Grid, Card, CardContent, Typography } from '@mui/material';
import { fetchSuccess } from 'views/API/SuccessStoryApi';
import MainCard from 'ui-component/cards/MainCard';
import { BaseUrl } from 'BaseUrl';
import { useNavigate } from 'react-router-dom';

const ViewAllSuccessStories = () => {
  const [details, setDetails] = useState([]);

  const user = JSON.parse(sessionStorage.getItem('user'));
  const headers = {
    'Content-type': 'application/json',
    Authorization: 'Bearer ' + user.accessToken
  };
  const navigate = useNavigate();

  // Fetch news data
  const fetchData = async () => {
    try {
      const res = await fetchSuccess(headers);
      const fetchedData = res.data.content;
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

  const ImageUrl = `${BaseUrl}/file/downloadFile/?filePath=`;

  return (
    <MainCard>
      <Typography variant="h3" gutterBottom>
        Success Story
      </Typography>

      <Grid container spacing={2}>
        {details.map((news) => (
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
    </MainCard>
  );
};

export default ViewAllSuccessStories;
