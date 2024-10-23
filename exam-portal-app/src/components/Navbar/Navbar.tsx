"use client";
import { signOut, useSession } from "next-auth/react";
import acmLogo from "./acmlogo.svg";
import Image from "next/image";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="bg-[#F4F4F6]  flex justify-between items-center px-2">
      <div className="flex items-center ml-8 ">
        <Image src={acmLogo} alt="ACM Thapar" width={159} height={93} />
      </div>

      <div>
        {session ? (
          <div className="flex items-center justify-center space-x-2 mr-12">
            {session?.user?.image ? (
              <img
                src={session?.user?.image}
                alt={session?.user?.name || "User image"}
                className="w-10 h-10 rounded-full"
              />
            ) : null}
            <span className="font-bold text-xl">{session?.user?.name}</span>

            <div>
                <button
                    onClick={() => signOut()}
                    className="bg-black p-2 text-white font-bold text-xl rounded-lg hover:bg-gray-950"
                >
                    Sign out
                </button>
            </div>
          </div>
        ) : null}
      </div>
    </nav>
  );
}
