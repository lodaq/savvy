import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import types from '@/lib/share-types.json';
import { detectLanguage } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import * as z from 'zod';
import { type QueryObserverResult } from '@tanstack/react-query';

interface AddPostProps {
  refetch: () => Promise<QueryObserverResult<Post[], Error>>;
}

const PostSchema = z.object({
  type: z.string(),
  caption: z.string(),
  url: z.string().optional(),
  text: z.string().optional(),
  quote: z.string().optional(),
  author: z.string().optional(),
});

export default function AddPost({ refetch }: AddPostProps) {
  const form = useForm<z.infer<typeof PostSchema>>({
    resolver: zodResolver(PostSchema),
    defaultValues: {
      type: 'text',
      caption: '',
      url: '',
      text: '',
      quote: '',
      author: 'K.Mesbah',
    },
  });

  const type = form.watch().type;

  async function onSubmit(data: z.infer<typeof PostSchema>) {
    const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/${type}`, {
      method: 'Post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form.getValues()),
    });
    const response = await res.json();
    await refetch();
    if (response.error === true) {
      toast({
        title: 'An error occurred when trying to submit the following values:',
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4 overflow-auto">
            <code className="text-white">{JSON.stringify(response.result.error, null, 2)}</code>
          </pre>
        ),
      });
      return;
    }
    toast({
      title: 'You submitted the following values:',
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4 overflow-auto">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  return (
    <div className="max-w-[564px] w-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 bg-neutral-300 p-2 rounded-md">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a type." />
                    </SelectTrigger>
                    <SelectContent>
                      {types.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="caption"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Caption</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="What's on your mind, khalid?"
                    className="resize-none"
                    dir={detectLanguage(form.getValues().caption) === 'arabic' ? 'rtl' : 'ltr'}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {['image', 'video', 'link', 'short'].includes(type) && (
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL</FormLabel>
                  <FormControl>
                    <Input placeholder={`Type the URL of the ${type}.`} required {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          {type === 'quote' && (
            <>
              <FormField
                control={form.control}
                name="quote"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quote</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        required
                        dir={detectLanguage(form.getValues().quote!) === 'arabic' ? 'rtl' : 'ltr'}
                        placeholder="Type the quote."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="author"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Author</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        required
                        dir={detectLanguage(form.getValues().author!) === 'arabic' ? 'rtl' : 'ltr'}
                        placeholder="Type the author of the quote."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}
          {type === 'text' && (
            <FormField
              control={form.control}
              name="text"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Text</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      required
                      dir={detectLanguage(form.getValues().text!) === 'arabic' ? 'rtl' : 'ltr'}
                      placeholder="Type the text."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
}
