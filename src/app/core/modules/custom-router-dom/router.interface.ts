import { JSX, LazyExoticComponent } from 'react';

export interface PageRoute {
  path: string;
  element?: LazyExoticComponent<() => JSX.Element>;
  isProtected?: boolean; // default is false,
  isAuth?: boolean;
  redirect?: string;
  children?: PageRoute[];
  loader?: () => Promise<unknown>;
}
