// assets
import {
  IconTypography,
  IconPalette,
  IconShadow,
  IconWindmill,
  IconSettings,
  IconUser,
  IconUsers,
  IconUserExclamation,
  IconUsersGroup,
  IconPaperBag,
  IconCurrencyRupee,
  IconBook,
  IconLayout
} from '@tabler/icons-react';

// constant
const icons = {
  IconTypography,
  IconPalette,
  IconShadow,
  IconWindmill,
  IconSettings,
  IconUser,
  IconUsers,
  IconUserExclamation,
  IconUsersGroup,
  IconPaperBag,
  IconCurrencyRupee,
  IconBook,
  IconLayout
};

// ==============================|| UTILITIES MENU ITEMS ||============================== //

const academyUtilities = {
  id: 'pages',
  title: 'Pages',
  type: 'group',
  children: [
    {
      id: 'masters',
      title: 'Masters',
      type: 'collapse',
      icon: icons.IconLayout,
      url: null,
      children: [
      
        {
          id: 'category',
          title: 'Category',
          type: 'item',
          url: '/academy/category',
          breadcrumbs: false
        },
        {
          id: 'university',
          title: 'University',
          type: 'item',
          url: '/academy/university',
          breadcrumbs: false
        },
        {
          id: 'college',
          title: 'College',
          type: 'item',
          url: '/academy/college',
          breadcrumbs: false
        },
        // {
        //   id: 'branch',
        //   title: 'Branch',
        //   type: 'item',
        //   url: '/academy/branch',
        //   breadcrumbs: false
        // },
        {
          id: 'course',
          title: 'Course',
          type: 'item',
          url: '/academy/course',
          breadcrumbs: false
        }
        // {
        //   id: 'role',
        //   title: 'Role',
        //   type: 'item',
        //   url: '/academy/role',
        //   breadcrumbs: false
        // }
      ]
    },
    {
      id: 'academy',
      title: 'Course',
      type: 'collapse',
      icon: icons.IconBook,
      url: null,
      children: [
        // {
        //   id: 'course',
        //   title: 'Course',
        //   type: 'item',
        //   url: '/academy/course',
        //   breadcrumbs: false
        // },
        //  {
        //   id: 'semester',
        //   title: 'Semester',
        //   type: 'item',
        //   url: '/academy/semester',
        //   breadcrumbs: false
        // },
        {
          id: 'subjects',
          title: 'Subjects',
          type: 'item',
          url: '/academy/subjects',
          breadcrumbs: false
        },
        {
          id: 'modules',
          title: 'Modules',
          type: 'item',
          url: '/academy/modules',
          breadcrumbs: false
        },
         
        {
          id: 'topics',
          title: 'Topics',
          type: 'item',
          url: '/academy/topics',
          breadcrumbs: false
        }
      ]
    },
    // Batch 
    {
      id: 'batch',
      title: 'Batch',
      type: 'collapse',
      icon: icons.IconUsersGroup,
      url: null,
      children: [
      
        {
          id: 'batch',
          title: 'Batch',
          type: 'item',
          url: '/academy/batch',
          breadcrumbs: false
        },
       
      ]
    },

    // users
    {
      id: 'users',
      title: 'Users',
      type: 'collapse',
      icon: icons.IconUsers,
      url: null,
      children: [
      
        {
          id: 'users',
          title: 'Users',
          type: 'item',
          url: '/academy/users',
          breadcrumbs: false
        },
        {
          id: 'candidates',
          title: 'Candidates',
          type: 'item',
          url: '/academy/candidates',
          breadcrumbs: false
        },
       
      ]
    },

    {
      id: 'payments',
      title: 'Payments',
      type: 'item',
      url: '/academy/payments',
      icon: icons.IconCurrencyRupee,
      breadcrumbs: false
    },
 
    {
      id: 'settings',
      title: 'Settings',
      type: 'item',
      url: '/academy/settings',
      icon: icons.IconSettings,
      breadcrumbs: false
    }
  ]
};

export default academyUtilities;
