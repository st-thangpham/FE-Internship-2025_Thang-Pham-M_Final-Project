import React from 'react';

import { PageRoute } from '@core/modules/custom-router-dom/router.interface';

const Blogs = React.lazy(() => import('./containers/Blogs'));
const BlogDetail = React.lazy(() => import('./containers/BlogDetail'));
const BlogCreate = React.lazy(() => import('./containers/BlogCreate'));
const BlogUpdate = React.lazy(() => import('./containers/BlogUpdate'));

const blogRoutes: PageRoute[] = [
  {
    path: '/blogs',
    element: Blogs,
  },
  {
    path: '/blogs/:id',
    element: BlogDetail,
  },
  {
    path: '/blogs/create',
    element: BlogCreate,
    isProtected: true,
  },
  {
    path: 'blogs/update/:id',
    element: BlogUpdate,
    isProtected: true,
  },
];

export default blogRoutes;
