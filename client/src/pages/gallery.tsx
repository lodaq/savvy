import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@clerk/clerk-react';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { createClient } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { Separator } from '@radix-ui/react-separator';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import MasonaryLayout from '@/components/masonary-layout';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/components/ui/use-toast';

const supabaseProjectUrl = import.meta.env.VITE_PROJECT_URL;
const supabaseKey = import.meta.env.VITE_PROJECT_API_KEY;
const CDNURL = import.meta.env.VITE_CDN_URL;

const supabaseClient = async (supabaseAccessToken: string) => {
  const supabase = createClient(supabaseProjectUrl, supabaseKey, {
    global: { headers: { Authorization: `Bearer ${supabaseAccessToken}` } },
  });

  return supabase;
};

export default function GalleryPage() {
  const { toast } = useToast();
  const { userId, getToken } = useAuth();
  const [file, setFile] = useState<File>();
  const [isRefetched, setIsRefetched] = useState<boolean>(false);

  const { isPending, error, data, refetch } = useQuery({
    queryKey: ['images'],
    queryFn: async () => {
      const supabaseAccessToken = await getToken({ template: 'supabase' });
      const supabase = await supabaseClient(supabaseAccessToken as string);

      const { data } = await supabase.storage.from('gallery').list(`${userId}/`, {
        limit: 50,
        offset: 0,
        sortBy: {
          column: 'created_at',
          order: 'desc',
        },
      });

      return data;
    },
  });

  useEffect(() => {
    console.log(`rerender`, data);
    setIsRefetched((isRefetched) => !isRefetched);
  }, [data]);

  if (isPending) return 'Loading...';

  if (error !== null) return 'An error has occurred: ' + error?.message;

  const uploadImage = async () => {
    const supabaseAccessToken = await getToken({ template: 'supabase' });
    const supabase = await supabaseClient(supabaseAccessToken as string);
    const { data, error } = await supabase.storage.from('gallery').upload(`${userId}/${uuidv4()}`, file as File);

    if (error !== null) {
      toast({
        title: "Couldn't upload the image.",
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4 overflow-auto">
            <code className="text-white">{JSON.stringify(error, null, 2)}</code>
          </pre>
        ),
      });
    } else {
      toast({
        title: 'the Image has been uploaded.',
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4 overflow-auto">
            <code className="text-white">{JSON.stringify(data, null, 2)}</code>
          </pre>
        ),
      });
      await refetch();
    }
  };

  const deleteImage = async (imageName: string) => {
    const supabaseAccessToken = await getToken({ template: 'supabase' });
    const supabase = await supabaseClient(supabaseAccessToken as string);

    const { error } = await supabase.storage.from('gallery').remove([`${userId}/${imageName}`]);

    if (error !== null) {
      toast({
        title: "Couldn't delete the image.",
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4 overflow-auto">
            <code className="text-white">{JSON.stringify(error, null, 2)}</code>
          </pre>
        ),
      });
    } else {
      toast({
        title: 'the Image has been deleted.',
      });
      await refetch();
    }
  };

  const downloadImage = async (imageName: string) => {
    const supabaseAccessToken = await getToken({ template: 'supabase' });
    const supabase = await supabaseClient(supabaseAccessToken as string);

    const { data } = supabase.storage.from('gallery').getPublicUrl(`${userId}/${imageName}`);
    const res = await fetch(data.publicUrl);
    const blobImage = await res.blob();
    const href = URL.createObjectURL(blobImage);
    const anchorElement = Object.assign(document.createElement('a'), {
      href,
      style: 'display:none',
      download: imageName,
    });

    document.body.appendChild(anchorElement);
    anchorElement.click();
    document.body.removeChild(anchorElement);
    window.URL.revokeObjectURL(href);

    toast({
      title: 'The Image has been downloaded.',
    });
    await refetch();
  };

  const copyImageURL = async (imageName: string) => {
    await navigator.clipboard.writeText(`${CDNURL}/${userId}/${imageName}`);
    toast({
      title: 'The Image URL has been copied.',
    });
  };

  return (
    <div className="w-full items-center gap-1.5 h-fit bg-gray-400 p-2">
      <div className="max-w-md mx-auto flex gap-4 items-center md:items-end justify-center flex-col md:flex-row border-2 border-border bg-card p-2 rounded-md">
        <div className="flex gap-2 flex-wrap max-w-sm">
          <Label htmlFor="image">Image</Label>
          <Input
            id="image"
            type="file"
            accept="image/*"
            onChange={(e) => {
              setFile(e.currentTarget?.files?.[0]);
            }}
            required
            className="bg-secondary"
          />
        </div>
        <Button onClick={uploadImage}>Upload</Button>
      </div>
      <Separator />
      <MasonaryLayout
        className="p-2"
        minColWidth={200}
        horizontalGap={4}
        verticalGap={4}
        isRefetched={isRefetched}
        equalColWidth
        elements={data!.map(({ name }) => (
          <Card className="rounded-md" key={name}>
            <CardContent className="p-1">
              <img
                src={`${CDNURL}/${userId}/${name}`}
                alt={name}
                className="rounded-md overflow-hidden"
                loading="lazy"
              />
            </CardContent>
            <CardFooter className="flex p-1 m-1 gap-2 justify-center items-center bg-border rounded-md">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant={'outline'}
                      size={'icon'}
                      onClick={async () => {
                        await downloadImage(name);
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="sbui-icon"
                      >
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="7 10 12 15 17 10"></polyline>
                        <line x1="12" y1="15" x2="12" y2="3"></line>
                      </svg>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <span className="truncate">Download</span>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      size={'icon'}
                      onClick={async () => {
                        await copyImageURL(name);
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="sbui-icon"
                      >
                        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                        <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                      </svg>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <span className="truncate">Get URL</span>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant={'destructive'}
                      size={'icon'}
                      onClick={async () => {
                        await deleteImage(name);
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="sbui-icon"
                      >
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        <line x1="10" y1="11" x2="10" y2="17"></line>
                        <line x1="14" y1="11" x2="14" y2="17"></line>
                      </svg>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <span className="truncate">Delete image</span>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardFooter>
          </Card>
        ))}
      />
    </div>
  );
}
