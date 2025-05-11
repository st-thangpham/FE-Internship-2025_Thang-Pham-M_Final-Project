import { Footer, Header } from '@shared/components/layout';
import React from 'react';
import { Outlet } from 'react-router-dom';

const Page = () => {
  return (
    <>
      <Header />
      <main className="main">
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default Page;
