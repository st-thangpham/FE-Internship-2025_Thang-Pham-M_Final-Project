import React from 'react';
import { Outlet } from 'react-router-dom';

const Auth = () => {
  return (
    <div className="container basic-container">
      <main className="main">
        <Outlet />
      </main>
    </div>
  );
};

export default Auth;
