'use client';
import InputFormField from '@/components/shared/form-fields/input-form-field';
import TextareaFormField from '@/components/shared/form-fields/textarea-form-field';
import { RiyalSymbol } from '@/components/shared/icons';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SelectSeparator } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { LEVELS_ID, LEVELS_LABELS } from '@/constants';
import { createLevel, getAllLevels, updateLevel } from '@/services/levels';
import { LevelType } from '@/types/global.types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { FC, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';

const Levels = () => {
  const { data } = useQuery({
    queryKey: ['levels'],
    queryFn: getAllLevels,
  });
  const levels = data?.data || [];
  const existingLevelNames = levels.map((l) => l.level_name);

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <CreateLevelDialog existingLevelNames={existingLevelNames} />
      </div>
      <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {levels.map((item, index) => (
          <li key={index}>
            <LevelItem {...item} />
          </li>
        ))}
      </ul>
    </div>
  );
};

const createFormSchema = z.object({
  level_name: z.string().min(1, 'Level is required'),
  titleAr: z.string().min(1, 'Title is required'),
  titleEn: z.string().min(1, 'Title is required'),
  descriptionAr: z.string().min(1, 'Description is required'),
  descriptionEn: z.string().min(1, 'Description is required'),
  price: z
    .string()
    .min(1, 'Price is required')
    .transform((val) => +val)
    .refine((val) => +val > 0, { message: 'Price must be greater than 0' }),
  isAvailable: z.boolean().optional(),
});

const CreateLevelDialog: FC<{ existingLevelNames: string[] }> = ({
  existingLevelNames,
}) => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationKey: ['create-level'],
    mutationFn: createLevel,
    onSuccess: () => {
      setOpen(false);
      form.reset();
      queryClient.invalidateQueries({
        queryKey: ['levels'],
      });
    },
  });

  const form = useForm<z.infer<typeof createFormSchema>>({
    resolver: zodResolver(createFormSchema),
    defaultValues: {
      level_name: '',
      titleAr: '',
      titleEn: '',
      descriptionAr: '',
      descriptionEn: '',
      price: '' as unknown as number,
      isAvailable: true,
    },
  });

  function onSubmit(values: z.infer<typeof createFormSchema>) {
    mutate(values as unknown as any); // To suppress strict lint, or better, fix the type in service.
  }

  const availableLevels = LEVELS_ID.filter(
    (id) => !existingLevelNames.includes(id)
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="size-4" />
          Add New Level
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90%] overflow-auto">
        <DialogTitle>Create New Level</DialogTitle>
        <Form {...form}>
          <form
            className="grid grid-cols-2 gap-4"
            onSubmit={form.handleSubmit(onSubmit)}
            noValidate
          >
            <div className="col-span-full">
              <Label>Level</Label>
              <Controller
                control={form.control}
                name="level_name"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableLevels.map((id) => (
                        <SelectItem key={id} value={id}>
                          {LEVELS_LABELS[id]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <InputFormField
              control={form.control}
              name="titleAr"
              label="Title Ar"
              placeholder="Title Ar"
              required
              lang="ar"
            />
            <InputFormField
              control={form.control}
              name="titleEn"
              label="Title En"
              placeholder="Title En"
              required
              lang="en"
            />
            <TextareaFormField
              control={form.control}
              name="descriptionAr"
              label="Description Ar"
              placeholder="Description Ar"
              className="col-span-full"
              required
              lang="ar"
            />
            <TextareaFormField
              control={form.control}
              name="descriptionEn"
              label="Description En"
              placeholder="Description En"
              className="col-span-full"
              required
              lang="en"
            />
            <InputFormField
              control={form.control}
              name="price"
              label="Price"
              placeholder="Price"
              type="number"
              className="col-span-full"
              required
              lang="en"
            />
            <Button className="col-span-full" disabled={isPending}>
              {isPending ? 'Creating...' : 'Create Level'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

const formSchema = z.object({
  titleAr: z.string().min(1, 'Title is required'),
  titleEn: z.string().min(1, 'Title is required'),
  descriptionAr: z.string().min(1, 'Description is required'),
  descriptionEn: z.string().min(1, 'Description is required'),
  price: z
    .string()
    .min(1, 'Price is required')
    .transform((val) => +val)
    .refine((val) => +val > 0, { message: 'Price must be greater than 0' }),
  isAvailable: z.boolean().optional(),
});

const LevelItem: FC<LevelType> = ({
  descriptionAr,
  descriptionEn,
  level_name,
  price,
  titleAr,
  titleEn,
  isAvailable,
}) => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationKey: ['update-level'],
    mutationFn: updateLevel,
    onSuccess: () => {
      setOpen(false);
      queryClient.invalidateQueries({
        queryKey: ['levels'],
      });
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      titleAr,
      titleEn,
      descriptionAr,
      descriptionEn,
      price: `${price}` as unknown as number,
      isAvailable,
    },
  });
  function onSubmit(values: z.infer<typeof formSchema>) {
    mutate({ ...values, level_name });
  }
  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <Badge className="ms-auto w-fit">{LEVELS_LABELS[level_name]}</Badge>
        <div lang="en" className="space-y-1">
          <CardTitle>{titleEn}</CardTitle>
          <CardDescription>{descriptionEn}</CardDescription>
        </div>
        <SelectSeparator />
        <div lang="ar" className="space-y-1">
          <CardTitle>{titleAr}</CardTitle>
          <CardDescription>{descriptionAr}</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <span>Price: </span>
        <span lang="en" className="inline-flex items-center gap-1">
          <RiyalSymbol className="size-4" />
          <b>{price}</b>
        </span>
      </CardContent>
      <CardFooter className="mt-auto flex w-full items-center justify-between">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Update</Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90%] overflow-auto">
            <DialogTitle>
              Update Level{' '}
              <Badge className="w-fit py-1">{LEVELS_LABELS[level_name]}</Badge>
            </DialogTitle>
            <Form {...form}>
              <form
                className="grid grid-cols-2 gap-4"
                onSubmit={form.handleSubmit(onSubmit)}
                noValidate
              >
                <InputFormField
                  control={form.control}
                  name="titleAr"
                  label="Title Ar"
                  placeholder="Title Ar"
                  required
                  lang="ar"
                />
                <InputFormField
                  control={form.control}
                  name="titleEn"
                  label="Title En"
                  placeholder="Title En"
                  required
                  lang="en"
                />

                <TextareaFormField
                  control={form.control}
                  name="descriptionAr"
                  label="Description Ar"
                  placeholder="Description Ar"
                  className="col-span-full"
                  required
                  lang="ar"
                />
                <TextareaFormField
                  control={form.control}
                  name="descriptionEn"
                  label="Description En"
                  placeholder="Description En"
                  className="col-span-full"
                  required
                  lang="en"
                />
                <InputFormField
                  control={form.control}
                  name="price"
                  label="Price"
                  placeholder="Price"
                  type="number"
                  className="col-span-full"
                  required
                  lang="en"
                />
                <Button className="col-span-full" disabled={isPending}>
                  {isPending ? 'Saving...' : 'Save'}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
        <div className="flex items-center gap-2">
          <Label
            htmlFor={`${level_name}-available`}
            className="text-muted-foreground"
          >
            Availability
          </Label>
          <Switch
            id={`${level_name}-available`}
            defaultChecked={isAvailable}
            onCheckedChange={(checked) => {
              mutate({ isAvailable: checked, level_name });
            }}
          />
        </div>
      </CardFooter>
    </Card>
  );
};

export default Levels;
