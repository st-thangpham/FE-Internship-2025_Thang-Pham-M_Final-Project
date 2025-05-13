import React from 'react';

import logo from '/imgs/logo.png';

export const FooterBasic = () => {
  return (
    <footer className="footer footer-basic">
      <div className="menu-list">
        <a className="footer-logo" href="/">
          <img src={logo} alt="logo" />
        </a>
        <p className="txt-sm">&copy; 2025 Thang Pham</p>
      </div>
    </footer>
  );
};
