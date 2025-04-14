import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRightIcon } from "@heroicons/react/24/solid";
import Loading from "../Loading/Loading";
import { useSearchUsersQuery } from "@/services/getUsersApi";
const SearchComponent = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [triggerSearch, setTriggerSearch] = useState(false);
  const router = useRouter();

  const { isFetching } = useSearchUsersQuery(
    { q: searchTerm },
    { skip: !triggerSearch }
  );

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm) {
      setTriggerSearch(true);
      router.push(`/search?q=${searchTerm}`);
    }
  };

  return (
    <div className="relative">
      <form onSubmit={handleSearch}>
        <input
          type="text"
          name="search"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="rounded-full px-4 py-2 bg-spotify-light-gray border-2 border-[#63707F] text-white"
        />
        {searchTerm && (
          <button
            type="submit"
            className={`absolute right-2 top-1/2 transform -translate-y-1/2 px-2 py-1 bg-spotify-green rounded-full text-black hover:bg-spotify-green-dark ${
              isFetching && "px-3 py-1"
            }`}
            disabled={isFetching}
          >
            {isFetching ? (
              <Loading />
            ) : (
              <ArrowRightIcon className="w-6 h-6 text-xl font-bold" />
            )}
          </button>
        )}
      </form>
    </div>
  );
};

export default SearchComponent;