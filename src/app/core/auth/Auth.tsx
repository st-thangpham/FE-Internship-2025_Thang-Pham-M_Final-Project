import React from 'react';
import { Outlet } from 'react-router-dom';

import { Footer } from '@app/shared/components/layout';

const Auth = () => {
  return (
    <div className="container basic-container">
      <main className="main">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Auth;
