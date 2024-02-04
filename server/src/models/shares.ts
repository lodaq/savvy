import mongoose, { Document, Model, Schema, Types, model, models } from 'mongoose';

// Define a base schema with common fields
const shareBaseSchema = new Schema({
  _id: Types.ObjectId,
  date: Date,
  likes: Number,
  caption: String,
  type: String,
});

// Discriminator options
const discriminatorOptions = {
  discriminatorKey: 'type',
};

// Define individual schemas
interface VideoDocument extends Document {
  url: string;
}

const videoSchema = new Schema<VideoDocument>(
  {
    url: String,
  },
  discriminatorOptions,
);

interface ShortDocument extends Document {
  url: string;
}

const shortSchema = new Schema<ShortDocument>(
  {
    url: String,
  },
  discriminatorOptions,
);

interface LinkDocument extends Document {
  url: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  favicon: string;
}

const linkSchema = new Schema<LinkDocument>(
  {
    url: String,
    ogTitle: String,
    ogDescription: String,
    ogImage: String,
    favicon: String,
  },
  discriminatorOptions,
);

interface ImageDocument extends Document {
  url: string;
}

const imageSchema = new Schema<ImageDocument>(
  {
    url: String,
  },
  discriminatorOptions,
);

interface QuoteDocument extends Document {
  quote: string;
  author: string;
}

const quoteSchema = new Schema<QuoteDocument>(
  {
    quote: String,
    author: String,
  },
  discriminatorOptions,
);

interface TextDocument extends Document {
  text: string;
}

const textSchema = new Schema<TextDocument>(
  {
    text: String,
  },
  discriminatorOptions,
);

interface ShareDocument extends Document {
  date: Date;
  likes: number;
  type: string;
  caption: string;
}

// Define common fields for creating a new post
interface CreatePostFields {
  _id: mongoose.Types.ObjectId;
  date: Date;
  likes: number;
  caption: string;
}

class Share {
  private ShareModel: Model<ShareDocument>;
  private VideoModel: Model<VideoDocument>;
  private ShortModel: Model<ShortDocument>;
  private LinkModel: Model<LinkDocument>;
  private ImageModel: Model<ImageDocument>;
  private QuoteModel: Model<QuoteDocument>;
  private TextModel: Model<TextDocument>;

  constructor(userId: string) {
    this.ShareModel = models[`${userId}_posts`] || model<ShareDocument>(`${userId}_posts`, shareBaseSchema);
    this.QuoteModel =
      models[`${userId}_posts_quote`] ||
      this.ShareModel.discriminator<QuoteDocument>(`${userId}_posts_quote`, quoteSchema);

    this.ShortModel =
      models[`${userId}_posts_short`] ||
      this.ShareModel.discriminator<ShortDocument>(`${userId}_posts_short`, shortSchema);
    this.VideoModel =
      models[`${userId}_posts_video`] ||
      this.ShareModel.discriminator<VideoDocument>(`${userId}_posts_video`, videoSchema);
    this.LinkModel =
      models[`${userId}_posts_link`] || this.ShareModel.discriminator<LinkDocument>(`${userId}_posts_link`, linkSchema);
    this.ImageModel =
      models[`${userId}_posts_image`] ||
      this.ShareModel.discriminator<ImageDocument>(`${userId}_posts_image`, imageSchema);
    this.TextModel =
      models[`${userId}_posts_text`] || this.ShareModel.discriminator<TextDocument>(`${userId}_posts_text`, textSchema);
    // console.log('all models', models);
  }

  async index(): Promise<Array<ShareDocument>> {
    try {
      const result = await this.ShareModel.find();
      return result as Array<ShareDocument>;
    } catch (error) {
      throw new Error(`Could not get the posts. Error: ${error}`);
    }
  }

  async show(id: string): Promise<ShareDocument | null> {
    try {
      const result = await this.ShareModel.findById(id);
      return result as ShareDocument | null;
    } catch (err) {
      throw new Error(`Could not find post ${id}. Error: ${err}`);
    }
  }

  async createText(text: string, caption: string): Promise<TextDocument> {
    try {
      const postFields: CreatePostFields = {
        _id: new mongoose.Types.ObjectId(),
        date: new Date(),
        likes: 0,
        caption,
      };

      const result = await this.TextModel.create({
        ...postFields,
        type: 'text',
        text,
      });

      return result as TextDocument;
    } catch (error) {
      throw new Error(`Could not add new text post. Error: ${error}`);
    }
  }

  async createVideo(url: string, caption: string): Promise<VideoDocument> {
    try {
      const postFields: CreatePostFields = {
        _id: new mongoose.Types.ObjectId(),
        date: new Date(),
        likes: 0,
        caption,
      };

      const result = await this.VideoModel.create({
        ...postFields,
        type: 'video',
        url,
      });

      return result as VideoDocument;
    } catch (error) {
      throw new Error(`Could not add new video post. Error: ${error}`);
    }
  }

  async createQuote(quote: string, caption: string, author: string): Promise<QuoteDocument> {
    try {
      const postFields: CreatePostFields = {
        _id: new mongoose.Types.ObjectId(),
        date: new Date(),
        likes: 0,
        caption,
      };

      const result = await this.QuoteModel.create({
        ...postFields,
        type: 'quote',
        quote,
        author,
      });

      return result as QuoteDocument;
    } catch (error) {
      throw new Error(`Could not add new quote post. Error: ${error}`);
    }
  }

  async createImage(url: string, caption: string): Promise<ImageDocument> {
    try {
      const postFields: CreatePostFields = {
        _id: new mongoose.Types.ObjectId(),
        date: new Date(),
        likes: 0,
        caption,
      };

      const result = await this.ImageModel.create({
        ...postFields,
        type: 'image',
        url,
      });

      return result as ImageDocument;
    } catch (error) {
      throw new Error(`Could not add new image post. Error: ${error}`);
    }
  }

  async createShort(url: string, caption: string): Promise<ShortDocument> {
    try {
      const postFields: CreatePostFields = {
        _id: new mongoose.Types.ObjectId(),
        date: new Date(),
        likes: 0,
        caption,
      };

      const result = await this.ShortModel.create({
        ...postFields,
        type: 'short',
        url,
      });

      return result as ShortDocument;
    } catch (error) {
      throw new Error(`Could not add new short post. Error: ${error}`);
    }
  }

  async createLink(
    link: {
      url: string;
      ogTitle: string;
      ogDescription: string;
      ogImage: string;
      favicon: string;
    },
    caption: string,
  ): Promise<LinkDocument> {
    try {
      const postFields: CreatePostFields = {
        _id: new mongoose.Types.ObjectId(),
        date: new Date(),
        likes: 0,
        caption,
      };

      const result = await this.LinkModel.create({
        ...postFields,
        type: 'link',
        ...link,
      });

      return result as LinkDocument;
    } catch (error) {
      throw new Error(`Could not add new link post. Error: ${error}`);
    }
  }

  async updateText(id: string, newText: string, newCaption: string): Promise<TextDocument | null> {
    try {
      const result = await this.TextModel.findByIdAndUpdate(id, { text: newText, caption: newCaption }, { new: true });
      return result as TextDocument | null;
    } catch (error) {
      throw new Error(`Could not update text post ${id}. Error: ${error}`);
    }
  }

  async updateVideo(id: string, newUrl: string, newCaption: string): Promise<VideoDocument | null> {
    try {
      const result = await this.VideoModel.findByIdAndUpdate(id, { url: newUrl, caption: newCaption }, { new: true });
      return result as VideoDocument | null;
    } catch (error) {
      throw new Error(`Could not update video post ${id}. Error: ${error}`);
    }
  }

  async updateQuote(
    id: string,
    newQuote: string,
    newAuthor: string,
    newCaption: string,
  ): Promise<QuoteDocument | null> {
    try {
      const result = await this.QuoteModel.findByIdAndUpdate(
        id,
        { quote: newQuote, author: newAuthor, caption: newCaption },
        { new: true },
      );
      return result as QuoteDocument | null;
    } catch (error) {
      throw new Error(`Could not update quote post ${id}. Error: ${error}`);
    }
  }

  async updateImage(id: string, newUrl: string, newCaption: string): Promise<ImageDocument | null> {
    try {
      const result = await this.ImageModel.findByIdAndUpdate(id, { url: newUrl, caption: newCaption }, { new: true });
      return result as ImageDocument | null;
    } catch (error) {
      throw new Error(`Could not update image post ${id}. Error: ${error}`);
    }
  }

  async updateShort(id: string, newUrl: string, newCaption: string): Promise<ShortDocument | null> {
    try {
      const result = await this.ShortModel.findByIdAndUpdate(id, { url: newUrl, caption: newCaption }, { new: true });
      return result as ShortDocument | null;
    } catch (error) {
      throw new Error(`Could not update short post ${id}. Error: ${error}`);
    }
  }

  async updateLink(id: string, newUrl: string, newCaption: string): Promise<LinkDocument | null> {
    try {
      const result = await this.LinkModel.findByIdAndUpdate(id, { url: newUrl, caption: newCaption }, { new: true });
      return result as LinkDocument | null;
    } catch (error) {
      throw new Error(`Could not update link post ${id}. Error: ${error}`);
    }
  }

  async likePost(id: string) {
    try {
      const post = await this.ShareModel.findById(id);

      if (!post) return null;

      post.likes += 1;

      const updatedPost = await post.save();

      return updatedPost;
    } catch (error) {
      throw new Error(`Could not like post ${id}. Error: ${error}`);
    }
  }

  async delete(id: string): Promise<ShareDocument | null> {
    try {
      const result = await this.ShareModel.findByIdAndDelete(id);
      return result as unknown as ShareDocument;
    } catch (error) {
      throw new Error(`Could not delete post ${id}. Error: ${error}`);
    }
  }
}

export default Share;
