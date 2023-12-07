import PropTypes from 'prop-types';

interface LazyImageProps {
  imageUrl: string;
  altText: string;
  width?: number;
  height?: number;
  className?: string;
}

const LazyImage = ({ imageUrl, altText, width, height, className }: LazyImageProps) => {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <img
        src={imageUrl}
        alt={altText}
        width={width}
        height={height}
        loading="lazy"
        className="object-cover max-h-[500px] mx-auto transition duration-300 transform hover:scale-105"
      />
    </div>
  );
};

LazyImage.propTypes = {
  imageUrl: PropTypes.string.isRequired,
  altText: PropTypes.string.isRequired,
  width: PropTypes.number,
  height: PropTypes.number,
  className: PropTypes.string,
};

export default LazyImage;
