import PropTypes from 'prop-types';

interface YoutubeVideoProps {
  url: string;
  caption: string;
}

const YouTubeVideo = ({ url, caption }: YoutubeVideoProps) => {
  // Extract the video ID from the YouTube URL
  const videoId = url.match(
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
  );

  if (videoId == null) {
    return <div className="text-red-500">Invalid YouTube URL. Please provide a valid YouTube video URL.</div>;
  }

  return (
    <div className="relative overflow-hidden max-w-screen-lg w-full mx-auto">
      <iframe
        title={caption}
        src={`https://www.youtube.com/embed/${videoId[1]}`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="w-full aspect-video"
      ></iframe>
    </div>
  );
};

YouTubeVideo.propTypes = {
  url: PropTypes.string.isRequired,
  caption: PropTypes.string.isRequired,
};

export default YouTubeVideo;
