import React from 'react';
import { Controller, Control, FieldErrors } from 'react-hook-form';
import Ckeditor from '@shared/components/partials/Ckeditor';
import { Select } from '@shared/components/partials/Select';
import { STATUS_OPTIONS, TAG_OPTIONS } from '@shared/contexts/constant';

export type FormValues = {
  title: string;
  description: string;
  tags: string[];
  status: string;
  rawContent?: string;
};

interface BlogFormProps {
  control: Control<FormValues>;
  errors: FieldErrors<FormValues>;
  loading?: boolean;
  rawContent?: string;
  onChangeRawContent?: (val: string) => void;
}

const BlogForm: React.FC<BlogFormProps> = ({
  control,
  errors,
  loading = false,
  rawContent,
  onChangeRawContent,
}) => {
  return (
    <form className="form" onSubmit={(e) => e.preventDefault()}>
      <div className="form-group">
        <Controller
          control={control}
          name="title"
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
              disabled={loading}
            />
          )}
        />
      </div>

      <div className="row">
        <div className="col-12 col-wide-9">
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
                errorMsg={errors.tags?.message}
                isRequired
                isMulti
                maxSelect={4}
                isDisabled={loading}
              />
            )}
          />
        </div>

        <div className="col-12 col-wide-3">
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
                isDisabled={loading}
              />
            )}
          />
        </div>
      </div>

      <div className="form-group">
        {onChangeRawContent ? (
          <Ckeditor value={rawContent || ''} onChange={onChangeRawContent} />
        ) : (
          <Controller
            control={control}
            name="rawContent"
            render={({ field }) => (
              <Ckeditor value={field.value} onChange={field.onChange} />
            )}
          />
        )}
      </div>
    </form>
  );
};

export default BlogForm;
