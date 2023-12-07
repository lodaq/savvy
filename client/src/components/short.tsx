import PropTypes from 'prop-types';

interface YoutubeShortProps {
  shortUrl: string;
  title: string;
}

const YouTubeShort = ({ shortUrl, title }: YoutubeShortProps) => {
  // Extract the video ID from the YouTube short URL
  const videoId = shortUrl.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);

  if (videoId == null) {
    return <div className="text-red-500">Invalid YouTube short URL. Please provide a valid YouTube short URL.</div>;
  }

  return (
    <div className="relative overflow-hidden max-w-screen-lg mx-auto">
      <iframe
        title={title}
        src={`https://www.youtube.com/embed/${videoId[1]}`}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="w-full min-h-[500px]"
      ></iframe>
    </div>
  );
};

YouTubeShort.propTypes = {
  shortUrl: PropTypes.string.isRequired,
  title: PropTypes.string,
};

export default YouTubeShort;
