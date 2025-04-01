
"use client";
import { useAppSelector } from "@/redux/hooks";
import LoginBtn from "@/shared/LoginBtn";
import React, { lazy, Suspense } from "react";
// Componentes principales


// Lazy loading para componentes secundarios
const MostListened = lazy(() => import("./components/MostListened"));
const GenereOfTheDay = lazy(() => import("./components/GenereOfTheDay"));
const ArtisOfTheDay = lazy(() => import("./components/songOfTheDay"));
const RecentlyJoined = lazy(() => import("./components/RecentlyJoined"))

export default function LandingPage() {

  const user = useAppSelector((state) => state.userReducer.user);

  return (
    <main className="w-[90%] mx-auto max-w-[1150px] h-[100%]">
      <header className="pt-6 pb-4 flex flex-col gap-6 max-w-md mx-auto">
        <h1
          className="text-spotify-green font-bold text-4xl text-center leading-tight text-balance"
        >
          Discover Your Next
          <span className="block">Music Partner</span>
        </h1>

        {!user && <LoginBtn />}
      </header>

      <section className="mt-8">
        <h2 className="text-center font-semibold text-[1.4rem]">
          Popular Today
        </h2>
        <div className="mt-4 flex flex-col justify-center gap-4 md:flex-row md:justify-start w-full">
          <Suspense
            fallback={
              <div className="h-48 w-full bg-[#121212] animate-pulse rounded-lg"></div>
            }
          >
            <MostListened />
          </Suspense>
          <Suspense
            fallback={
              <div className="h-48 w-full bg-[#121212] animate-pulse rounded-lg"></div>
            }
          >
            <ArtisOfTheDay />
          </Suspense>
        </div>
      </section>

      <section className="bg-spotify-light-gray mt-4 rounded-lg w-full p-2 flex flex-col md:flex-row justify-center items-center">
        <Suspense
          fallback={
            <div className="h-32 w-full bg-[#121212] animate-pulse rounded-lg"></div>
          }
        >
          <GenereOfTheDay />
        </Suspense>
      </section>

      <section className="bg-spotify-light-gray mt-4 mb-28 md:mb-4 rounded-lg w-full p-6">
        <Suspense
          fallback={
            <div className="h-48 w-full bg-[#121212] animate-pulse rounded-lg"></div>
          }
        >
          <RecentlyJoined />
        </Suspense>
      </section>
    </main>
  );
}
