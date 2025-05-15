import React from 'react';
import { PrivateRoute } from './PrivateRoute';

export const renderChildren = (routes) => {
  return routes.map((route) => {
    const Element = route.element;

    return {
      ...route,
      element: route.isProtected ? (
        <PrivateRoute>
          <Element />
        </PrivateRoute>
      ) : (
        <Element />
      ),
      children: route.children ? renderChildren(route.children) : [],
    };
  });
};
