import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import BlogList from '@app/pages/blogs/containers/BlogList';
import ProfileInfo from './ProfileInfo';

import { usePosts } from '@shared/hooks/userPosts';

const Profile = () => {
  const { id } = useParams<{ id: string }>();
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
  }, [id, fetchUserPosts, clearUserPosts]);

  if (errorUser) {
    return <div>Error loading user: {errorUser}</div>;
  }

  return (
    <div className="page page-profile">
      <div className="container">
        <div className="page-inner">
          <div className="content-layout">
            <div className="main-content">
              <div className="profile-header">
                <h1 className="display-name">{userWithPosts?.displayName}</h1>
              </div>

              <div className="profile-tabs">
                <button className="tab active">Blogs</button>
              </div>

              <section className="section section-blog">
                {loadingUser ? (
                  <div className="loading">Loading blogs...</div>
                ) : (
                  <BlogList posts={userWithPosts?.Posts || []} hideAuthor />
                )}
              </section>
            </div>

            <aside className="sidebar">
              {userWithPosts && <ProfileInfo user={userWithPosts} />}
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
