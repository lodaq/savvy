import PropTypes from 'prop-types';

interface QuoteProps {
  quote: string;
  author: string;
}

const Quote = ({ quote, author }: QuoteProps) => {
  return (
    <div className="ml-4">
      <blockquote className="text-lg leading-7 font-semibold">
        <p className="text-gray-900">{quote}</p>
      </blockquote>
      <p className="text-gray-600 mt-4">- {author}</p>
    </div>
  );
};

Quote.propTypes = {
  quote: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
};

export default Quote;
