import PropTypes from 'prop-types';

interface NotionLinkProps {
  url: string;
  meta: {
    favicon: string;
    ogDescription: string;
    ogTitle: string;
    ogImage: string;
  };
}

const NotionLink = ({ url, meta }: NotionLinkProps) => {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex max-w-full w-full overflow-hidden border border-solid border-gray-200 hover:border-gray-400 rounded-md fill-current transition duration-200 ease-in cursor-pointer bg-white"
    >
      <div className="p-2 overflow-hidden flex flex-col gap-1 break-all break-words">
        <div className="text-sm leading-5 text-gray-700 line-clamp-1 min-h-6 mb-[2px]">{meta?.ogTitle}</div>
        <div className="text-xs leading-4 text-gray-500 h-8 line-clamp-2">{meta?.ogDescription}</div>
        <div className="flex mt-[6px]">
          <img src={meta?.favicon} className="w-4 h-4 min-w-4 mr-2" alt={meta?.ogTitle} loading="lazy" />
          <div className="text-xs leading-4 text-gray-700 line-clamp-1">{url}</div>
        </div>
      </div>
      <div className="flex justify-center items-center aspect-square min-w-[106px] max-h-[106px] overflow-hidden">
        <img
          src={
            typeof meta.ogImage === 'string'
              ? JSON.parse(meta.ogImage)[0].url
              : `https://via.placeholder.com/600x250/F00/FFF?text=${meta.ogTitle.split(' ').join('+')}` // change colors based on the theme
          }
          decoding="async"
          alt={meta.ogTitle}
          referrerPolicy="same-origin"
          loading="lazy"
          className="block object-contain rounded-md max-w-full max-h-full w-full h-full"
        />
      </div>
    </a>
  );
};

NotionLink.propTypes = {
  url: PropTypes.string.isRequired,
  meta: PropTypes.object.isRequired,
};

export default NotionLink;
