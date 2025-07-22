import { useEffect, useState } from 'react';

// material-ui
import Grid from '@mui/material/Grid';

// project imports

import Banner from './Banner';

import { gridSpacing } from 'store/constant';
import Promo from './cards/Promo';
import News from './cards/News';
import SuccessStory from './cards/SuccessStory';

// ==============================|| DEFAULT DASHBOARD ||============================== //

const Dashboard = () => {
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <Grid container spacing={gridSpacing}>
      <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
          <Grid item lg={12} md={12} sm={12} xs={12}>
            <Banner isLoading={isLoading} />
          </Grid>
          {/* <Grid item xs={12}>
            <Category isLoading={isLoading} />
          </Grid> */}
          <Grid item xs={12}>
            <Promo isLoading={isLoading} />
          </Grid>
          <Grid item xs={12}>
            <News isLoading={isLoading} />
          </Grid>
          <Grid item xs={12}>
            <SuccessStory isLoading={isLoading} />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Dashboard;
