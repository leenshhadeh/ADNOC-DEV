import { createBrowserRouter, Navigate } from 'react-router-dom'
import { Dashboard } from '@/features/module-dashboard'
import { ProtectedRoute } from '@/shared/auth/ProtectedRoute'
import { PermissionGuard } from '@/shared/components/PermissionGuard'
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
        lazy: () =>
          import('@features/module-opportunity-management').then((m) => ({
            Component: m.OpportunityManagementModule,
          })),
      },
      {
        path: 'reports-and-extracts',
        lazy: () =>
          import('@features/module-reports-extracts').then((m) => ({
            Component: m.ReportsAndExtracts,
          })),
      },
      {
        path: 'reports-and-extracts/assessment-progress-detailed-l3',
        lazy: () =>
          import('@features/module-reports-extracts').then((m) => ({
            Component: m.AssessmentProgressDetailedL3Page,
          })),
      },
      {
        path: 'reports-and-extracts/assessment-progress-detailed-l4',
        lazy: () =>
          import('@features/module-reports-extracts').then((m) => ({
            Component: m.AssessmentProgressDetailedL4Page,
          })),
      },
      {
        path: 'reports-and-extracts/data-quality-report',
        lazy: () =>
          import('@features/module-reports-extracts').then((m) => ({
            Component: m.DataQualityReportPage,
          })),
      },
      {
        path: 'reports-and-extracts/data-opportunity-coverage',
        lazy: () =>
          import('@features/module-reports-extracts').then((m) => ({
            Component: m.OpportunityCoveragePage,
          })),
      },
      {
        path: '/reports-and-extracts/data-program-adoption',
        lazy: () =>
          import('@features/module-reports-extracts').then((m) => ({
            Component: m.ProgramAdoptionPage,
          })),
      },
      {
        path: 'reports-and-extracts/extracts_assessment_data_l3',
        lazy: () =>
          import('@features/module-reports-extracts').then((m) => ({
            Component: m.ExtractsAssessmentDataL3Page,
          })),
      },
      {
        path: 'bpa-help-and-guidelines',
        lazy: () =>
          import('@features/module-help-guidelines').then((m) => ({
            Component: m.BpaHelpAndGuidelines,
          })),
      },
      {
        path: 'settings',
        lazy: () =>
          import('@features/module-admin').then((m) => ({
            Component: () => (
              <PermissionGuard
                allowedRoles={['Quality Manager']}
                fallback={<Navigate to="/assessment-data" replace />}
              >
                <m.AdminModule />
              </PermissionGuard>
            ),
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
