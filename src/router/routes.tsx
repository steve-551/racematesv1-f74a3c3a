
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import HomePage from '@/pages/HomePage';
import DashboardPage from '@/pages/DashboardPage';
import FindRacersPage from '@/pages/FindRacersPage';
import RacerProfile from '@/pages/RacerProfile';
import MyRacerProfile from '@/pages/MyRacerProfile';
import LoginPage from '@/pages/LoginPage';
import SignupPage from '@/pages/SignupPage';
import NotFoundPage from '@/pages/NotFoundPage';
import EventsPage from '@/pages/EventsPage';
import EventDetailPage from '@/pages/EventDetailPage';
import CreateEventPage from '@/pages/CreateEventPage';
import NoticeBoardPage from '@/pages/NoticeBoardPage';
import SetupsPage from '@/pages/SetupsPage';
import StintPlannerPage from '@/pages/StintPlannerPage';
import TeamsPage from '@/pages/TeamsPage';
import TeamDashboard from '@/pages/TeamDashboard';
import ProfileSettings from '@/pages/ProfileSettings';
import AccountSettings from '@/pages/AccountSettings';
import NotificationsPage from '@/pages/NotificationsPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/dashboard',
    element: <DashboardPage />,
  },
  {
    path: '/find-racers',
    element: <FindRacersPage />,
  },
  {
    path: '/racer/:id',
    element: <RacerProfile />,
  },
  {
    path: '/profile',
    element: <MyRacerProfile />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/signup',
    element: <SignupPage />,
  },
  {
    path: '/events',
    element: <EventsPage />,
  },
  {
    path: '/events/create',
    element: <CreateEventPage />,
  },
  {
    path: '/events/:id',
    element: <EventDetailPage />,
  },
  {
    path: '/notice-board',
    element: <NoticeBoardPage />,
  },
  {
    path: '/setups',
    element: <SetupsPage />,
  },
  {
    path: '/stint-planner',
    element: <StintPlannerPage />,
  },
  {
    path: '/teams',
    element: <TeamsPage />,
  },
  {
    path: '/team/:id',
    element: <TeamDashboard />,
  },
  {
    path: '/settings/profile',
    element: <ProfileSettings />,
  },
  {
    path: '/settings/account',
    element: <AccountSettings />,
  },
  {
    path: '/notifications',
    element: <NotificationsPage />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);

const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;
