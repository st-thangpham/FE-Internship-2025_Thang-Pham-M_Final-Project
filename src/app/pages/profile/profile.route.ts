import React from 'react';

import { PageRoute } from '@core/modules/custom-router-dom/router.interface';

const Profile = React.lazy(() => import('./containers/Profile'));

const homeRoutes: PageRoute[] = [
  {
    path: '/profile/:id',
    element: Profile,
  },
];

export default homeRoutes;
