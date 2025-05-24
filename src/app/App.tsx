import React from 'react';

import { createRoot } from 'react-dom/client';
import {
  Outlet,
  RouterProvider,
  ScrollRestoration,
  createBrowserRouter,
} from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import { ToastContainer } from 'react-toastify';

import '@stylesheet/_style.scss';

import appRoutes from './app.routes';
import AppSuspense from './AppSuspense';

import { renderChildren } from './core/modules/custom-router-dom/RouterOutlet';
import AppErrorBoundaryFallback from './AppErrorBoundaryFallback';
import { Provider } from 'react-redux';
import { store } from '@store/store';
import { AuthProvider } from './shared/contexts/auth.context';

export const Root = () => {
  return (
    <>
      <ErrorBoundary FallbackComponent={AppErrorBoundaryFallback}>
        <AppSuspense fallback={<></>}>
          <Outlet />
          <ScrollRestoration />
          <ToastContainer position="top-center" autoClose={1500} />
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
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </AuthProvider>
);
