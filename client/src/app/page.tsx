import { Metadata } from "next";
// components
import LandingPage from "../components/LandingPage/LandingPage";

export const metadata: Metadata = {
  title: "Infinify - Discover & Connect with Music Enthusiasts",
  description:
    "Find your perfect music match! Connect with music lovers, discover new artists, and share your musical journey. Join our community of music enthusiasts today.",
  openGraph: {
    title: "Infinify - Your Music Social Network",
    description:
      "Find your perfect music match! Connect with music lovers, discover new artists, and share your musical journey. Join our community of music enthusiasts today.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Infinify - Your Music Social Network",
    description:
      "Find your perfect music match! Connect with music lovers, discover new artists, and share your musical journey. Join our community of music enthusiasts today.",
  },
};

export default function page() {
  return (
    <div className="bg-spotify-dark-gray">
      <LandingPage />
    </div>
  );
}
