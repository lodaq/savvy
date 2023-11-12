import mongoose, { Schema, Document, Model, model, Types } from 'mongoose';

// Define a base schema with common fields
const shareBaseSchema = new Schema({
  _id: Types.ObjectId,
  date: Date,
  likes: Number,
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
}

const linkSchema = new Schema<LinkDocument>(
  {
    url: String,
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
}

const quoteSchema = new Schema<QuoteDocument>(
  {
    quote: String,
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

// Create models using discriminators
const ShareModel = model('Share', shareBaseSchema);
const VideoModel = ShareModel.discriminator<VideoDocument>('video', videoSchema);
const ShortModel = ShareModel.discriminator<ShortDocument>('short', shortSchema);
const LinkModel = ShareModel.discriminator<LinkDocument>('link', linkSchema);
const ImageModel = ShareModel.discriminator<ImageDocument>('image', imageSchema);
const QuoteModel = ShareModel.discriminator<QuoteDocument>('quote', quoteSchema);
const TextModel = ShareModel.discriminator<TextDocument>('text', textSchema);

export { shortSchema, videoSchema, linkSchema, ShareModel, imageSchema, quoteSchema, textSchema };

interface ShareDocument extends Document {
  date: Date;
  likes: number;
  type: string;
}

// Define common fields for creating a new post
interface CreatePostFields {
  _id: mongoose.Types.ObjectId;
  date: Date;
  likes: number;
}

class Share {
  async index(): Promise<Array<ShareDocument>> {
    try {
      const result = await ShareModel.find();
      return result as Array<ShareDocument>;
    } catch (error) {
      throw new Error(`Could not get the posts. Error: ${error}`);
    }
  }

  async show(id: string): Promise<ShareDocument | null> {
    try {
      const result = await ShareModel.findById(id);
      return result as ShareDocument | null;
    } catch (err) {
      throw new Error(`Could not find post ${id}. Error: ${err}`);
    }
  }

  async createText(text: string): Promise<TextDocument> {
    try {
      const postFields: CreatePostFields = {
        _id: new mongoose.Types.ObjectId(),
        date: new Date(),
        likes: 0,
      };

      const result = await TextModel.create({
        ...postFields,
        type: 'text',
        text,
      });

      return result as TextDocument;
    } catch (error) {
      throw new Error(`Could not add new text post. Error: ${error}`);
    }
  }

  async createVideo(url: string): Promise<VideoDocument> {
    try {
      const postFields: CreatePostFields = {
        _id: new mongoose.Types.ObjectId(),
        date: new Date(),
        likes: 0,
      };

      const result = await VideoModel.create({
        ...postFields,
        type: 'video',
        url,
      });

      return result as VideoDocument;
    } catch (error) {
      throw new Error(`Could not add new video post. Error: ${error}`);
    }
  }

  async createQuote(quote: string): Promise<QuoteDocument> {
    try {
      const postFields: CreatePostFields = {
        _id: new mongoose.Types.ObjectId(),
        date: new Date(),
        likes: 0,
      };

      const result = await QuoteModel.create({
        ...postFields,
        type: 'quote',
        quote,
      });

      return result as QuoteDocument;
    } catch (error) {
      throw new Error(`Could not add new quote post. Error: ${error}`);
    }
  }

  async createImage(url: string): Promise<ImageDocument> {
    try {
      const postFields: CreatePostFields = {
        _id: new mongoose.Types.ObjectId(),
        date: new Date(),
        likes: 0,
      };

      const result = await ImageModel.create({
        ...postFields,
        type: 'image',
        url,
      });

      return result as ImageDocument;
    } catch (error) {
      throw new Error(`Could not add new image post. Error: ${error}`);
    }
  }

  async createShort(url: string): Promise<ShortDocument> {
    try {
      const postFields: CreatePostFields = {
        _id: new mongoose.Types.ObjectId(),
        date: new Date(),
        likes: 0,
      };

      const result = await ShortModel.create({
        ...postFields,
        type: 'short',
        url,
      });

      return result as ShortDocument;
    } catch (error) {
      throw new Error(`Could not add new short post. Error: ${error}`);
    }
  }

  async createLink(url: string): Promise<LinkDocument> {
    try {
      const postFields: CreatePostFields = {
        _id: new mongoose.Types.ObjectId(),
        date: new Date(),
        likes: 0,
      };

      const result = await LinkModel.create({
        ...postFields,
        type: 'link',
        url,
      });

      return result as LinkDocument;
    } catch (error) {
      throw new Error(`Could not add new link post. Error: ${error}`);
    }
  }

  async updateText(id: string, newText: string): Promise<TextDocument | null> {
    try {
      const result = await TextModel.findByIdAndUpdate(id, { text: newText }, { new: true });
      return result as TextDocument | null;
    } catch (error) {
      throw new Error(`Could not update text post ${id}. Error: ${error}`);
    }
  }

  async updateVideo(id: string, newUrl: string): Promise<VideoDocument | null> {
    try {
      const result = await VideoModel.findByIdAndUpdate(id, { url: newUrl }, { new: true });
      return result as VideoDocument | null;
    } catch (error) {
      throw new Error(`Could not update video post ${id}. Error: ${error}`);
    }
  }

  async updateQuote(id: string, newQuote: string): Promise<QuoteDocument | null> {
    try {
      const result = await QuoteModel.findByIdAndUpdate(id, { quote: newQuote }, { new: true });
      return result as QuoteDocument | null;
    } catch (error) {
      throw new Error(`Could not update quote post ${id}. Error: ${error}`);
    }
  }

  async updateImage(id: string, newUrl: string): Promise<ImageDocument | null> {
    try {
      const result = await ImageModel.findByIdAndUpdate(id, { url: newUrl }, { new: true });
      return result as ImageDocument | null;
    } catch (error) {
      throw new Error(`Could not update image post ${id}. Error: ${error}`);
    }
  }

  async updateShort(id: string, newUrl: string): Promise<ShortDocument | null> {
    try {
      const result = await ShortModel.findByIdAndUpdate(id, { url: newUrl }, { new: true });
      return result as ShortDocument | null;
    } catch (error) {
      throw new Error(`Could not update short post ${id}. Error: ${error}`);
    }
  }

  async updateLink(id: string, newUrl: string): Promise<LinkDocument | null> {
    try {
      const result = await LinkModel.findByIdAndUpdate(id, { url: newUrl }, { new: true });
      return result as LinkDocument | null;
    } catch (error) {
      throw new Error(`Could not update link post ${id}. Error: ${error}`);
    }
  }

  async delete(id: string): Promise<ShareDocument | null> {
    try {
      const result = await ShareModel.findByIdAndDelete(id);
      return result as ShareDocument;
    } catch (error) {
      throw new Error(`Could not delete post ${id}. Error: ${error}`);
    }
  }
}

export default Share;
