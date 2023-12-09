import formatDate from '@/lib/formatDate';
import { detectLanguage } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { type ReactNode } from 'react';
import { MdDateRange, MdSettings } from 'react-icons/md';
import { SlLike, SlShare } from 'react-icons/sl';
import { FacebookIcon, FacebookShareButton, TwitterIcon, TwitterShareButton } from 'react-share';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { DropdownMenuContent } from '@radix-ui/react-dropdown-menu';
import { Separator } from '@radix-ui/react-select';

export default function SharePost({ children, post }: { children: ReactNode; post: Post }) {
  const shareUrl = 'tmp';
  const title = 'tmp';
  const { refetch } = useQuery({ queryKey: ['repoData'] });

  const onLike = async () => {
    await fetch(`${import.meta.env.VITE_SERVER_URL}/like/${post._id}`, {
      method: 'Put',
    });
    await refetch();
  };
  const onDelete = async () => {
    await fetch(`${import.meta.env.VITE_SERVER_URL}/${post._id}`, {
      method: 'Delete',
    });
    await refetch();
  };

  return (
    <div className="rounded-md p-2 bg-slate-200 flex flex-col gap-2" id={post.caption}>
      <div className="flex justify-between items-center p-2 rounded-md">
        <div className="flex gap-2">
          <Avatar>
            <AvatarImage src="/personal.png" />
            <AvatarFallback>KM</AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-1 items-start justify-center">
            <h4 className="text-sm font-semibold leading-none text-default-600">Khalid Mesbah</h4>
            <h5 className="text-xs tracking-tight text-default-400">@khalidmesbah</h5>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger className="aspect-square w-8 p-1 border border-1 border-black rounded-md flex justify-center items-center">
            <MdSettings />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-background rounded-md z-10 overflow-hidden">
            <DropdownMenuItem key="edit">Edit post</DropdownMenuItem>
            <DropdownMenuItem key="delete" className="text-destructive" onClick={onDelete}>
              Delete post
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="text-sm">
        {post.caption !== '' ? (
          <>
            <p className={`${detectLanguage(post.caption) === 'arabic' && 'text-right'}`}>{post.caption}</p>
            <Separator className="my-1 bg-gray-400 h-[1px]" />
          </>
        ) : (
          ''
        )}
        {children}
      </div>

      <div className="flex items-center gap-3 bg-slate-300 p-2 rounded-md">
        <div className="flex gap-1 justify-center items-center">
          <Button aria-label="Like" size="sm" onClick={onLike}>
            <SlLike />
          </Button>
          <p className="font-semibold text-default-400 text-sm">{post.likes}</p>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger className="aspect-square w-8 p-1 border border-1 border-black rounded-md flex justify-center items-center">
            <SlShare />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-background rounded-sm z-10">
            <DropdownMenuItem key="edit">
              <FacebookShareButton url={shareUrl} title={title} className="cursor-pointer flex gap-2">
                <FacebookIcon size={24} round />
                Facebook
              </FacebookShareButton>
            </DropdownMenuItem>
            <DropdownMenuItem key="delete">
              <TwitterShareButton url={shareUrl} title={title} className="cursor-pointer flex gap-2">
                <TwitterIcon size={24} round />
                Twitter
              </TwitterShareButton>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="flex items-center gap-1 ml-auto">
          <MdDateRange className="text-2xl w-[32px] h-[32px] aspect-square rounded-md p-1 border border-1 border-black" />
          <p className="font-semibold text-foreground/80 text-xs">{formatDate(new Date(post.date))}</p>
        </div>
      </div>
    </div>
  );
}
