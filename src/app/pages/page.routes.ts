import React from 'react';

import { PageRoute } from '@core/modules/custom-router-dom/router.interface';
import homeRoutes from './home/home.routes';
import errorRoutes from './error/error.routes';
import blogRoutes from './blogs/blog.routes';
import writeRoutes from './write/write.routes';

const Page = React.lazy(() => import('./Page'));

const pageRoutes: PageRoute[] = [
  {
    path: '/',
    element: Page,
    children: [...homeRoutes, ...errorRoutes, ...blogRoutes, ...writeRoutes],
  },
];

export default pageRoutes;
