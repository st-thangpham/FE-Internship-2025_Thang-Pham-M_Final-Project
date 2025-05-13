import React from 'react';
import { PageRoute } from '@core/modules/custom-router-dom/router.interface';

const Blogs = React.lazy(() => import('./containers/Blogs'));
const BlogDetail = React.lazy(() => import('./containers/BlogDetail'));

const blogRoutes: PageRoute[] = [
  {
    path: '/blogs',
    element: Blogs,
  },
  {
    path: '/blogs/:id',
    element: BlogDetail,
  },
];

export default blogRoutes;
