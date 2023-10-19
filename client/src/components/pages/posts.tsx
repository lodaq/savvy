import { useQuery } from "@tanstack/react-query";
import Post from "../post";

export type PostType = {
  id: number;
  text: string;
  likes: number;
};

export default function PostsPage() {
  const { isPending, error, data } = useQuery({
    queryKey: ["repoData"],
    queryFn: () =>
      fetch("http://localhost:3000/posts").then((res) => res.json()),
  });

  if (isPending) return "Loading...";

  if (error) return "An error has occurred: " + error.message;

  return (
    <div className="bg-red-500 w-full gap-2 p-2 grid grid-cols-[repeat(auto-fit,_minmax(250px,_1fr))] auto-rows-[200px]">
      {data.map((e: PostType) => (
        <Post key={e.id} likes={e.likes} text={e.text} />
      ))}
    </div>
  );
}
