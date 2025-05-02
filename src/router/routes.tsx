
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Index as HomePage } from '@/pages/Index';
import { Dashboard as DashboardPage } from '@/pages/Dashboard';
import { FindRacers as FindRacersPage } from '@/pages/FindRacers';
import { RacerProfile } from '@/pages/RacerProfile';
import { MyRacerProfile } from '@/pages/MyRacerProfile';
import { AuthPage as LoginPage } from '@/pages/AuthPage';
import { AuthPage as SignupPage } from '@/pages/AuthPage';
import { NotFound as NotFoundPage } from '@/pages/NotFound';
import { EventBrowser as EventsPage } from '@/pages/EventBrowser';
import { NotFound as EventDetailPage } from '@/pages/NotFound';
import { NotFound as CreateEventPage } from '@/pages/NotFound';
import { NoticeBoard as NoticeBoardPage } from '@/pages/NoticeBoard';
import { SetupVault as SetupsPage } from '@/pages/SetupVault';
import { StintPlanner as StintPlannerPage } from '@/pages/StintPlanner';
import { TeamsPage } from '@/pages/TeamsPage';
import { TeamDashboard } from '@/pages/TeamDashboard';
import { NotFound as ProfileSettings } from '@/pages/NotFound';
import { NotFound as AccountSettings } from '@/pages/NotFound';
import { NotFound as NotificationsPage } from '@/pages/NotFound';

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
