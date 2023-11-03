import { useQuery } from '@tanstack/react-query';
import Post from '../post';

export interface PostType {
  id: number;
  text: string;
  date: string;
  likes: number;
}

const url = import.meta.env.VITE_URL;
console.log(url);

export default function PostsPage() {
  const { isPending, error, data } = useQuery({
    queryKey: ['repoData'],
    queryFn: async () => await fetch(url).then(async (res) => await res.json()),
  });

  if (isPending) return 'Loading...';

  if (error !== null) return 'An error has occurred: ' + error?.message;

  return (
    <div className="bg-red-500 w-full gap-2 p-2 grid grid-cols-[repeat(auto-fit,_minmax(250px,_1fr))] auto-rows-[200px]">
      {data.map((e: PostType) => (
        <Post key={e.id} likes={e.likes} text={e.text} date={e.date} />
      ))}
    </div>
  );
}
