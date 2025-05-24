import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import BlogForm, { FormValues } from '../components/BlogForm';
import ConfirmModal from '@shared/components/partials/ConfirmModal';
import { usePosts } from '@shared/hooks/usePosts';
import { TAG_OPTIONS } from '@shared/contexts/constant';
import { parseEditorContent } from '@app/core/helpers/parse-content-helper';

const BlogUpdate = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);
  const [rawContent, setRawContent] = useState('');

  const { post, fetchDetail, loadingDetail, resetDetail, submitUpdatePost } =
    usePosts();

  const {
    control,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      title: '',
      description: '',
      status: 'public',
      tags: [],
      rawContent: '',
    },
  });

  useEffect(() => {
    if (id) fetchDetail(id);
    return () => resetDetail();
  }, [id, fetchDetail, resetDetail]);

  useEffect(() => {
    if (!post || !post.title) return;
    setValue('title', post.title);
    setValue('description', post.description);
    setValue('status', post.status);
    setValue('tags', post.tags);
    setRawContent(
      post.cover ? `<img src="${post.cover}" />${post.content}` : post.content
    );
  }, [post, setValue]);

  const handleUpdate = async () => {
    const { title, description, tags, status } = getValues();
    const { cover, content } = parseEditorContent(rawContent);

    if (!title || title.length < 20)
      return toast.error('Title must be at least 20 characters.');
    if (!description || description.length < 50)
      return toast.error('Description must be at least 50 characters.');
    if (!content || content.length < 100)
      return toast.error('Content must be at least 100 characters.');
    if (!cover) return toast.error('Please upload your cover.');

    const payload = {
      title,
      description,
      content,
      tags: tags,
      status: status as 'public' | 'private',
      cover,
    };

    const success = await submitUpdatePost(id!, payload);
    if (success) navigate(`/blogs/${id}`);
  };

  useEffect(() => {
    const handleEvent = () => setShowConfirm(true);
    window.addEventListener('submitBlog', handleEvent);
    return () => window.removeEventListener('submitBlog', handleEvent);
  }, []);

  return (
    <div className="page-write">
      <div className="container">
        <div className="page-content">
          <BlogForm
            control={control}
            errors={errors}
            loading={loadingDetail}
            rawContent={rawContent}
            onChangeRawContent={setRawContent}
          />
        </div>
      </div>

      <ConfirmModal
        isOpen={showConfirm}
        title="Update Post"
        message="Are you sure you want to update this post?"
        cancelLabel="Cancel"
        confirmLabel="Update"
        onCancel={() => setShowConfirm(false)}
        onConfirm={() => {
          setShowConfirm(false);
          handleUpdate();
        }}
      />
    </div>
  );
};

export default BlogUpdate;
