import React from 'react';
import { Outlet } from 'react-router-dom';

import { FooterBasic } from '@app/shared/components/layout/FooterBasic';

const Auth = () => {
  return (
    <div className="container basic-container">
      <main className="main">
        <Outlet />
      </main>
      <FooterBasic />
    </div>
  );
};

export default Auth;
