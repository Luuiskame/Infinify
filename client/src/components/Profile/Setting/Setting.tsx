import { useAppDispatch } from "@/redux/hooks";
import { logOut } from "@/slices/userSlice";
import { useRouter } from "next/navigation";
import React from "react";

const Setting = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleLogout = () => {
    dispatch(logOut());
    router.push("/");
  };

  return (
    <section className="bg-spotify-light-gray flex flex-col mb-24 rounded-lg ">
      <div className="flex flex-col md:flex-row items-start gap-6 px-10 py-12 md:w-[50%]">
        <h2 className="text-3xl font-bold font-sans mt-auto">Settings</h2>
      </div>
      <div className="flex flex-col gap-3 px-10 py-5 font-sans items-start  justify-start md:w-[50%] mb-8">
        <button
          type="button"
          className=" text-spotify-green  rounded-lg hover:bg-spotify-green/40 text-start font-sans font-bold text-lg"
          onClick={handleLogout}
        >
          Sign Out
        </button>
      </div>
    </section>
  );
};

export default Setting;
