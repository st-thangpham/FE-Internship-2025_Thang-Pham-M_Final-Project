import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import BlogList from '@app/pages/blogs/containers/BlogList';
import ProfileInfo from '../components/ProfileInfo';

import { usePosts } from '@shared/hooks/userPosts';
import { AuthContext } from '@app/shared/contexts/auth.context';
import UpdateProfileModal from '../components/UpdateProfileModal';

const Profile = () => {
  const { id } = useParams<{ id: string }>();
  const { user, userId } = useContext(AuthContext)!;
  const [showEditModal, setShowEditModal] = useState(false);

  const {
    userWithPosts,
    loadingUser,
    errorUser,
    fetchUserPosts,
    clearUserPosts,
  } = usePosts();

  useEffect(() => {
    if (id) {
      fetchUserPosts(id);
    }
    return () => {
      clearUserPosts();
    };
  }, [id, fetchUserPosts, clearUserPosts, user]);

  if (errorUser) {
    return (
      <div className="page page-blog-detail not-found">
        <h2>Profile Page Not Found</h2>
        <p>The Profile you're looking for doesn't exist or has been removed.</p>
      </div>
    );
  }

  const isMyProfile = userId === userWithPosts?.id;

  return (
    <div className="page page-profile">
      <div className="container">
        <div className="page-inner">
          <div className="content-layout">
            <div className="main-content">
              <div className="profile-header">
                <div className="profile-info">
                  <img
                    className="profile-image"
                    src={userWithPosts?.avatar}
                    alt={userWithPosts?.displayName}
                  />
                  <h1 className="display-name">{userWithPosts?.displayName}</h1>
                </div>
                {isMyProfile && (
                  <>
                    <a
                      className="edit-profile"
                      onClick={() => setShowEditModal(true)}
                    >
                      Edit
                    </a>
                    <UpdateProfileModal
                      isOpen={showEditModal}
                      onClose={() => setShowEditModal(false)}
                      user={user}
                    />
                  </>
                )}
              </div>

              <div className="profile-tabs">
                <button className="tab active">Blogs</button>
              </div>

              <section className="section section-blog">
                {loadingUser ? (
                  <div className="loading">Loading blogs...</div>
                ) : (
                  <BlogList posts={userWithPosts?.posts || []} isProfilePage />
                )}
              </section>
            </div>

            <aside className="sidebar">
              {userWithPosts && (
                <ProfileInfo
                  userProfile={userWithPosts}
                  isMyProfile={isMyProfile}
                  onEdit={() => setShowEditModal(true)}
                />
              )}
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
