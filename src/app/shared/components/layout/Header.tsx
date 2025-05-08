import React, { useContext, useEffect, useRef, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { AuthContext } from '@app/shared/contexts/auth.context';
import { AuthStorageService } from '@core/services/auth-storage.service';

import logo from '/icons/medium-seeklogo.svg';
import defaultAvatar from '/imgs/avatar.jpg';
import writeIcon from '/icons/write.svg';

export const Header = () => {
  const { isAuthenticated, user, clearUserSession } = useContext(AuthContext)!;
  const authStorage = new AuthStorageService();
  const navigate = useNavigate();

  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);

  const handleLogout = () => {
    clearUserSession();
    authStorage.removeToken();
    toast.success('Logout successful!');
    navigate('/');
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY.current && currentScrollY > 80) {
        setHidden(true);
      } else {
        setHidden(false);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`header ${hidden ? 'hidden' : ''}`}>
      <div className="container">
        <nav className="navbar">
          <NavLink className="navbar-brand" to="/">
            <img src={logo} alt="Logo" className="logo" />
          </NavLink>

          <div className="navbar-collapse">
            <ul className="navbar-nav d-flex align-items-center">
              {!isAuthenticated ? (
                <li className="nav-item">
                  <NavLink
                    to="/auth/login"
                    className="nav-link btn btn-primary"
                  >
                    Sign In
                  </NavLink>
                </li>
              ) : (
                <>
                  <li className="nav-item">
                    <span className="nav-link btn btn-icon">
                      <img src={writeIcon} alt="writeIcon" />
                      Write
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
