import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useQuery } from '@tanstack/react-query';
import LazyImage from '@/components/image';
import NotionLink from '@/components/link';
import Post from '@/components/post';
import Quote from '@/components/quote';
import YouTubeShort from '@/components/short';
import TextPost from '@/components/text';
import YouTubeVideo from '@/components/video';
import { useState } from 'react';
import AddPost from '@/components/add-post';

console.log('here is the url: ', import.meta.env.VITE_SERVER_URL);

export default function Posts() {
  const [numOfShowedPosts, setNumOfShowedPosts] = useState(10);
  const { isPending, error, data, refetch } = useQuery({
    queryKey: ['repoData'],
    queryFn: async (): Promise<Post[]> =>
      await fetch(import.meta.env.VITE_SERVER_URL).then(async (res) => await res.json()),
  });

  if (isPending) return 'Loading...';

  if (error !== null) return 'An error has occurred: ' + error?.message;

  return (
    <div className="w-full bg-slate-500 p-2 flex flex-col lg:flex-row gap-3 items-center lg:justify-center lg:items-start">
      <AddPost refetch={refetch} />
      <ScrollArea className="flex flex-col border p-3 bg-slate-600 rounded-md max-h-[calc(100vh-16px)] max-w-[564px]">
        <div className="flex flex-col gap-2">
          {data.slice(0, numOfShowedPosts).map((p: Post) => {
            return (
              <Post key={p._id} post={p}>
                <>
                  {p.type === 'video' && <YouTubeVideo url={p.url} caption={p.caption} />}
                  {p.type === 'image' && (
                    <LazyImage imageUrl={p.url} altText={p.caption !== '' ? p.caption : 'image'} />
                  )}
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
                  {p.type === 'quote' && (
                    <Quote quote={p.quote} author={p.author === '' || p.author === undefined ? 'Unknown' : p.author} />
                  )}
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
      </ScrollArea>
    </div>
  );
}
