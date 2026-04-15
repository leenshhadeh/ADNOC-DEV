import { createBrowserRouter, Navigate } from 'react-router-dom'
import { Dashboard } from '@/features/module-dashboard'
import { ProtectedRoute } from '@/shared/auth/ProtectedRoute'
import { LoginPage, HomePage } from '@/shared/auth/pages'

const PlaceholderPage = ({ title }: { title: string }) => {
  return <h1 className="text-foreground text-2xl font-semibold">{title}</h1>
}

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/home',
    element: (
      <ProtectedRoute>
        <HomePage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/assessment-data" replace />,
      },
      {
        path: 'assessment-data',
        lazy: () =>
          import('@features/module-assessment-data').then((m) => ({
            Component: m.AssessmentDataModule,
          })),
      },
      {
        path: 'assessment-data/process/:processId',
        lazy: () =>
          import('@features/module-assessment-data').then((m) => ({
            Component: m.ProcessDetailsPage,
          })),
      },
      {
        path: 'dashboard',
        lazy: () =>
          import('@/features/module-dashboard').then((m) => ({ Component: m.DashboardModule })),
      },
      {
        path: 'automation-targets',
        lazy: () =>
          import('@features/module-automation-targets').then((m) => ({
            Component: m.AutomationTargetsModule,
          })),
      },
      {
        path: 'automation-targets/process/:processId',
        lazy: () =>
          import('@features/module-automation-targets').then((m) => ({
            Component: m.AutomationProcessDetailsPage,
          })),
      },
      {
        path: 'process-catalog',
        lazy: () =>
          import('@features/module-process-catalog').then((m) => ({ Component: m.CatalogModule })),
      },
      {
        path: 'process-catalog/recorded-changes/:processId',
        lazy: () =>
          import('@features/module-process-catalog').then((m) => ({
            Component: m.RecordedChangesPage,
          })),
      },
      {
        path: 'opportunities',
        element: <PlaceholderPage title="Opportunities" />,
      },
      {
        path: 'settings',
        lazy: () =>
          import('@features/module-admin').then((m) => ({
            Component: m.AdminModule,
          })),
      },
      {
        path: 'logout',
        element: <PlaceholderPage title="Log out" />,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/assessment-data" replace />,
  },
])
