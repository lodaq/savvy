// import { useQuery } from '@tanstack/react-query';
// import { type ChangeEvent, useState, type FormEvent } from 'react';
// import { useImmer } from 'use-immer';
// import LazyImage from '../image';
// import NotionLink from '../link';
// import SharePost from '../post';
// import Quote from '../quote';
// import YouTubeShort from '../short';
// import TextPost from '../text';
// import YouTubeVideo from '../video';
// import { detectLanguage } from '@/lib/utils';
// import {
//   Select,
//   SelectContent,
//   SelectGroup,
//   SelectItem,
//   SelectLabel,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { useForm } from 'react-hook-form';
// import * as z from 'zod';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// // import { toast } from '@/components/ui/use-toast';
// import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
// const FormSchema = z.object({
//   username: z.string().min(2, {
//     message: 'Username must be at least 2 characters.',
//   }),
// });
//
// const types = [
//   { value: 'video', label: 'Video' },
//   { value: 'short', label: 'Short' },
//   { value: 'image', label: 'Image' },
//   { value: 'quote', label: 'Quote' },
//   { value: 'text', label: 'Text' },
//   { value: 'link', label: 'Link' },
// ];
//
// const initialBody = {
//   text: '',
//   url: '',
//   quote: '',
//   caption: '',
// };
//
// export default function SharesPage() {
//   const [selectedType, setSelectedType] = useState<string>('text');
//   const [body, setBody] = useImmer(initialBody);
//
//   const { isPending, error, data, refetch } = useQuery({
//     queryKey: ['repoData'],
//     queryFn: async (): Promise<Post[]> => await fetch(import.meta.env.VITE_URL).then(async (res) => await res.json()),
//   });
//
//   const handleSelectionChange = (newValue: string) => {
//     if (newValue !== selectedType) setSelectedType(newValue);
//     setBody((body) => {
//       body.caption = '';
//     });
//   };
//
//   const handleSubmit = async (e: FormEvent) => {
//     e.preventDefault();
//     await fetch(`${import.meta.env.VITE_URL}/${selectedType}`, {
//       method: 'Post',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(body),
//     });
//     await refetch();
//   };
//
//   const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setBody({
//       ...body,
//       [name]: value,
//     });
//   };
//
//   if (isPending) return 'Loading...';
//
//   if (error !== null) return 'An error has occurred: ' + error?.message;
//
//   return (
//     <div className="mx-auto max-w-[540px] w-full">
//       <form className="flex flex-col gap-1 bg-primary-500/50 p-2 rounded-sm" onSubmit={handleSubmit}>
//         <Select value={selectedType} onValueChange={handleSelectionChange}>
//           <SelectTrigger className="w-[180px] mx-auto">
//             <SelectValue placeholder="Select a type" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectGroup>
//               <SelectLabel>Fruits</SelectLabel>
//               {types.map((type) => (
//                 <SelectItem key={type.value} value={type.value}>
//                   {type.label}
//                 </SelectItem>
//               ))}
//             </SelectGroup>
//           </SelectContent>
//         </Select>
//         <Input
//           type="text"
//           name="caption"
//           onChange={handleInputChange}
//           dir={detectLanguage(body.caption) === 'arabic' ? 'rtl' : 'ltr'}
//         />
//         {['image', 'video', 'link', 'short'].includes(selectedType) && (
//           <Input type="url" name="url" onChange={handleInputChange} />
//         )}
//         {selectedType === 'quote' && (
//           <Input
//             type="text"
//             name="quote"
//             required
//             onChange={handleInputChange}
//             dir={detectLanguage(body.quote) === 'arabic' ? 'rtl' : 'ltr'}
//           />
//         )}
//         {selectedType === 'text' && (
//           <Input
//             type="text"
//             name="text"
//             required
//             onChange={handleInputChange}
//             dir={detectLanguage(body.text) === 'arabic' ? 'rtl' : 'ltr'}
//           />
//         )}
//         <Button type="submit" color="primary">
//           Post
//         </Button>
//       </form>
//       <div className="flex flex-col gap-2 mx-auto p-2">
//         {data.map((p: Post) => {
//           return (
//             <SharePost key={p._id} post={p}>
//               <>
//                 {p.type === 'video' && <YouTubeVideo url={p.url} caption={p.caption} />}
//                 {p.type === 'image' && <LazyImage imageUrl={p.url} altText={p.caption !== '' ? p.caption : 'image'} />}
//                 {p.type === 'short' && <YouTubeShort shortUrl={p.url} title="short" />}
//                 {p.type === 'link' && (
//                   <NotionLink
//                     url={p.url}
//                     meta={{
//                       favicon: p.favicon,
//                       ogImage: p.ogImage,
//                       ogDescription: p.ogDescription,
//                       ogTitle: p.ogTitle,
//                     }}
//                   />
//                 )}
//                 {p.type === 'text' && <TextPost content={p.text} />}
//                 {p.type === 'quote' && <Quote quote={p.quote} author="K.Mesbah" />}
//               </>
//             </SharePost>
//           );
//         })}
//       </div>
//     </div>
//   );
// }
