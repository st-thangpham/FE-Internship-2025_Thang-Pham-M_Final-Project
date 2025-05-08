import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { toast } from 'react-toastify';

import { AuthContext } from '@app/shared/contexts/auth.context';
import { AuthStorageService } from '@core/services/auth-storage.service';

import logo from '/icons/medium-seeklogo.svg';
import defaultAvatar from '/imgs/avatar.jpg';
import writeIcon from '/icons/write.svg';

export const Header = () => {
  const { isAuthenticated, user, clearUserSession } = useContext(AuthContext)!;
  const authStorage = new AuthStorageService();

  const getNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? 'nav-link nav-link-active' : 'nav-link';

  const handleLogout = () => {
    clearUserSession();
    authStorage.removeToken();
    toast.success('Logout successful!');
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  return (
    <header className="header">
      <div className="container">
        <nav className="navbar">
          <NavLink className="navbar-brand" to="/">
            <img src={logo} alt="Logo" className="logo" />
          </NavLink>

          <div className="navbar-collapse">
            <ul className="navbar-nav d-flex align-items-center">
              {!isAuthenticated ? (
                <>
                  <li className="nav-item">
                    <NavLink to="/auth/login" className={getNavLinkClass}>
                      Sign In
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink
                      to="/auth/register"
                      className="nav-link btn btn-primary"
                    >
                      Sign Up
                    </NavLink>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <span className="nav-link btn btn-icon">
                      <img src={writeIcon} alt="writeIcon" />
                    </span>
                  </li>
                  <li className="nav-item">
                    <button className="btn btn-avatar" onClick={handleLogout}>
                      <img
                        src={user?.picture || defaultAvatar}
                        alt="Avatar"
                        className="img"
                      />
                    </button>
                  </li>
                </>
              )}
            </ul>
          </div>
        </nav>
      </div>
    </header>
  );
};
