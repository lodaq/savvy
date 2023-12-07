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
      className="flex flex-grow min-w-0 flex-wrap-reverse overflow-hidden border border-solid border-gray-200 hover:border-gray-400 rounded-md fill-current transition duration-200 ease-in cursor-pointer bg-white"
    >
      <div className="flex-[1.8_1.8_0%] p-2 overflow-hidden flex flex-col gap-1">
        <div className="text-sm leading-5 text-gray-700 whitespace-nowrap overflow-hidden overflow-ellipsis min-h-6 mb-[2px]">
          {meta?.ogTitle}
        </div>
        <div className="text-xs leading-4 text-gray-500 h-8 overflow-hidden">{meta?.ogDescription}</div>
        <div className="flex mt-[6px]">
          <img src={meta?.favicon} className="w-4 h-4 min-w-4 mr-2" alt={meta?.ogTitle} />
          <div className="text-xs leading-4 text-gray-700 whitespace-nowrap overflow-hidden overflow-ellipsis">
            {url}
          </div>
        </div>
      </div>
      <div className="w-[200px] max-h-[106px]">
        <img
          src={
            typeof meta.ogImage === 'string'
              ? JSON.parse(meta.ogImage)[0].url
              : `https://via.placeholder.com/600x250/F00/FFF?text=${meta.ogTitle.split(' ').join('+')}` // change colors based on the theme
          }
          decoding="async"
          alt={meta.ogTitle}
          referrerPolicy="same-origin"
          className="block object-contain rounded-md max-w-full w-full max-h-full"
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
