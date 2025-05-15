import React, { useEffect, useState, useCallback } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import Ckeditor from '@app/shared/components/Ckeditor';
import { Select } from '@shared/components/partials/Select';
import { STATUS_OPTIONS, TAG_OPTIONS } from '@shared/contexts/constant';
import { PostService } from '@shared/services/blog.service';

type FormValues = {
  title: string;
  description: string;
  tags: { label: string; value: string }[];
  status: string;
  cover: string | null;
};

const BlogUpdate = () => {
  const [rawContent, setRawContent] = useState('');
  const [loading, setLoading] = useState(true);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const postService = React.useMemo(() => new PostService(), []);

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
      cover: null,
    },
  });

  useEffect(() => {
    if (!id) return;
    setLoading(true);

    (async () => {
      try {
        const post = await postService.getPostById(id);

        const mappedTags = (post.tags || [])
          .map((tag: string) => TAG_OPTIONS.find((opt) => opt.value === tag))
          .filter(Boolean) as { label: string; value: string }[];

        setValue('title', post.title);
        setValue('description', post.description || '');
        setValue('status', post.status);
        setValue('tags', mappedTags);
        setValue('cover', post.cover);

        setRawContent(post.content || '');
      } catch (error) {
        toast.error('Failed to load post data.');
        navigate('/');
      } finally {
        setLoading(false);
      }
    })();
  }, [id, navigate, postService, setValue]);

  useEffect(() => {
    const handleSubmit = async () => {
      try {
        const { title, status } = getValues();

        if (!title || title.length < 20) {
          toast.error('Title must be at least 20 characters');
          return;
        }

        if (!rawContent || rawContent.trim() === '') {
          toast.error('Content is required');
          return;
        }

        await postService.updatePostById(id!, {
          title,
          content: rawContent,
          status,
        });

        toast.success('Post updated successfully!');
        navigate(`/blogs/${id}`);
      } catch (error) {
        console.error(error);
        toast.error('Failed to update post.');
      }
    };

    const handleEvent = () => handleSubmit();
    window.addEventListener('submitBlog', handleEvent);
    return () => window.removeEventListener('submitBlog', handleEvent);
  }, [getValues, rawContent, postService, id, navigate]);

  return (
    <div className="page-write">
      <div className="container">
        <div className="page-content">
          <form className="form" onSubmit={(e) => e.preventDefault()}>
            <div className="form-group">
              <Controller
                control={control}
                name="title"
                rules={{
                  required: 'Title is required',
                  minLength: {
                    value: 20,
                    message: 'Title must be at least 20 characters',
                  },
                }}
                render={({ field }) => (
                  <textarea
                    {...field}
                    className="form-control form-title"
                    placeholder="Title"
                    rows={2}
                    disabled={loading}
                  />
                )}
              />
              {errors.title && (
                <p className="text-danger">{errors.title.message}</p>
              )}
            </div>

            <div className="form-group">
              <Controller
                control={control}
                name="description"
                render={({ field }) => (
                  <textarea
                    {...field}
                    className="form-control form-description"
                    placeholder="Description..."
                    rows={2}
                    disabled
                  />
                )}
              />
            </div>

            <div className="form-group">
              {getValues('cover') ? (
                <img
                  src={getValues('cover') as string}
                  alt="Cover"
                  className="form-image"
                />
              ) : (
                <p>No cover image</p>
              )}
            </div>

            <div className="row">
              <div className="col-9">
                <Controller
                  control={control}
                  name="tags"
                  render={({ field }) => (
                    <Select
                      name="tags"
                      label="Tags"
                      options={TAG_OPTIONS}
                      value={field.value?.map((tag) => tag.value)}
                      onChange={field.onChange}
                      isMulti
                      maxSelect={3}
                      isDisabled
                    />
                  )}
                />
              </div>

              <div className="col-3">
                <Controller
                  control={control}
                  name="status"
                  render={({ field }) => (
                    <Select
                      name="status"
                      label="Status"
                      options={STATUS_OPTIONS}
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
              </div>
            </div>

            <div className="form-group">
              <Ckeditor
                onChange={(data) => setRawContent(data)}
                value={rawContent}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BlogUpdate;
