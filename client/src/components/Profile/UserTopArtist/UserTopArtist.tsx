import { Artist, Userinfo } from "@/types";
import Image from "next/image";
import Link from "next/link";

type Props = {
  user : Userinfo | null;
};

const UserTopArtist = ({user} : Props) => {
 
  const topArtist = user?.user_top_artist;

  return (
    <div className=" w-[100%] md:w-[50%]">
      <h2 className="text-3xl text-white font-bold font-sans">Top Artist</h2>
      <div className="bg-spotify-light-gray mt-4 rounded-lg mb-10">
        <div>
          {topArtist && topArtist && topArtist.length > 0 ? (
             topArtist.map((artist: Artist , index: number) => (
              <div key={artist?.artist_id} className="flex items-center gap-3 p-4 rounded-lg">
                <p className="text-[#63707F]">{index + 1}</p>
                {artist?.artist_photo ? (
                    <Image width={50} height={50} src={artist?.artist_photo} alt={artist?.artist_name} className="rounded-full object-fill  border-white"/>
                ) : null}
                <Link href={artist?.artist_uri}><h3 className="hover:text-spotify-green">{artist?.artist_name}</h3></Link>
              </div>
            ))
          ) : (
            <p>No highlight Artist avalaible for this user.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserTopArtist;
