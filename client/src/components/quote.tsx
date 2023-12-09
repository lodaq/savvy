import { detectLanguage } from '@/lib/utils';
import PropTypes from 'prop-types';

interface QuoteProps {
  quote: string;
  author: string;
}

const Quote = ({ quote, author }: QuoteProps) => {
  return (
    <div className="ml-4">
      <blockquote className="text-lg leading-7 font-semibold">
        <p className="text-gray-900" dir={detectLanguage(quote) === 'arabic' ? 'rtl' : 'ltr'}>
          {quote}
        </p>
      </blockquote>
      <p className="text-gray-600 mt-4" dir={detectLanguage(author) === 'arabic' ? 'rtl' : 'ltr'}>
        - {author}
      </p>
    </div>
  );
};

Quote.propTypes = {
  quote: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
};

export default Quote;
