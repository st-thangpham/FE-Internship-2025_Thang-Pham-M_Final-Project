import React from 'react';

import { PageRoute } from '@core/modules/custom-router-dom/router.interface';

const Blogs = React.lazy(() => import('./containers/Blogs'));

const blogRoutes: PageRoute[] = [
  {
    path: '/blog',
    element: Blogs,
  },
];

export default blogRoutes;
