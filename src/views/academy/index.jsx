import { useEffect, useState } from 'react';

// material-ui
import Grid from '@mui/material/Grid';

// project imports

import Banner from 'views/marketing/Banner';

import { gridSpacing } from 'store/constant';
import Masters from './cards/Masters';
import Courses from './cards/Courses';
import Batches from './cards/Batches';
import Users from './cards/Users';

// ==============================|| DEFAULT DASHBOARD ||============================== //

const Academy = () => {
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <Grid container spacing={gridSpacing}>
      <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
          <Grid item xs={12}>
            <Banner isLoading={isLoading} />
          </Grid>
          <Grid item  xs={12}>
            <Masters isLoading={isLoading} />
          </Grid>
          <Grid item  xs={12}>
            <Courses isLoading={isLoading} />
          </Grid>
          <Grid item  xs={12}>
            <Batches isLoading={isLoading} />
          </Grid>
          <Grid item  xs={12}>
            <Users isLoading={isLoading} />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Academy;
