import React, { useEffect, useState } from "react";
import { links } from "./Links";
import Link from "next/link";
import { getUser, logOut } from "@/slices/userSlice";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import Search from "@/components/Search/Search";
import { CiChat1 } from "react-icons/ci";
import { FiLogOut, FiMessageSquare } from "react-icons/fi";
import NumberIcon from "@/shared/NumberIcon";
import { ChevronDownIcon, ChevronUpDownIcon } from "@heroicons/react/24/solid";
import { usePathname } from "next/navigation";

// Desktop Navbar Component
const DesktopNavbar = () => {
  const dispatch = useAppDispatch();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const data = useAppSelector((state) => state.userReducer.user);
  const user = data?.user;
  const pathName = usePathname();

  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logOut());
    window.location.href = "/"; 
  };

  const messagesIcon = <CiChat1 className="h-6 w-6" />;
  const activeMessagesIcon = <FiMessageSquare className="h-6 w-6 text-spotify-green" />;
  const isMessagesActive = pathName === "/messages";

  return (
    <nav className="px-6 py-3 text-white md:block hidden">
      <div className="flex items-center gap-5">
        <div className="flex items-center justify-center">
          <Search />
        </div>
        {links.map(({ id, name, url }) => (
          <Link
            href={url}
            key={id}
            className="block hover:text-primary hover:border-b-[1px] text-white font-bold font-sans text-lg"
          >
            {name}
          </Link>
        ))}
        {user && (
          <>
            <Link
              className={`hover:text-primary hover:border-b-[1px] font-bold font-sans text-lg relative ${
                isMessagesActive ? "text-spotify-green" : "text-white"
              }`}
              href={`/messages`}
            >
              <NumberIcon />
              <span className="md:hidden">
                {isMessagesActive ? activeMessagesIcon : messagesIcon}
              </span>
              <span className="hidden md:inline">Messages</span>
            </Link>
            <div className="relative">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center gap-1 hover:text-primary"
              >
                <Image
                  src={user.profile_photo}
                  width={40}
                  height={30}
                  className="rounded-full object-fill border-1 border-white"
                  alt={user.display_name}
                />
                {isMenuOpen ? (
                  <ChevronUpDownIcon className="text-white" />
                ) : (
                  <ChevronDownIcon className="text-white" />
                )}
              </button>
              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-spotify-light-gray rounded-md shadow-lg py-1 z-50">
                  <Link
                    href={`/profile/${user.spotify_id}`}
                    className="block px-4 py-2 text-white hover:bg-spotify-dark-gray"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Mi perfil
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-white hover:bg-spotify-dark-gray flex items-center gap-2"
                  >
                    <FiLogOut /> Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

// Mobile Navbar Component
const MobileNavbar = () => {
  const dispatch = useAppDispatch();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const data = useAppSelector((state) => state.userReducer.user);
  const user = data?.user;
  const pathName = usePathname();

  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logOut());
    window.location.href = "/"; 
  };

  const messagesIcon = <CiChat1 className="h-6 w-6" />;
  const activeMessagesIcon = <FiMessageSquare className="h-6 w-6 text-spotify-green" />;
  const isMessagesActive = pathName === "/messages";

  return (
    <div className="fixed z-50 bottom-0 left-0 w-full bg-spotify-light-gray text-white flex justify-around md:hidden py-4">
      {links.map(({ id, url, icon, activeIcon }) => {
        const isActive = pathName === url;
        return (
          <Link
            href={url}
            key={id}
            className={`flex flex-col items-center justify-center p-2 ${
              isActive ? "text-spotify-green" : "hover:text-primary"
            }`}
          >
            {isActive ? activeIcon || icon : icon}
            <span className={`text-xs mt-1 ${
              isActive ? "text-spotify-green" : "text-white"
            }`}>
              {links.find(link => link.id === id)?.name}
            </span>
          </Link>
        );
      })}

      {user && (
        <>
          <Link
            href={`/messages`}
            className={`flex flex-col items-center justify-center p-2 ${
              isMessagesActive ? "text-spotify-green" : "hover:text-primary"
            }`}
          >
            <div className="relative">
              <NumberIcon />
              {isMessagesActive ? activeMessagesIcon : messagesIcon}
            </div>
            <span className={`text-xs mt-1 ${
              isMessagesActive ? "text-spotify-green" : "text-white"
            }`}>
              Mensajes
            </span>
          </Link>
          <div className="relative">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="flex items-center justify-center"
            >
              <Image
                src={user.profile_photo}
                width={32}
                height={32}
                className="rounded-full object-fill border-1 border-white"
                alt={user.display_name}
              />
            </button>
            {isMobileMenuOpen && (
              <div className="absolute bottom-full right-0 mb-2 w-48 bg-spotify-light-gray rounded-md shadow-lg py-1 z-50">
                <Link
                  href={`/profile/${user.spotify_id}`}
                  className="block px-4 py-2 text-white hover:bg-spotify-dark-gray"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Mi perfil
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-white hover:bg-spotify-dark-gray flex items-center gap-2"
                >
                  <FiLogOut /> Cerrar sesión
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

// Main Navbar Component
const Navbar = () => {
  return (
    <div className="md:flex md:justify-between md:items-center md:px-6 md:relative">
      <div className="hidden md:block">
      <DesktopNavbar />
      </div>
      <div className="md:hidden">
      <MobileNavbar/>
      </div>
    </div>
  );
};

export default Navbar;