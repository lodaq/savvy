import { Listbox, ListboxItem } from "@nextui-org/react";
import { ListboxWrapper } from "./listbox-wrapper.tsx";
import { useNavigate } from "react-router-dom";
import { MdArticle, MdImage, MdLocalPostOffice } from "react-icons/md";

const iconClasses = "text-xl fill-green-500 pointer-events-none flex-shrink-0";
const items = [
  {
    name: "images",
    href: "/images",
    icon: <MdImage className={iconClasses} />,
  },
  {
    name: "aritcles",
    href: "/articles",
    icon: <MdArticle className={iconClasses} />,
  },
  {
    name: "posts",
    href: "/posts",
    icon: <MdLocalPostOffice className={iconClasses} />,
  },
];

function Navbar() {
  const navigate = useNavigate();
  return (
    <ListboxWrapper>
      <Listbox variant="faded" aria-label="Listbox menu with icons">
        {items.map(({ name, href, icon }) => {
          return (
            <ListboxItem
              key={name}
              startContent={icon}
              onClick={() => navigate(href)}
            >
              {name}
            </ListboxItem>
          );
        })}
      </Listbox>
    </ListboxWrapper>
  );
}

export default Navbar;
