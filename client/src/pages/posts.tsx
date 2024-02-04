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
import { useAuth } from '@clerk/clerk-react';

console.log('here is the url: ', import.meta.env.VITE_SERVER_URL);

export default function Posts() {
  const { getToken } = useAuth();
  const [numOfShowedPosts, setNumOfShowedPosts] = useState(10);

  const { isPending, error, data, refetch } = useQuery({
    queryKey: ['posts'],
    queryFn: async (): Promise<Post[]> =>
      await fetch(`${import.meta.env.VITE_SERVER_URL}`, {
        headers: { Authorization: `Bearer ${await getToken({ template: 'testing-template' })}` },
      }).then(async (res) => await res.json()),
  });

  console.log(`data: `, data);

  if (isPending) return 'Loading...';

  if (error !== null) return 'An error has occurred: ' + error?.message;

  return (
    <div className="w-full bg-secondary p-2 flex flex-col gap-3 items-center">
      <AddPost refetch={refetch} />
      <ScrollArea className="border p-2 bg-primary/80 rounded-md max-h-[calc(100vh-68px)] max-w-[564px] w-full">
        {data.length !== 0 ? (
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
                      <Quote
                        quote={p.quote}
                        author={p.author === '' || p.author === undefined ? 'Unknown' : p.author}
                      />
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
        ) : (
          ''
        )}
      </ScrollArea>
    </div>
  );
}
