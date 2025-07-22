// assets
import {
  IconTypography,
  IconPalette,
  IconShadow,
  IconWindmill,
  IconSettings,
  IconUser,
  IconPaperBag,
  IconCurrencyRupee,
  IconCertificate,
  IconAd2
} from '@tabler/icons-react';

// constant
const icons = {
  IconTypography,
  IconPalette,
  IconShadow,
  IconWindmill,
  IconSettings,
  IconUser,
  IconCurrencyRupee,
  IconCertificate,
  IconAd2
};

// ==============================|| UTILITIES MENU ITEMS ||============================== //

const utilities = {
  id: 'pages',
  title: 'Pages',
  type: 'group',
  children: [
    {
      id: 'ads',
      title: 'Ads',
      type: 'collapse',
      icon: icons.IconAd2,
      url: null,
      children: [
        {
          id: 'banner',
          title: 'Banner',
          type: 'item',
          url: '/marketing/banner',
          breadcrumbs: false
        },
        {
          id: 'news',
          title: 'News',
          type: 'item',
          url: '/marketing/news',
          breadcrumbs: false
        },
        {
          id: 'promo',
          title: 'Promo',
          type: 'item',
          url: '/marketing/promo',
          breadcrumbs: false
        },
        {
          id: 'success-story',
          title: 'Success Story',
          type: 'item',
          url: '/marketing/success-story',
          breadcrumbs: false
        }
      ]
    },

    // {
    //   id: 'certificate',
    //   title: 'Certificate',
    //   type: 'item',
    //   url: '/dashboard/certificate',
    //   icon: icons.IconCertificate,
    //   breadcrumbs: false
    // },
    {
      id: 'payments',
      title: 'Payments',
      type: 'item',
      url: '/marketing/payments',
      icon: icons.IconCurrencyRupee,
      breadcrumbs: false
    },
    {
      id: 'users',
      title: 'Users',
      type: 'item',
      url: '/marketing/users',
      icon: icons.IconUser,
      breadcrumbs: false
    },
    {
      id: 'settings',
      title: 'Settings',
      type: 'item',
      url: '/marketing/settings',
      icon: icons.IconSettings,
      breadcrumbs: false
    }
  ]
};

export default utilities;
