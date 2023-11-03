import { Card, CardHeader, CardBody, CardFooter, Avatar } from '@nextui-org/react';

export default function Post({ text, likes, date }: { text: string; likes: number; date: string }) {
  return (
    <Card className="max-w-[340px]">
      <CardHeader className="justify-between">
        <div className="flex gap-5">
          <Avatar isBordered radius="full" size="md" src="/trashDreams.png" />
          <div className="flex flex-col gap-1 items-start justify-center">
            <h4 className="text-small font-semibold leading-none text-default-600">Khalid Mesbah</h4>
            <h5 className="text-small tracking-tight text-default-400">@kmesbah</h5>
          </div>
        </div>
      </CardHeader>
      <CardBody className="px-3 py-0 text-small text-default-400">
        <p>{text}</p>
        <span className="pt-2">
          #FrontendWithZoey
          <span className="py-2" aria-label="computer" role="img">
            c
          </span>
        </span>
        <p>{date}</p>
      </CardBody>
      <CardFooter className="gap-3">
        <div className="flex gap-1">
          <p className="font-semibold text-default-400 text-small">{likes}</p>
          <p className=" text-default-400 text-small">Likes</p>
        </div>
      </CardFooter>
    </Card>
  );
}
