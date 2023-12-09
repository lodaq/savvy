import { MdArticle, MdImage, MdLocalPostOffice } from 'react-icons/md';
import { Link } from 'react-router-dom';

const iconClasses = 'text-xl fill-red-500 pointer-events-none flex-shrink-0';
const items = [
  {
    name: 'images',
    href: '/images',
    icon: <MdImage className={iconClasses} />,
  },
  {
    name: 'aritcles',
    href: '/articles',
    icon: <MdArticle className={iconClasses} />,
  },
  {
    name: 'posts',
    href: '/posts',
    icon: <MdLocalPostOffice className={iconClasses} />,
  },
];

function Navbar() {
  return (
    <div className="bg-slate-500 w-[200px] min-w-[200px] max-w-[200px] h-screen p-2 rounded-r-md sticky top-0 left-0 overflow-auto">
      {items.map(({ name, href, icon }) => (
        <Link key={name} to={href} className="flex gap-1 items-center">
          {icon}
          {name}
        </Link>
      ))}
    </div>
  );
}

export default Navbar;
