import Image from "next/image";
import { useState, useEffect } from "react";
import { useGetRecentUsersQuery } from "@/services/getUsersApi";
import { Userinfo } from "@/types";

// Component to display each user's data
function CardUserRJ({ user }: { user: Userinfo }) {
  return (
    <li className="text-white text-base">
      <a href={`/profile/${user.spotify_id}`} className="flex flex-row items-center justify-center gap-x-2">
        <Image
          src={user.profile_photo || "/userImage.png"}
          width={24}
          height={24}
          className="rounded-full w-6 h-6 object-contain"
          alt={user.display_name || "user"}
        />
        <span>{user.display_name}</span>
      </a>
    </li>
  );
}

// Main Component
export default function RecentlyJoined() {
  const [users, setUsers] = useState<Userinfo[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Solo pasamos el parámetro limit, que es el único requerido
  const {
    data,
    isLoading,
    error,
    isError
  } = useGetRecentUsersQuery({ limit: 8 });

  
  useEffect(() => {
    if (data && !isError) {
      
      if (Array.isArray(data)) {
        setUsers(data);
      } else if (data.users && Array.isArray(data.users)) {
        setUsers(data.users);
      } else {
        
        try {
          const extractedUsers = Object.values(data).filter(
            item => item && typeof item === 'object' && 'id' in item
          );
          setUsers(extractedUsers as Userinfo[]);
        } catch (e) {
          console.error("Error processing user data:", e);
          setUsers([]);
        }
      }
    } else if (isError) {
      console.error("Error loading users:", error);
      setErrorMessage("Error loading recently joined users.");
      setUsers([]);
    }
  }, [data, error, isError]);

  // Show loading state
  if (isLoading) {
    return <p className="text-white">Loading...</p>;
  }

  return (
    <>
      <h2 className="font-extrabold text-2xl md:text-3xl text-center md:text-left">
        Recently Joined
      </h2>

      {errorMessage ? (
        <p className="text-red-500 mt-4">{errorMessage}</p>
      ) : (
        <ul className="flex flex-wrap gap-4 mt-8 justify-center md:justify-start">
          {users.length === 0 ? (
            <p className="text-white">No recently joined users found.</p>
          ) : (
            users.map((user) => <CardUserRJ user={user} key={user.id} />)
          )}
        </ul>
      )}
    </>
  );
}