import { Footer, Header } from '@shared/components/layout';
import React from 'react';
import { Outlet } from 'react-router-dom';

const Page = () => {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default Page;
