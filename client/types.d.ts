type Post = {
  caption: string;
  likes: number;
  date: Date;
  _id?: string;
} & (
  | {
      type: 'text';
      text: string;
    }
  | {
      type: 'image';
      url: string;
    }
  | {
      type: 'link';
      url: string;
      ogTitle: string;
      ogDescription: string;
      ogImage: string;
      favicon: string;
    }
  | {
      type: 'video';
      url: string;
    }
  | {
      type: 'short';
      url: string;
    }
  | {
      type: 'quote';
      quote: string;
    }
);
