'use client';

import ConnectHeader from '@/components/Connect/ConnectHeader';
import ConnectCard from '@/components/Connect/ConnectCard';
import { useState } from 'react';

interface UserResponse {
  songs: string[];
  artists: string[];
  genres: string[];
  country: string;
  display_name: string;
  profile_photo: string;
}

// Initial fake user data for the random filter
const fakeUsers = [
  {
    country: 'Honduras',
    display_name: 'Luuiskame',
    profile_photo: 'https://cdn-icons-png.flaticon.com/512/3135/3135768.png',
    genres: ['rock', 'pop', 'alternative rock'],
    artists: ['The Beatles', 'Coldplay', 'The Strokes', 'Radiohead', 'Adele', 'The Weeknd', 'Taylor Swift', 'Ariana Grande', 'Drake', 'Nirvana'],
    songs: ['Hey Jude', 'Yellow', 'Reptilia', 'Creep', 'Rolling in the Deep', 'Blinding Lights', 'Love Story', '7 rings', 'Gods Plan', 'Smells Like Teen Spirit'],
  },
  {
    country: 'United States',
    display_name: 'John Doe',
    profile_photo: 'https://via.placeholder.com/150',
    genres: ['hip hop', 'rap', 'pop'],
    artists: ['Drake', 'Kanye West', 'The Weeknd', 'Kendrick Lamar', 'Jay-Z', 'Travis Scott', 'Post Malone', 'Cardi B', 'Lil Wayne', 'Future'],
    songs: ['God\'s Plan', 'Stronger', 'Blinding Lights', 'HUMBLE.', 'Empire State of Mind', 'SICKO MODE', 'Sunflower', 'WAP', 'Lollipop', 'Mask Off'],
  },
  {
    country: 'Canada',
    display_name: 'Jane Smith',
    profile_photo: 'https://cdn-icons-png.flaticon.com/512/219/219969.png',
    genres: ['pop', 'indie pop', 'dance'],
    artists: ['Taylor Swift', 'Adele', 'Billie Eilish', 'Lorde', 'Dua Lipa', 'Ariana Grande', 'The Weeknd', 'Ed Sheeran', 'Sam Smith', 'Halsey'],
    songs: ['Love Story', 'Someone Like You', 'bad guy', 'Royals', 'Levitating', '7 rings', 'Blinding Lights', 'Shape of You', 'Stay with Me', 'Without Me'],
  },
  {
    country: 'Germany',
    display_name: 'Hans Müller',
    profile_photo: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
    genres: ['electronic', 'techno', 'house'],
    artists: ['Daft Punk', 'David Guetta', 'Calvin Harris', 'Deadmau5', 'Avicii', 'Tiesto', 'Marshmello', 'Skrillex', 'Martin Garrix', 'The Chainsmokers'],
    songs: ['One More Time', 'Titanium', 'Summer', 'Strobe', 'Wake Me Up', 'Red Lights', 'Alone', 'Bangarang', 'Animals', 'Closer'],
  },
];


// Fake users for the "similar taste" filter
const fakeUsers2 = [
  {
    country: 'Brazil',
    display_name: 'Ana Souza',
    profile_photo: 'https://cdn-icons-png.flaticon.com/512/145/145849.png',
  },
  {
    country: 'France',
    display_name: 'Pierre Dupont',
    profile_photo: 'https://cdn-icons-png.flaticon.com/512/236/236831.png',
  },
  {
    country: 'Mexico',
    display_name: 'Carlos Garcia',
    profile_photo: 'https://cdn-icons-png.flaticon.com/512/219/219986.png',
  },
];

// Fake users for the "random match" filter
const fakeUsers3 = [
  {
    country: 'Italy',
    display_name: 'Giovanni Rossi',
    profile_photo: 'https://cdn-icons-png.flaticon.com/512/2922/2922510.png',
  },
  {
    country: 'Japan',
    display_name: 'Sakura Tanaka',
    profile_photo: 'https://cdn-icons-png.flaticon.com/512/2922/2922549.png',
  },
  {
    country: 'Spain',
    display_name: 'Maria Gomez',
    profile_photo: 'https://cdn-icons-png.flaticon.com/512/2922/2922656.png',
  },
];

export default function Page() {
  const [data, setCurrentData] = useState<UserResponse[]>(fakeUsers);

  // Function to handle filter changes
  const fetchFilter = (filterType: string) => {
    switch (filterType) {
      case 'random':
        setCurrentData(fakeUsers);
        break;
      case 'taste':
        setCurrentData(fakeUsers2);
        break;
      case 'match':
        setCurrentData(fakeUsers3);
        break;
      default:
        setCurrentData([]); // Empty if no valid filter is provided
        break;
    }
  };

  return (
    <div className="bg-spotify-dark-gray w-[90%] mx-auto md:w-[100%] md:ml-5 h-[100dvh] flex flex-col gap-[1rem]">
      <ConnectHeader fetchFilter={fetchFilter} />
      {/* Rendering users based on selected filter */}
      {data.map((user) => (
        <ConnectCard
          key={user.display_name}
          country={user.country}
          display_name={user.display_name}
          profile_photo={user.profile_photo}
          favGenres={user.genres}
          favArtists={user.artists}
          favSongs={user.songs}
        />
      ))}
    </div>
  );
}

