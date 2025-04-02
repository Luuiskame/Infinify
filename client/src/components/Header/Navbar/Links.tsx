import { HomeIcon, UsersIcon } from "@heroicons/react/24/outline";
import { HomeIcon as HomeSolid, UsersIcon as UsersSolid } from "@heroicons/react/24/solid";





interface Link {
  id: number;
  name: string;
  url: string;
  icon: JSX.Element;
  activeIcon?: JSX.Element;
}

export const links: Link[] = [
  {
    id: 1,
    name: "Home",
    url: "/",
    icon: <HomeIcon className="h-6 w-6" />, 
    activeIcon: <HomeSolid className="h-6 w-6 text-spotify-green" />,
  },
  {
    id: 3,
    name: "Connect",
    url: "/connect",
    icon: <UsersIcon className="h-6 w-6" />,
    activeIcon: <UsersSolid className="h-6 w-6 text-spotify-green" />,
  }
];
