import React from 'react';

import { PageRoute } from '@core/modules/custom-router-dom/router.interface';

const WriteBlog = React.lazy(() => import('./containers/WriteBlog'));

const writeRoutes: PageRoute[] = [
  {
    path: 'write',
    element: WriteBlog,
    isProtected: true,
  },
];

export default writeRoutes;
