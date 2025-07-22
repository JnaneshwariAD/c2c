// assets
import { IconDashboard, IconLayoutDashboard } from '@tabler/icons-react';

// constant
const icons = { IconLayoutDashboard, IconDashboard };

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const marketing = {
  id: 'marketing',
  title: 'Marketing',
  type: 'group',
  children: [
    {
      id: 'default',
      title: 'Marketing',
      type: 'item',
      url: '/marketing',
      icon: icons.IconLayoutDashboard,
      breadcrumbs: false
    }
  ]
};

export default marketing;
