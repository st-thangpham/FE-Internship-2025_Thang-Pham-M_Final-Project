import React from 'react';

import { createRoot } from 'react-dom/client';
import { Outlet, RouterProvider, createBrowserRouter } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import { ToastContainer } from 'react-toastify';

import '@stylesheet/_style.scss';

import appRoutes from './app.routes';
import AppSuspense from './AppSuspense';

import { AuthProvider } from './shared/contexts/auth.context';
import { renderChildren } from './core/modules/custom-router-dom/RouterOutlet';
import AppErrorBoundaryFallback from './AppErrorBoundaryFallback';

export const Root = () => {
  return (
    <>
      <ErrorBoundary FallbackComponent={AppErrorBoundaryFallback}>
        <AppSuspense fallback={<></>}>
          <Outlet />
          <ToastContainer position="top-right" autoClose={3000} />
        </AppSuspense>
      </ErrorBoundary>
    </>
  );
};

const router = createBrowserRouter([
  { path: '/', Component: Root, children: renderChildren(appRoutes) },
]);

const root = createRoot(document.getElementById('root'));
root.render(
  <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>
);
