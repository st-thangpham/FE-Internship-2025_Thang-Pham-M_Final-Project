import React from 'react';
import { NavLink } from 'react-router-dom';

import logo from '@assets/icons/medium-seeklogo.svg';

export const Header = () => {
  const getNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? 'nav-link nav-link-active' : 'nav-link';

  return (
    <header className="header">
      <div className="container">
        <nav className="navbar">
          <NavLink className="navbar-brand" to="/">
            <img src={logo} alt="Logo" className="logo" />
          </NavLink>
          <div className="navbar-collapse">
            <ul className="navbar-nav d-flex">
              <li className="nav-item">
                <NavLink to="auth/login" className={getNavLinkClass}>
                  Login
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  to="auth/register"
                  className="nav-link btn btn-primary"
                >
                  Register
                </NavLink>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </header>
  );
};
