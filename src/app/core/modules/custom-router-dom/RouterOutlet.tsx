import React from 'react';
import { PrivateRoute } from './PrivateRoute';
import { AuthRoute } from './AuthRoute';

export const renderChildren = (routes) => {
  return routes.map((route) => {
    const Element = route.element;

    let wrappedElement = <Element />;

    if (route.isProtected) {
      wrappedElement = <PrivateRoute>{wrappedElement}</PrivateRoute>;
    } else if (route.isAuth) {
      wrappedElement = <AuthRoute>{wrappedElement}</AuthRoute>;
    }

    return {
      ...route,
      element: wrappedElement,
      children: route.children ? renderChildren(route.children) : [],
    };
  });
};
