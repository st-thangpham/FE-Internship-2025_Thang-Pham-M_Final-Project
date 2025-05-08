import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '@app/shared/contexts/auth.context';
import { getPublicPosts, getAllPosts } from '@shared/services/blog.service';
import { Post } from '@shared/models/post';
import BlogListItem from './BlogListItem';

const BlogList = () => {
  const { isAuthenticated } = useContext(AuthContext)!;
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let res;
        if (isAuthenticated) {
          res = await getAllPosts();
        } else {
          res = await getPublicPosts(5);
        }
        setPosts(res.data);
      } catch (err) {
        console.error('Error fetching posts:', err);
      }
    };

    fetchData();
  }, [isAuthenticated]);

  return (
    <div className="blog-list">
      {posts.map((post) => (
        <BlogListItem key={post.id} post={post} />
      ))}
    </div>
  );
};

export default BlogList;
