"use client";
import Loading from "@/components/Loading/Loading";
import { Suspense, useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { searchUsers } from "@/supabase/searchUsers";
import { Userinfo } from "@/types";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ClockIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  addSearchHistory,
  clearSearchHistory,
  removeSearchHistory,
  setSearchHistory,
} from "@/slices/searchHistorySlice";

const PageContent = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<Userinfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const router = useRouter();
  const param = useSearchParams();
  const queryParam = param.get("q");
  const searchInputRef = useRef<HTMLInputElement>(null);

  const dispatch = useAppDispatch();
  const history = useAppSelector((state) => state.searchHistory.searchHistory);

  // Cargar historial al inicio
  useEffect(() => {
    const savedHistory = localStorage.getItem("searchHistory");
    if (savedHistory) {
      dispatch(setSearchHistory(JSON.parse(savedHistory)));
    }
  }, [dispatch]);

  // Manejar clic fuera del input
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node)
      ) {
        setShowHistory(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Efecto principal para manejar búsquedas
  useEffect(() => {
    const executeSearch = async () => {
      if (!searchTerm.trim()) {
        setResults([]);
        return;
      }
      setIsLoading(true);
      try {
        const users = await searchUsers(searchTerm);
        setResults(users);

        if (!param.get("q")) {
          dispatch(addSearchHistory(searchTerm));
        }
      } catch (error) {
        console.error("Search error:", error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    const timer = setTimeout(() => {
      if (searchTerm) {
        executeSearch();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, dispatch, param]);

  // Sincronizar con parámetros de URL
useEffect(() => {
  if (queryParam && !searchTerm) {
    if (queryParam !== searchTerm) {
      setSearchTerm('');
      router.replace('/search');
    }
  }
}, [queryParam, searchTerm, router]);


  //metodo para buscar usuarios
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm)}`);
      setShowHistory(false);
    }
  };


  //metodo para seleccionar un historial de búsqueda
  const handleHistoryClick = (term: string) => {
    setSearchTerm(term);
    setShowHistory(false);
    router.push(`/search?q=${encodeURIComponent(term)}`);
  };

  return (
    <div className="bg-spotify-dark-gray min-h-screen pb-10">
      {/* Search Bar */}
      <div className="flex justify-center items-center px-6 py-4 bg-spotify-light-gray">
        <Link href={`/`}>
          <button className="p-1 rounded-full bg-spotify-green text-black hover:bg-spotify-green-dark">
            <ArrowLeftIcon className="h-6 w-6 text-white hover:text-spotify-green" />
          </button>
        </Link>

        <div className="flex justify-center items-center h-[30%] w-[80%] rounded-xl m-auto relative">
          <form onSubmit={handleSearch} className="relative w-full max-w-xl">
            <input
              ref={searchInputRef}
              type="text"
              name="search"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setShowHistory(true)}
              className="rounded-full px-6 py-3 w-full bg-spotify-light-gray border-2 border-[#63707F] text-white focus:outline-none focus:border-spotify-green"
            />
            <button
              type="submit"
              disabled={!searchTerm.trim()}
              className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full ${
                searchTerm.trim()
                  ? "bg-spotify-green text-black hover:bg-spotify-green-dark"
                  : "bg-gray-500 cursor-not-allowed"
              }`}
              onClick={(e) => {
                if (searchTerm.trim()) {
                  e.preventDefault();
                  setSearchTerm("");
                  router.push(`/search`);
                  searchInputRef.current?.focus();
                }
              }}
            >
              {isLoading ? (
                <Loading />
              ) : searchTerm.trim() ? (
                <XMarkIcon className="w-6 h-6" />
              ) : (
                <ArrowRightIcon className="w-6 h-6" />
              )}
            </button>
          </form>

          {/* Historial de búsquedas */}
          {showHistory && !searchTerm && (
            <div className="absolute top-full left-0 right-0 z-10 bg-spotify-light-gray rounded-xl p-6 mt-2 shadow-lg max-h-60 overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <ClockIcon className="h-5 w-5" />
                  Recent Searches
                </h2>
                {history.length > 0 && (
                  <button
                    onClick={() => dispatch(clearSearchHistory())}
                    className="text-spotify-green text-sm hover:underline"
                  >
                    Clear all
                  </button>
                )}
              </div>

              {history.length > 0 ? (
                <ul className="space-y-3">
                  {history.map((term, index) => (
                    <li
                      key={`${term}-${index}`}
                      className="flex justify-between items-center group hover:bg-[#3e3e3e] p-2 rounded cursor-pointer"
                      onMouseDown={(e) => {
                        if ((e.target as HTMLElement).closest("button")) {
                          return;
                        }
                        console.log(
                          "Término del historial seleccionado:",
                          term
                        );
                        handleHistoryClick(term);
                      }}
                    >
                      <span className="text-white hover:text-spotify-green flex-1 text-left">
                        {term}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          dispatch(removeSearchHistory(term));
                        }}
                        className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-white p-1"
                      >
                        <XMarkIcon className="h-5 w-5" />
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-400">No recent searches</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Resultados de búsqueda */}
      <div className="w-[90%] mx-auto">
        {searchTerm && (
          <>
            {isLoading ? (
              <div className="flex justify-center items-center h-40 mt-4">
                <Loading />
              </div>
            ) : results.length > 0 ? (
              <div className="bg-[#282828] rounded-xl p-6 mt-4">
                <h2 className="text-xl font-bold text-white mb-6">
                  Search Results
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {results.map((user) => (
                    <Link
                      href={`/profile/${user.spotify_id}`}
                      key={user.spotify_id}
                      className="group"
                    >
                      <div className="flex flex-col items-center">
                        <div className="relative">
                          <Image
                            src={user.profile_photo}
                            alt={user.display_name}
                            width={120}
                            height={120}
                            className="rounded-full w-24 h-24 object-cover border-2 border-transparent group-hover:border-spotify-green"
                          />
                        </div>
                        <p className="text-white mt-2 text-center group-hover:text-spotify-green">
                          {user.display_name}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-[#282828] rounded-xl p-6 text-center mt-4">
                <p className="text-white">No results found for {searchTerm}</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

const Page = () => (
  <Suspense fallback={<Loading />}>
    <PageContent />
  </Suspense>
);

export default Page;
