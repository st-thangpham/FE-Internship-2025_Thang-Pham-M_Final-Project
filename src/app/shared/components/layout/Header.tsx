import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, NavLink, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';

import { useAppDispatch, useAppSelector } from '@store/hooks';
import { logout } from '@store/auth/auth.slice';

import logo from '/imgs/logo.png';
import defaultAvatar from '/imgs/avatar.jpg';
import writeIcon from '/icons/write.svg';
import ConfirmModal from '../ConfirmModal';

export const Header = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  const [confirmLogout, setConfirmLogout] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLLIElement>(null);

  const handleLogout = () => {
    setConfirmLogout(false);
    dispatch(logout());
    toast.success('Logout successful!');
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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const isWritePage = location.pathname === '/blogs/create';
  const isUpdatePage = location.pathname.startsWith('/blogs/update/');

  const renderDropdown = () => (
    <div className="dropdown-menu show">
      <div className="dropdown-section">
        <NavLink
          to={`/profile/me`}
          className="dropdown-item"
          onClick={() => setShowDropdown(false)}
        >
          Profile
        </NavLink>
        <button className="dropdown-item" disabled>
          Change Password
        </button>
      </div>
      <div className="dropdown-section">
        <button
          className="dropdown-item"
          onClick={() => setConfirmLogout(true)}
        >
          Sign out
        </button>
        <div className="dropdown-email">{user?.email}</div>
      </div>
    </div>
  );

  return (
    <header className={`header ${hidden ? 'hidden' : ''}`}>
      <div
        className={
          isWritePage || isUpdatePage
            ? 'basic-header-container'
            : 'no-container'
        }
      >
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
              ) : (
                <>
                  {isWritePage || isUpdatePage ? (
                    <li className="nav-item">
                      <button
                        className="btn btn-submit"
                        onClick={() =>
                          window.dispatchEvent(new Event('submitBlog'))
                        }
                      >
                        {isWritePage ? 'Post' : 'Update'}
                      </button>
                    </li>
                  ) : (
                    <li className="nav-item">
                      <NavLink
                        to="/blogs/create"
                        className="nav-link btn btn-icon"
                      >
                        <img src={writeIcon} alt="writeIcon" />
                      </NavLink>
                    </li>
                  )}
                  <li className="nav-item" ref={dropdownRef}>
                    <button
                      className={`btn btn-avatar ${showDropdown ? 'open' : ''}`}
                      onClick={() => setShowDropdown(!showDropdown)}
                    >
                      <img
                        src={user?.picture || defaultAvatar}
                        alt="Avatar"
                        className="img"
                      />
                    </button>
                    {showDropdown && renderDropdown()}
                  </li>
                </>
              )}
            </ul>
          </div>
        </nav>
      </div>

      {confirmLogout && (
        <ConfirmModal
          isOpen={confirmLogout}
          title="Sign out"
          message="Are you sure you want to log out?"
          cancelLabel="Cancel"
          confirmLabel="Sign out"
          onCancel={() => setConfirmLogout(false)}
          onConfirm={handleLogout}
        />
      )}
    </header>
  );
};
