import React from 'react';

import { PageRoute } from '@core/modules/custom-router-dom/router.interface';

const Profile = React.lazy(() => import('./containers/Profile'));

const profileRoutes: PageRoute[] = [
  {
    path: '/profile/:id',
    element: Profile,
    isProtected: true,
  },
];

export default profileRoutes;
