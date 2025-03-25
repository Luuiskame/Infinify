
import { CiHome } from "react-icons/ci";
import { FaUserFriends } from "react-icons/fa";
import { FiHome, FiUsers } from "react-icons/fi";




interface Link {
  id: number;
  name: string;
  url: string;
  icon: JSX.Element;
  activeIcon ?: JSX.Element;
}

export const links: Link[] = [
  {
    id: 1,
    name: "Home",
    url: "/",
    icon: <CiHome className="h-6 w-6" />, 
    activeIcon: <FiHome  className="h-6 w-6 text-spotify-green" />,
  },
  {
    id: 3,
    name: "Connect",
    url: "/connect",
    icon: <FaUserFriends className="h-6 w-6" />,
    activeIcon: <FiUsers className="h-6 w-6 text-spotify-green" />,
  }
];