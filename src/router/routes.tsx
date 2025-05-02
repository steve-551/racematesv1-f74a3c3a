
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Index from '@/pages/Index';
import Dashboard from '@/pages/Dashboard';
import FindRacers from '@/pages/FindRacers';
import RacerProfile from '@/pages/RacerProfile';
import MyRacerProfile from '@/pages/MyRacerProfile';
import AuthPage from '@/pages/AuthPage';
import NotFound from '@/pages/NotFound';
import EventBrowser from '@/pages/EventBrowser';
import SetupVault from '@/pages/SetupVault';
import StintPlanner from '@/pages/StintPlanner';
import TeamsPage from '@/pages/TeamsPage';
import TeamDashboard from '@/pages/TeamDashboard';
import NoticeBoard from '@/pages/NoticeBoard';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Index />,
  },
  {
    path: '/dashboard',
    element: <Dashboard />,
  },
  {
    path: '/find-racers',
    element: <FindRacers />,
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
    element: <AuthPage />,
  },
  {
    path: '/signup',
    element: <AuthPage />,
  },
  {
    path: '/events',
    element: <EventBrowser />,
  },
  {
    path: '/events/create',
    element: <NotFound />,
  },
  {
    path: '/events/:id',
    element: <NotFound />,
  },
  {
    path: '/notice-board',
    element: <NoticeBoard />,
  },
  {
    path: '/setups',
    element: <SetupVault />,
  },
  {
    path: '/stint-planner',
    element: <StintPlanner />,
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
    element: <NotFound />,
  },
  {
    path: '/settings/account',
    element: <NotFound />,
  },
  {
    path: '/notifications',
    element: <NotFound />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);

const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;
