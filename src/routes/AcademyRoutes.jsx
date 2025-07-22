import { lazy } from 'react';
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import Login from 'views/pages/authentication3/Login3';
import Register from 'views/pages/authentication3/Register3';
import ProtectedRoute from './ProtectedRoute';
import { element } from 'prop-types';
import Semester from 'views/utilitiess/academyUtilities/courses/Semester';
import { Navigate } from 'react-router-dom';
import Subjects from 'views/utilitiess/academyUtilities/courses/Subjects';

// utilities routing
const UtilsPayments = Loadable(lazy(() => import('views/utilitiess/academyUtilities/Payments')));

const UtilsUsers = Loadable(lazy(() => import('views/utilitiess/academyUtilities/users/Users')));
const UtilsCandidates = Loadable(lazy(() => import('views/utilitiess/academyUtilities/users/Candidates')));
const UtilsSettings = Loadable(lazy(() => import('views/utilitiess/academyUtilities/Settings')));
const UtilsCategory = Loadable(lazy(() => import('views/utilitiess/academyUtilities/masters/Category')));
const UtilsCollege = Loadable(lazy(() => import('views/utilitiess/academyUtilities/masters/College')));
const UtilsUniversity = Loadable(lazy(() => import('views/utilitiess/academyUtilities/masters/University')));
const UtilsBranch = Loadable(lazy(() => import('views/utilitiess/academyUtilities/masters/Branch')));
const UtilsRole = Loadable(lazy(() => import('views/utilitiess/academyUtilities/masters/Role')));
const UtilsCourse = Loadable(lazy(() => import('views/utilitiess/academyUtilities/masters/Courses')));
const UtilsModules = Loadable(lazy(() => import('views/utilitiess/academyUtilities/courses/Module')));
const UtilsTopics = Loadable(lazy(() => import('views/utilitiess/academyUtilities/courses/Topic')));
const UtilsBatch = Loadable(lazy(() => import('views/utilitiess/academyUtilities/batch/Batch')));
const Academy = Loadable(lazy(() => import('views/academy')));

const AcademyRoutes = {
  path: '/',
  children: [
    { path: '/', element: <Login /> },
    { path: '/register', element: <Register /> },
    {
      path: '/',
      element: <ProtectedRoute element={<MainLayout />} />,
      children: [
        {
          path: 'academy',
          children: [
            { path: '', element: <Academy /> },
            
            { path: 'payments', element: <UtilsPayments /> },
            { path: 'users', element: <UtilsUsers /> },
            { path: 'candidates', element: <UtilsCandidates /> },
            { path: 'settings', element: <UtilsSettings /> },
            { path: 'category', element: <UtilsCategory /> },
            { path: 'college', element: <UtilsCollege /> },
            { path: 'university', element: <UtilsUniversity /> },
            { path: 'branch', element: <UtilsBranch /> },
            { path: 'role', element: <UtilsRole /> },
            { path: 'course', element: <UtilsCourse/> },
            { path: 'modules', element: <UtilsModules /> },
            { path: 'topics', element: <UtilsTopics /> },
            { path: 'batch', element: <UtilsBatch /> },
            { path: 'semester', element: <Semester/> },
            {path: 'subjects' , element: <Subjects/>},
            //  { path: ':academyName', element: <CourseList /> }
            { 
              path: '*', 
              element: <Navigate to="/academy" replace /> 
              // Or show a 404 component: element: <NotFound />
            }
          ]
        }
      ]
    }
  ]
};

export default AcademyRoutes;
