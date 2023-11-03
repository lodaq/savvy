/* import { Textarea, Input, Button } from '@nextui-org/react';
import { useState } from 'react';

interface ArticleType {
  title: string;
  content: string;
} */

function ArticlesPage() {
  /* const [article, setArticle] = useState<ArticleType>({
    title: '',
    content: '',
  });
  const post = () => {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(article),
    };
    fetch('http://localhost:3000/articles', options)
      .then(async (response) => await response.json())
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error(error);
      });
  }; */

  return (
    <div className="p-5 min-h-screen w-full md:flex-nowrap gap-4 bg-slate-500">
      {/* <Select label="Select an animal" className="max-w-xs"> */}
      {/*   {types.map((type) => ( */}
      {/*     <SelectItem key={type} value={type}> */}
      {/*       {type} */}
      {/*     </SelectItem> */}
      {/*   ))} */}
      {/* </Select> */}
      {/* <Input
        size="sm"
        type="text"
        label="Username"
        className="w-[200px]"
        onChange={(e) => {
          setArticle((article) => ({
            ...article,
            title: e.currentTarget.value,
          })) }
        }}
      />
      <Textarea
        isRequired
        label="Content"
        labelPlacement="outside"
        placeholder="Enter your description"
        className="max-w-xs"
        onChange={(e) => {
          setArticle((article) => ({
            ...article,
            content: e.currentTarget.value,
          })) }
        }}
      />

      <Button
        onClick={() => {
          post();
        }}
      >
        submit
      </Button>
      <h2>the article is: </h2>
      <p>title: {article.title}</p>
      <p>content: {article.content}</p>
      */}
    </div>
  );
}

export default ArticlesPage;
