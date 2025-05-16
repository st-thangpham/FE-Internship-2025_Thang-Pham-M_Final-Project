import React, { useCallback, useEffect, useState } from 'react';

import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import Ckeditor from '@app/shared/components/Ckeditor';
import { Select } from '@shared/components/partials/Select';
import { STATUS_OPTIONS, TAG_OPTIONS } from '@shared/contexts/constant';
import { PostService } from '@shared/services/blog.service';

type FormValues = {
  title: string;
  description: string;
  tags: string[];
  status: string;
};

const BlogCreate = () => {
  const [rawContent, setRawContent] = useState('');
  const navigate = useNavigate();
  const postService = new PostService();

  const {
    control,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      title: '',
      description: '',
      status: 'public',
      tags: [],
    },
  });

  const parseEditorContent = (html: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    const cover = doc.querySelector('img')?.getAttribute('src') || '';

    doc.querySelector('img')?.remove();

    const content = doc.body.innerHTML.trim();
    return { cover, content };
  };

  const submitBlog = useCallback(async () => {
    const { tags, status, title, description } = getValues();
    const { cover, content } = parseEditorContent(rawContent);

    if (!title || title.length < 20) {
      return toast.error('Title must be at least 20 characters.');
    }

    if (!description || description.length < 50) {
      return toast.error('Description must be at least 50 characters.');
    }

    if (!content || content.length < 20) {
      return toast.error('Content must be at least 100 characters.');
    }

    if (!tags || tags.length === 0) {
      return toast.error('Please select at least one tag.');
    }

    const payload = {
      title,
      description,
      content,
      cover,
      tags,
      status: status as 'public' | 'private',
    };

    try {
      await postService.createPost(payload);
      toast.success('Post created successfully!');
      navigate('/');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to create post.');
    }
  }, [rawContent, getValues]);

  useEffect(() => {
    const handlePublish = () => {
      submitBlog();
    };

    window.addEventListener('submitBlog', handlePublish);
    return () => window.removeEventListener('submitBlog', handlePublish);
  }, [submitBlog]);

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
                rules={{
                  required: 'Description is required',
                  minLength: {
                    value: 50,
                    message: 'Description must be at least 50 characters',
                  },
                }}
                render={({ field }) => (
                  <textarea
                    {...field}
                    className="form-control form-description"
                    placeholder="Description..."
                    rows={2}
                  />
                )}
              />
              {errors.description && (
                <p className="text-danger">{errors.description.message}</p>
              )}
            </div>

            <div className="row">
              <div className="col-12 col-wide-9">
                <Controller
                  control={control}
                  name="tags"
                  rules={{ required: 'Tags are required' }}
                  render={({ field }) => (
                    <Select
                      name="tags"
                      label="Tags"
                      options={TAG_OPTIONS}
                      value={field.value}
                      onChange={field.onChange}
                      errorMsg={errors.tags?.message}
                      isRequired
                      isMulti
                      maxSelect={4}
                    />
                  )}
                />
              </div>
              <div className="col-12 col-wide-3">
                <Controller
                  control={control}
                  name="status"
                  rules={{ required: 'Status is required' }}
                  render={({ field }) => (
                    <Select
                      name="status"
                      label="Status"
                      options={STATUS_OPTIONS}
                      value={field.value}
                      onChange={field.onChange}
                      errorMsg={errors.status?.message}
                    />
                  )}
                />
              </div>
            </div>
            <div className="form-group">
              <Ckeditor onChange={(data) => setRawContent(data)} />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BlogCreate;
