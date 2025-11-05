import AppLayout from '@/layouts/app-layout';
import DashboardPage from '@/routes/dashboard/page';
import CasesPage from '@/routes/cases/page';
import CaseDetailsPage from '@/routes/cases/[id]/page';
import CaseReviewsPage from '@/routes/cases/[id]/reviews/page';
import CreateCaseReviewPage from '@/routes/cases/[id]/reviews/create/page';
import CaseNotesPage from '@/routes/cases/[id]/notes/page';
import MyCasesPage from '@/routes/my-cases/page';
import ResearchHubPage from '@/routes/research-hub/page';
import LeaderboardPage from '@/routes/leaderboard/page';
import SettingsPage from '@/routes/settings/page';
import ProfilePage from '@/routes/settings/profile/page';
import SubmitCasePage from '@/routes/submit-case/page';
import TrackPage from '@/routes/track/page';
import LoginPage from '@/routes/login/page';
import VerifyPage from '@/routes/login/verify/page';
import RegisterPage from '@/routes/register/page';
import VerifyRegisterPage from '@/routes/register/verify/page';
import NotFoundPage from '@/routes/not-found/page';
import { authLoader, publicLoader } from '@/lib/auth-loader';
import { createBrowserRouter } from 'react-router-dom';

export const router = createBrowserRouter([
  {
    path: '/submit-case',
    element: <SubmitCasePage />,
  },
  {
    path: '/track',
    element: <TrackPage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
    loader: publicLoader,
  },
  {
    path: '/login/verify',
    element: <VerifyPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
    loader: publicLoader,
  },
  {
    path: '/register/verify',
    element: <VerifyRegisterPage />,
  },
  {
    path: '/',
    element: <AppLayout />,
    loader: authLoader,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: 'cases',
        element: <CasesPage />,
      },
      {
        path: 'cases/:id',
        element: <CaseDetailsPage />,
      },
      {
        path: 'cases/:id/reviews',
        element: <CaseReviewsPage />,
      },
      {
        path: 'cases/:id/reviews/create',
        element: <CreateCaseReviewPage />,
      },
      {
        path: 'cases/:id/notes',
        element: <CaseNotesPage />,
      },
      {
        path: 'my-cases',
        element: <MyCasesPage />,
      },
      {
        path: 'research-hub',
        element: <ResearchHubPage />,
      },
      {
        path: 'leaderboard',
        element: <LeaderboardPage />,
      },
      {
        path: 'settings',
        element: <SettingsPage />,
      },
      {
        path: 'settings/profile',
        element: <ProfilePage />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);
