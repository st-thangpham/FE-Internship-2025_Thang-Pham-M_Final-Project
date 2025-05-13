import React, { useContext, useEffect, useRef, useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';

import { AuthContext } from '@app/shared/contexts/auth.context';
import { AuthStorageService } from '@core/services/auth-storage.service';

import logo from '/imgs/logo.png';
import defaultAvatar from '/imgs/avatar.jpg';
import writeIcon from '/icons/write.svg';

export const Header = () => {
  const { isAuthenticated, user, clearUserSession } = useContext(AuthContext)!;
  const authStorage = new AuthStorageService();
  const navigate = useNavigate();
  const location = useLocation();

  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);

  const handleLogout = () => {
    clearUserSession();
    authStorage.removeToken();
    toast.success('Logout successful!');
    window.location.reload();
    navigate('/');
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY.current && currentScrollY > 80) {
        setHidden(true);
        document.body.classList.add('header-hidden');
      } else {
        setHidden(false);
        document.body.classList.remove('header-hidden');
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.body.classList.remove('header-hidden');
    };
  }, []);

  const isWritePage = location.pathname === '/write';

  return (
    <header className={`header ${hidden ? 'hidden' : ''}`}>
      <div className={isWritePage ? 'basic-header-container' : 'no-container'}>
        <nav className="navbar">
          <h1 className="navbar-brand">
            <NavLink to="/">
              <img src={logo} alt="Logo" className="logo" />
            </NavLink>
          </h1>

          <div className="navbar-collapse">
            <ul className="navbar-nav d-flex align-items-center">
              {!isAuthenticated ? (
                <li className="nav-item">
                  <NavLink to="/auth/login" className="btn btn-auth">
                    Sign In
                  </NavLink>
                </li>
              ) : isWritePage ? (
                <>
                  <li className="nav-item">
                    <button
                      className="btn btn-submit"
                      onClick={() => {
                        const event = new Event('submitBlog');
                        window.dispatchEvent(event);
                      }}
                    >
                      Post
                    </button>
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
              ) : (
                <>
                  <li className="nav-item">
                    <NavLink to="/write" className="nav-link btn btn-icon">
                      <img src={writeIcon} alt="writeIcon" />
                    </NavLink>
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
