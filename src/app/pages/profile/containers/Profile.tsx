import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { PostService } from '@shared/services/blog.service';
import BlogList from '@app/pages/blogs/containers/BlogList';
import ProfileInfo from './ProfileInfo';

import { Post } from '@shared/models/post';
import { UserWithPosts } from '@app/shared/models/user';

const Profile = () => {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<UserWithPosts | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);

  const postService = new PostService();

  useEffect(() => {
    const fetchUserData = async (userId: string) => {
      try {
        setLoading(true);
        const res = await postService.getUserWithPosts(userId);
        setUser(new UserWithPosts(res));
        setPosts(res.Posts || []);
      } catch (error) {
        console.error('Failed to fetch user with posts:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchUserData(id);
  }, [id]);

  return (
    <div className="page page-profile">
      <div className="container">
        <div className="page-inner">
          <div className="content-layout">
            <div className="main-content">
              <div className="profile-header">
                <h1 className="display-name">{user?.displayName}</h1>
              </div>

              <div className="profile-tabs">
                <button className="tab active">Blogs</button>
              </div>

              <section className="section section-blog">
                {loading ? (
                  <div className="loading">Loading blogs...</div>
                ) : (
                  <BlogList posts={posts} hideAuthor />
                )}
              </section>
            </div>

            <aside className="sidebar">
              {user && <ProfileInfo user={user} />}
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
