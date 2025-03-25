"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "../../redux/hooks";
import { useGetUserProfileInfoQuery } from "@/services/profileApi";
import { setUser } from "@/slices/userSlice";
import { setChat, setTotalUnreadMessages } from "@/slices/chatSlice";
import { Chats } from "../../types";
import { motion } from "framer-motion";

export default function VerifyInfo() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [tokenExtracted, setTokenExtracted] = useState(false);
  const { data, isLoading, error } = useGetUserProfileInfoQuery(
    {},
    { skip: !tokenExtracted }
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      const hash = window.location.hash.substring(1);
      if (hash) {
        const params = new URLSearchParams(hash);
        const accessToken = params.get("access_token");
        const refreshToken = params.get("refresh_token");
        const expiresIn = params.get("expires_in");

        if (accessToken) {
          localStorage.setItem("spotify_access_token", accessToken);
          localStorage.setItem("spotify_refresh_token", refreshToken || "");
          localStorage.setItem("spotify_expires_in", expiresIn || "");
          window.history.replaceState(null, "", window.location.pathname);
        }
      }
      if (localStorage.getItem("spotify_access_token")) {
        setTokenExtracted(true);
      }
    }
  }, []);

  useEffect(() => {
    if (data && !error) {
      dispatch(setUser(data));
      const newChats = data?.user_chats.map((chat: Chats) => ({
        ...chat,
        chat_messages: [],
        isFetched: false,
      }));
      dispatch(setChat(newChats));
      dispatch(setTotalUnreadMessages(data?.total_unread_messages));
      router.push(`/profile/${data?.user?.spotify_id}`);
    }
  }, [data, error, dispatch, router]);

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-spotify-black text-white">
        <div className="text-center p-6 bg-spotify-light-gray rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Error de conexión</h2>
          <p>{"status" in error ? error.status : error.message}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-spotify-green rounded-full text-black font-medium hover:bg-spotify-green-dark transition"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-spotify-black text-white p-4">
      {/* Logo Spotify animado */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <motion.p
          className="text-5xl md:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-spotify-green to-emerald-300"
          animate={{
            scale: [1, 1.05, 1],
            textShadow: [
              "0 0 8px rgba(29, 185, 84, 0.3)",
              "0 0 16px rgba(29, 185, 84, 0.5)",
              "0 0 8px rgba(29, 185, 84, 0.3)",
            ],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          Infinify
        </motion.p>
      </motion.div>

      {/* Mensaje de carga */}
      {isLoading && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            Preparando tu experiencia
          </h1>
          <p className="text-spotify-light-gray">
            Estamos cargando tus datos...
          </p>
        </motion.div>
      )}
      {/* Barra de progreso animada */}
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: "80%" }}
        transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
        className="h-1 bg-spotify-green rounded-full max-w-md mb-8"
      />

      {/* Iconos de música animados */}
      <div className="flex space-x-2 h-12 items-end">
        {[1, 2, 3, 4, 3, 2, 1].map((height, index) => (
          <motion.div
            key={index}
            animate={{
              height: [height * 8, height * 16, height * 8],
              backgroundColor: ["#1DB954", "#1ED760", "#1DB954"],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: index * 0.1,
            }}
            className="w-3 bg-spotify-green rounded-sm"
          />
        ))}
      </div>

      {/* Texto de copyright */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="text-xs text-spotify-light-gray mt-12"
      >
        Conectando con Spotify...
      </motion.p>
    </div>
  );
}
