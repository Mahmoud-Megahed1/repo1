'use client';
import dynamic from 'next/dynamic';
import React from 'react';
import { FieldValues, Path, UseFormReturn } from 'react-hook-form';
import 'react-quill/dist/quill.snow.css';
type Props<T extends FieldValues> = {
  form: UseFormReturn<T>;
  name: Path<T>;
  label?: string;
} & React.ComponentProps<any>;
const ReactQuill = dynamic(
  async () => {
    const mod = await import('react-quill');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (mod.default || mod) as any;
  },
  {
    ssr: false,
    loading: () => <p>Loading editor...</p>,
  },
);
const TextEditorFormField = <T extends FieldValues>({
  form,
  name,
  label,
  ...props
}: Props<T>) => {
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ align: [] }], // ✅ Enable alignment options
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link', 'image'],
      ['clean'],
    ],
  };

  const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'align', // ✅ Allow alignment format
    'list',
    'bullet',
    'link',
    'image',
  ];

  return (
    <div>
      {label && (
        <label className="mb-2 block text-sm font-medium">{label}</label>
      )}
      <ReactQuill
        theme="snow"
        value={form.watch(name)}
        onChange={(value) => form.setValue(name, value as never)}
        onBlur={() => form.trigger(name)}
        modules={modules}
        formats={formats}
        {...props}
      />
      {form.formState.errors[name] && (
        <p className="text-sm text-red-400">
          {form.formState.errors[name]?.message as string}
        </p>
      )}
    </div>
  );
};

export default TextEditorFormField;
