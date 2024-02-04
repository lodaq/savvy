import formatDate from '@/lib/formatDate';
import { detectLanguage } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { type ReactNode } from 'react';
import { MdDateRange, MdEdit, MdDelete } from 'react-icons/md';
import { SlLike, SlShare } from 'react-icons/sl';
import { FacebookIcon, FacebookShareButton, TwitterIcon, TwitterShareButton } from 'react-share';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { DropdownMenuContent } from '@radix-ui/react-dropdown-menu';
import { Separator } from '@radix-ui/react-select';
import { useAuth } from '@clerk/clerk-react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useImmer } from 'use-immer';
import { Textarea } from './ui/textarea';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export default function SharePost({ children, post }: { children: ReactNode; post: Post }) {
  const shareUrl = 'tmp';
  const title = 'tmp';
  const { getToken } = useAuth();
  const { refetch } = useQuery({ queryKey: ['posts'] });
  const [updatedPost, setUpdatedPost] = useImmer<{
    _id?: string;
    caption: string;
    text?: string;
    quote?: string;
    author?: string;
    url?: string;
  }>(post);

  const onLike = async () => {
    try {
      await fetch(`${import.meta.env.VITE_SERVER_URL}/like/${post._id}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${await getToken({ template: 'testing-template' })}` },
      });
      await refetch();
    } catch (error) {
      console.log(error);
    }
  };

  const onDelete = async () => {
    try {
      await fetch(`${import.meta.env.VITE_SERVER_URL}/delete/${post._id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${await getToken({ template: 'testing-template' })}` },
      });
      await refetch();
    } catch (error) {
      console.log(error);
    }
  };

  const onUpdate = async () => {
    try {
      await fetch(`${import.meta.env.VITE_SERVER_URL}/${post.type}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${await getToken({ template: 'testing-template' })}`,
        },
        body: JSON.stringify(updatedPost),
      });
      await refetch();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      className="rounded-md p-2 bg-slate-200 flex flex-col gap-2 overflow-hidden max-w-[540px] min-w-[200px] w-full"
      id={post.caption}
    >
      <div className="flex items-center p-2 rounded-md">
        <div className="flex gap-2 mr-auto">
          <Avatar>
            <AvatarImage src="/personal.png" />
            <AvatarFallback>KM</AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-1 items-start justify-center">
            <h4 className="text-sm font-semibold leading-none text-default-600">Khalid Mesbah</h4>
            <h5 className="text-xs tracking-tight text-default-400">@khalidmesbah</h5>
          </div>
        </div>

        <Dialog>
          <DialogTrigger>
            <Button variant={'outline'} size={'icon'}>
              <MdEdit />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit post</DialogTitle>
              <DialogDescription>Make changes to your post here. Click save when you&apos;re done.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="caption" className="text-right">
                  Caption
                </Label>
                <Textarea
                  id="caption"
                  dir={updatedPost.caption === 'arabic' ? 'rtl' : 'ltr'}
                  placeholder="What's on your mind, khalid?"
                  value={updatedPost.caption}
                  className="col-span-3 resize-none"
                  onChange={(e) => {
                    setUpdatedPost((updatedPost) => {
                      updatedPost.caption = e.currentTarget.value;
                    });
                  }}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                {post.type === 'text' ? (
                  <>
                    <Label htmlFor="text" className="text-right">
                      Text
                    </Label>
                    <Input
                      type="text"
                      id="text"
                      required
                      dir={updatedPost.text === 'arabic' ? 'rtl' : 'ltr'}
                      placeholder="Type the text."
                      value={updatedPost.text}
                      className="col-span-3"
                      onChange={(e) => {
                        setUpdatedPost((updatedPost) => {
                          updatedPost.text = e.currentTarget.value;
                        });
                      }}
                    />
                  </>
                ) : post.type === 'quote' ? (
                  <>
                    <Label htmlFor="quote" className="text-right">
                      Quote
                    </Label>
                    <Input
                      type="text"
                      id="quote"
                      required
                      dir={updatedPost.quote === 'arabic' ? 'rtl' : 'ltr'}
                      placeholder="Type the quote."
                      value={updatedPost.quote}
                      className="col-span-3"
                      onChange={(e) => {
                        setUpdatedPost((updatedPost) => {
                          updatedPost.quote = e.currentTarget.value;
                        });
                      }}
                    />
                    <Label htmlFor="author" className="text-right">
                      Author
                    </Label>
                    <Input
                      type="text"
                      id="author"
                      required
                      dir={updatedPost.author === 'arabic' ? 'rtl' : 'ltr'}
                      placeholder="Type the author of the quote."
                      value={updatedPost.author}
                      className="col-span-3"
                      onChange={(e) => {
                        setUpdatedPost((updatedPost) => {
                          updatedPost.author = e.currentTarget.value;
                        });
                      }}
                    />
                  </>
                ) : (
                  <>
                    <Label htmlFor="url" className="text-right">
                      URL
                    </Label>
                    <Input
                      type="url"
                      id="url"
                      required
                      placeholder={`Type the URL of the ${post.type}.`}
                      value={updatedPost.url}
                      className="col-span-3"
                      onChange={(e) => {
                        setUpdatedPost((updatedPost) => {
                          updatedPost.url = e.currentTarget.value;
                        });
                      }}
                    />
                  </>
                )}
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" onClick={onUpdate}>
                  Save changes
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant={'destructive'} size={'sm'} className="ml-1">
              <MdDelete />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your post.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={onDelete}>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
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
          <DropdownMenuTrigger className="w-[36px] h-[32px] p-2 border-1 border-black rounded-md flex justify-center items-center">
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
          <MdDateRange className="text-2xl flex-shrink-0 w-[36px] h-[32px] rounded-md p-1 border border-1 border-black" />
          <p className="font-semibold text-foreground/80 text-xs">{formatDate(new Date(post.date))}</p>
        </div>
      </div>
    </div>
  );
}
