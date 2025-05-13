import React, { useCallback, useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import Ckeditor from '@app/shared/components/Ckeditor';
import { Select } from '@shared/components/partials/Select';
import { TAG_OPTIONS } from '@shared/contexts/constant';

const STATUS_OPTIONS = [
  { label: 'Public', value: 'public' },
  { label: 'Private', value: 'private' },
];

type FormValues = {
  status: string;
  tags: string[];
};

const WriteBlog = () => {
  const [rawContent, setRawContent] = useState('');
  const { control, getValues } = useForm<FormValues>({
    defaultValues: {
      status: 'public',
      tags: [],
    },
  });

  const parseEditorContent = (html: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    const title =
      (doc.querySelector('h2.document-title') as HTMLElement)?.innerText || '';
    const subtitle =
      (doc.querySelector('h3.document-subtitle') as HTMLElement)?.innerText ||
      '';
    const cover = doc.querySelector('img')?.getAttribute('src') || '';

    doc.querySelector('h2.document-title')?.remove();
    doc.querySelector('h3.document-subtitle')?.remove();
    doc.querySelector('img')?.remove();

    const remainingContent = doc.body.innerHTML.trim();
    return { title, subtitle, cover, content: remainingContent };
  };

  const handleSubmit = useCallback(() => {
    const { title, subtitle, cover, content } = parseEditorContent(rawContent);
    const { tags, status } = getValues();

    console.log('Title:', title);
    console.log('Subtitle:', subtitle);
    console.log('Cover:', cover);
    console.log('Content:', content);
    console.log('Tags:', tags);
    console.log('Status:', status);
  }, [rawContent, getValues]);

  useEffect(() => {
    const handlePublish = () => handleSubmit();
    window.addEventListener('submitBlog', handlePublish);
    return () => window.removeEventListener('submitBlog', handlePublish);
  }, [handleSubmit]);

  return (
    <div className="page-write">
      <div className="page-content">
        <form className="form">
          <div className="form-group">
            <Ckeditor onChange={(data) => setRawContent(data)} />
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
                    value={field.value}
                    onChange={field.onChange}
                    isRequired
                    isMulti
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
                    onBlur={field.onBlur}
                    isRequired
                  />
                )}
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WriteBlog;
