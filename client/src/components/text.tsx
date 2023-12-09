import { detectLanguage } from '@/lib/utils';
import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';

interface TextPostProps {
  content: string;
}

const TextPost: React.FC<TextPostProps> = ({ content }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowed, setIsOverflowed] = useState(false);
  const contentRef = useRef<HTMLParagraphElement | null>(null);

  useEffect(() => {
    // Check if the content is more than 4 lines
    if (contentRef.current !== null) {
      setIsOverflowed(contentRef.current.scrollHeight > contentRef.current.clientHeight * 3);
    }
  }, [content]);

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div>
      <p
        className={`text-lg leading-7 ${isExpanded ? 'block' : 'line-clamp-3'} ${
          detectLanguage(content) === 'arabic' && 'text-right'
        }`}
        ref={contentRef}
      >
        {content}
      </p>
      {isOverflowed && !isExpanded && (
        <button className="text-blue-500 cursor-pointer" onClick={handleToggleExpand}>
          See More
        </button>
      )}
    </div>
  );
};

TextPost.propTypes = {
  content: PropTypes.string.isRequired,
};

export default TextPost;
