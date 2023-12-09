import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import types from '@/lib/share-types.json';
import { detectLanguage } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import LazyImage from '@/components/image';
import NotionLink from '@/components/link';
import Post from '@/components/post';
import Quote from '@/components/quote';
import YouTubeShort from '@/components/short';
import TextPost from '@/components/text';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import YouTubeVideo from '@/components/video';
import { useState } from 'react';

const PostSchema = z.object({
  type: z.string(),
  caption: z.string().optional(),
  text: z.string().optional(),
  url: z.string().optional(),
  quote: z.string().optional(),
  author: z.string().optional(),
});

console.log('here is the url: ', import.meta.env.VITE_SERVER_URL);
console.log('here is the url: ', import.meta.env);

export default function Posts() {
  const [numOfShowedPosts, setNumOfShowedPosts] = useState(10);
  const { isPending, error, data, refetch } = useQuery({
    queryKey: ['repoData'],
    queryFn: async (): Promise<Post[]> =>
      await fetch(import.meta.env.VITE_SERVER_URL).then(async (res) => await res.json()),
  });

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

  const type = form.getValues().type;
  console.log(type);

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
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  if (isPending) return 'Loading...';

  if (error !== null) return 'An error has occurred: ' + error?.message;

  return (
    <div className="w-full bg-slate-500 p-2 flex flex-col lg:flex-row gap-3 items-center lg:justify-center lg:items-start">
      <div className="max-w-[540px] w-full">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-1 bg-neutral-300 p-2 rounded-md">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a type" />
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
                  <FormDescription>Select tye type of the post you want to share</FormDescription>
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
                      dir={detectLanguage(form.getValues().caption!) === 'arabic' ? 'rtl' : 'ltr'}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>What is on your mind, khalid?</FormDescription>
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
                      <Input placeholder="url" type={`Type the URL of the ${type}`} {...field} />
                    </FormControl>
                    <FormDescription>Write the URL of the {type} you want to share</FormDescription>
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
                          placeholder="quote"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>Write the quote you want to share</FormDescription>
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
                          placeholder="author"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>Write the author of the quote</FormDescription>
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
                        placeholder="text"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Write the text you want to share.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </div>

      <div className="flex flex-col gap-2 p-2 bg-slate-300 rounded-md max-h-[calc(100vh-16px)] overflow-auto max-w-[500px]">
        {data.slice(0, numOfShowedPosts).map((p: Post) => {
          return (
            <Post key={p._id} post={p}>
              <>
                {p.type === 'video' && <YouTubeVideo url={p.url} caption={p.caption} />}
                {p.type === 'image' && <LazyImage imageUrl={p.url} altText={p.caption !== '' ? p.caption : 'image'} />}
                {p.type === 'short' && <YouTubeShort shortUrl={p.url} title="short" />}
                {p.type === 'link' && (
                  <NotionLink
                    url={p.url}
                    meta={{
                      favicon: p.favicon,
                      ogImage: p.ogImage,
                      ogDescription: p.ogDescription,
                      ogTitle: p.ogTitle,
                    }}
                  />
                )}
                {p.type === 'text' && <TextPost content={p.text} />}
                {p.type === 'quote' && <Quote quote={p.quote} author={form.getValues().author!} />}
              </>
            </Post>
          );
        })}
        {numOfShowedPosts < data.length && (
          <Button
            onClick={() => {
              const newNumOfShowedPosts = numOfShowedPosts + 10 > data.length ? data.length : numOfShowedPosts + 10;
              setNumOfShowedPosts(newNumOfShowedPosts);
            }}
          >
            More
          </Button>
        )}
      </div>
    </div>
  );
}
