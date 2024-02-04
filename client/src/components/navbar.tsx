import { UserButton, SignOutButton, useUser } from '@clerk/clerk-react';
import { MdChevronLeft, MdChevronRight, MdArticle, MdImage, MdLocalPostOffice } from 'react-icons/md';
import { Separator } from '@/components/ui/separator';
import { buttonVariants } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import Logo from './logo';
import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { openUserProfile } from '@/lib/utils';

const items = [
  {
    name: 'images',
    href: '/images',
    icon: <MdImage />,
  },
  {
    name: 'aritcles',
    href: '/articles',
    icon: <MdArticle />,
  },
  {
    name: 'posts',
    href: '/posts',
    icon: <MdLocalPostOffice />,
  },
];

function Sidebar() {
  const user = useUser().user;
  const [isExpanded, setIsExpanded] = useState(true);
  const [isWidthSmall, setIsWidthSmall] = useState(false);
  const expand = () => {
    if (window.innerWidth >= 700) {
      setIsExpanded(true);
      setIsWidthSmall(false);
    } else {
      setIsExpanded(false);
      setIsWidthSmall(true);
    }
  };

  useEffect(() => {
    expand();
    window.addEventListener('resize', expand);
    return () => {
      window.removeEventListener('resize', expand);
    };
  }, []);

  return (
    <aside
      className={`z-[1] bg-card border-2 border-primary h-screen p-2 rounded-r-md sticky top-0 left-0 flex flex-col gap-2 transition-all ${
        isExpanded ? 'w-[200px] min-w-[200px] max-w-[200px]' : 'w-[80px] min-w-[80px] max-w-[80px]'
      }`}
    >
      {!isWidthSmall && (
        <Button
          className="absolute -right-[12.5px] top-[30px] w-[25px] h-[25px] p-1 rounded-full"
          onClickCapture={() => {
            setIsExpanded(!isExpanded);
          }}
        >
          {isExpanded ? <MdChevronLeft /> : <MdChevronRight />}
        </Button>
      )}
      <Logo />

      {items.map(({ name, href, icon }) => (
        <div
          key={name}
          className={`w-full flex justify-start items-start relative before:transition-opacity before:delay-500 before:opacity-0
          ${
            !isExpanded &&
            `hover:before:content-[attr(data-before)] hover:before:capitalize 
            hover:before:-translate-y-1/2 hover:before:px-2 hover:before:py-1 hover:before:rounded-md
            hover:before:text-background hover:before:bg-foreground hover:before:absolute hover:before:top-[50%] 
            hover:before:left-[calc(100%+20px)] hover:before:opacity-100`
          }`}
          data-before={name}
        >
          <Link
            to={href}
            className={`
            ${buttonVariants({ variant: 'outline' })} w-full flex justify-center items-center`}
          >
            <i className="text-xl pointer-events-none flex-grow-1 flex-shrink-0">{icon}</i>
            <p className={`capitalize overflow-hidden ${isExpanded ? 'w-full ml-2' : 'w-0 ml-0'} transition-all`}>
              {name}
            </p>
          </Link>
        </div>
      ))}

      <Separator className="mt-auto" />

      <div className="p-1 flex justify-center items-center gap-2">
        <UserButton />
        <div
          onClickCapture={openUserProfile}
          className={`cursor-pointer overflow-hidden flex flex-col items-start transition-all ${
            isExpanded ? 'w-full' : 'w-0'
          }`}
        >
          <div className="text-sm w-full text-left overflow-hidden overflow-ellipsis whitespace-nowrap">
            {user?.fullName}
          </div>
          <div className="text-xs w-full overflow-hidden overflow-ellipsis whitespace-nowrap">
            {user?.primaryEmailAddress?.emailAddress}
          </div>
        </div>
      </div>

      <div className={buttonVariants({ variant: 'default' }) + 'cursor-pointer'}>
        <SignOutButton />
      </div>
    </aside>
  );
}

export default Sidebar;
