import formatDate from '@/lib/formatDate';
import { detectLanguage } from '@/lib/utils';
import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@nextui-org/react';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { MdDateRange, MdSettings } from 'react-icons/md';
import { SlLike, SlShare } from 'react-icons/sl';
import { FacebookIcon, FacebookShareButton, TwitterIcon, TwitterShareButton } from 'react-share';

export default function SharePost({ children, post }: { children: React.ReactChild; post: Post }) {
  const shareUrl = 'tmp';
  const title = 'tmp';
  const { refetch } = useQuery({ queryKey: ['repoData'] });

  const onLike = async () => {
    await fetch(`${import.meta.env.VITE_URL}/like/${post._id}`, {
      method: 'Put',
    });
    await refetch();
  };
  const onDelete = async () => {
    await fetch(`${import.meta.env.VITE_URL}/${post._id}`, {
      method: 'Delete',
    });
    await refetch();
  };

  return (
    <Card className="rounded-md" id={post.caption}>
      <CardHeader className="justify-between">
        <div className="flex gap-5">
          <Avatar isBordered radius="full" size="md" src="/public/personal.png" />
          <div className="flex flex-col gap-1 items-start justify-center">
            <h4 className="text-small font-semibold leading-none text-default-600">Khalid Mesbah</h4>
            <h5 className="text-small tracking-tight text-default-400">@khalidmesbah</h5>
          </div>
        </div>
        <Dropdown>
          <DropdownTrigger>
            <Button variant="bordered" isIconOnly>
              <MdSettings />
            </Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Static Actions">
            <DropdownItem key="edit">Edit post</DropdownItem>
            <DropdownItem key="delete" className="text-danger" color="danger" onClick={onDelete}>
              Delete post
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </CardHeader>

      <CardBody className="px-3 py-0 text-small">
        {post.caption !== '' ? (
          <p className={`mb-2 border-b-1 ${detectLanguage(post.caption) === 'arabic' && 'text-right'}`}>
            {post.caption}
          </p>
        ) : (
          ''
        )}
        {children}
      </CardBody>

      <CardFooter className="flex gap-3">
        <div className="flex gap-1 justify-center items-center">
          <Button isIconOnly aria-label="Like" size="sm" radius="sm" onClick={onLike}>
            <SlLike />
          </Button>
          <p className="font-semibold text-default-400 text-small">{post.likes}</p>
        </div>
        <Dropdown>
          <DropdownTrigger>
            <Button isIconOnly aria-label="Share" size="sm" radius="sm">
              <SlShare />
            </Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Static Actions">
            <DropdownItem key="edit">
              <FacebookShareButton url={shareUrl} title={title} className="cursor-pointer flex gap-2">
                <FacebookIcon size={24} round />
                Facebook
              </FacebookShareButton>
            </DropdownItem>
            <DropdownItem key="delete">
              <TwitterShareButton url={shareUrl} title={title} className="cursor-pointer flex gap-2">
                <TwitterIcon size={24} round />
                Twitter
              </TwitterShareButton>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
        <div className="flex items-center gap-1 ml-auto">
          <MdDateRange />
          <p className="font-semibold text-default-400 text-small">{formatDate(new Date(post.date))}</p>
        </div>
      </CardFooter>
    </Card>
  );
}
