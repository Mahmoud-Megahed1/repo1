import React from 'react';
import { useFormContext } from 'react-hook-form';
import { formSchema } from '.';
import { z } from 'zod';
import InputFormField from '@/components/input-form-field';
import { Input } from '@/components/ui/input';
import ImageFormField from '@/components/shared/form-fields/image-form-field';

const QuestionForm = () => {
  const form = useFormContext<z.infer<typeof formSchema>>();
  const type = form.watch('type');
  return (
    <>
      {type === 'text' && (
        <InputFormField
          name="question"
          label="Question"
          control={form.control}
        />
      )}
      {type === 'audio' && (
        <Input
          type="file"
          accept="audio/mp3"
          onChange={(e) => {
            form.setValue('question', e.target.files![0]);
          }}
        />
      )}
      {type === 'image' && <ImageFormField form={form} name="question" />}
    </>
  );
};

export default QuestionForm;
