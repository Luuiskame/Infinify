import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const poppins = Poppins({
  weight: ["400", "500", "600", "700"], // Specify the weights you need
  subsets: ["latin"], // Subsets for character support
  variable: "--font-poppins", // Custom variable name
  display: "swap", // Controls the font display behavior
});

export const metadata: Metadata = {
  title: "Infinify - Connect with Music Enthusiasts | Music Social Network",
  description:
    "Find music partners, discover new music, and connect with music enthusiasts. Join our music lovers network for music taste matching and collaboration.",
  keywords: [
    "music social media",
    "find music partners",
    "music taste matching",
    "music enthusiasts community",
    "music interest groups",
    "music recommendation platform",
    "music lovers network",
    "music discovery social network",
    "music sharing community",
    "music collaboration platform",
  ],
  openGraph: {
    title: "Infinify - Connect with Music Enthusiasts",
    description:
      "Find music partners, discover new music, and connect with music enthusiasts. Join our music lovers network for music taste matching and collaboration.",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Infinify - Music Social Network",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Infinify - Connect with Music Enthusiasts",
    description:
      "Find music partners, discover new music, and connect with music enthusiasts. Join our music lovers network for music taste matching and collaboration.",
    images: ["/og-image.png"], 
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  }
};

// redux
import { ReduxProvider } from "@/redux/ReduxProvider";
import HeaderWrapper from "@/components/Header/HeaderWrapper";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${poppins.variable} antialiased bg-spotify-dark-gray`}
      >
        <ReduxProvider>
          <HeaderWrapper />
          {children}
        </ReduxProvider>
      </body>
    </html>
  );
}
