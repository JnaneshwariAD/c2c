import { lazy } from 'react';
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import Login from 'views/pages/authentication3/Login3';
import Register from 'views/pages/authentication3/Register3';
import ForgotPassword from 'views/pages/authentication3/ForgotPassword';
import VerifyOtp from 'views/pages/authentication3/VerifyOtp';
import ResetPassword from 'views/pages/authentication3/ResetPassword';
import ProtectedRoute from './ProtectedRoute';

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('views/marketing')));

// utilities routing
const UtilsBanner = Loadable(lazy(() => import('views/utilitiess/marketing/Banner')));
const UtilsPromo = Loadable(lazy(() => import('views/utilitiess/marketing/Promo')));
const ViewAllPromos = Loadable(lazy(() => import('views/marketing/cards/ViewAllPromos')));
const ViewAllNews = Loadable(lazy(() => import('views/marketing/cards/ViewAllNews')));
const ViewAllSuccessStories = Loadable(lazy(() => import('views/marketing/cards/ViewAllSuccessStories')));
const UtilsNews = Loadable(lazy(() => import('views/utilitiess/marketing/News')));
const UtilsSuccessStory = Loadable(lazy(() => import('views/utilitiess/marketing/SuccessStory')));
const UtilsUsers = Loadable(lazy(() => import('views/utilitiess/academyUtilities/users/Users')));
const UtilsSettings = Loadable(lazy(() => import('views/utilitiess/mcqUtilities/Settings')));
const UtilsPayments = Loadable(lazy(() => import('views/utilitiess/mcqUtilities/Payments')));
const UtilsCertificate = Loadable(lazy(() => import('views/utilitiess/mcqUtilities/certificate/CertificateGenerator')));



const MainRoutes = {
  path: '/',

  children: [
    { path: '/', element: <Login /> },
    { path: '/register', element: <Register /> },
    { path: '/forgot-password', element: <ForgotPassword /> },
    { path: '/verify-otp', element: <VerifyOtp /> },
    { path: '/reset-password', element: <ResetPassword /> },
    {
      path: '/',
      element: <ProtectedRoute element={<MainLayout />} />,
      children: [
        {
          path: 'marketing',
          children: [
            { path: '', element: <DashboardDefault /> },
            { path: 'banner', element: <UtilsBanner /> },
            { path: 'news', element: <UtilsNews /> },
            { path: 'promo', element: <UtilsPromo /> },
            { path: 'promos', element: <ViewAllPromos /> },
            { path: 'all/news', element: <ViewAllNews /> },
            { path: 'success-stories', element: <ViewAllSuccessStories /> },
            { path: 'success-story', element: <UtilsSuccessStory /> },
            { path: 'certificate', element: <UtilsCertificate /> },
            { path: 'payments', element: <UtilsPayments /> },
            { path: 'users', element: <UtilsUsers /> },
            { path: 'settings', element: <UtilsSettings /> }
          ]
        }
      ]
    }
  ]
};

export default MainRoutes;
