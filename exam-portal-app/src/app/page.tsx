"use client";
import Dashboard from "@/components/Home/Auth";
import Image from "next/image";
import acmLogo from "/public/acmlogo2.svg";
import frontGroup from "/public/smart-people.svg";
import plus from "/public/plus.svg";
import { useEffect, useState } from "react";
import { isUserExist } from "@/actions/user";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const SubmitButton = ({
  onClick,
  disabled,
}: {
  onClick: () => void;
  disabled: boolean;
}) => {
  return (
    <button
      type="submit"
      // className="flex gap-2 content-center self-center px-9 py-4 mt-8 max-w-full text-xl font-semibold text-white whitespace-nowrap bg-lightblue rounded-2xl shadow-[0px_8px_23px_rgba(173,220,255,1)] w-[180px]"
      style={{
        backgroundColor: "#0baadd",
        color: "white",
        padding: "0.75rem 1.5rem",
        borderRadius: "1rem",
        boxShadow: "0px 8px 23px rgba(173, 220, 255, 1)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.5rem",
      }}
      onClick={onClick}
      disabled={disabled}
    >
      <span
        className="grow"
        style={{
          fontSize: "1.25rem",
          fontWeight: "bold",
          whiteSpace: "nowrap",
          alignSelf: "center",
        }}
      >
        Signin Now{" "}
      </span>
      <img
        loading="lazy"
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/1b3f218f4269107c990a1fffcd133ff33dbba696fed536ec177ac34a3f8adbee?placeholderIfAbsent=true&apiKey=3bcad2a00ff743a3a851fc72d0289ec0"
        alt=""
        className="mt-1"
      />
    </button>
  );
};

const LeaderboardButton = ({
  onClick,
  disabled,
}: {
  onClick: () => void;
  disabled: boolean;
}) => {
  return (
    <button
      type="submit"
      // className="flex gap-2 content-center self-center px-9 py-4 mt-8 max-w-full text-xl font-semibold text-white whitespace-nowrap bg-lightblue rounded-2xl shadow-[0px_8px_23px_rgba(173,220,255,1)] w-[180px]"
      style={{
        backgroundColor: "#0baadd",
        color: "white",
        padding: "0.75rem 1.5rem",
        borderRadius: "1rem",
        boxShadow: "0px 8px 23px rgba(173, 220, 255, 1)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.5rem",
      }}
      onClick={onClick}
      disabled={disabled}
    >
      <span
        className="grow"
        style={{
          fontSize: "1.25rem",
          fontWeight: "bold",
          whiteSpace: "nowrap",
          alignSelf: "center",
        }}
      >
        Show Leaderboard{" "}
      </span>
      <img
        loading="lazy"
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/1b3f218f4269107c990a1fffcd133ff33dbba696fed536ec177ac34a3f8adbee?placeholderIfAbsent=true&apiKey=3bcad2a00ff743a3a851fc72d0289ec0"
        alt=""
        className="mt-1"
      />
    </button>
  );
};

export default function Page() {
  const { data: session } = useSession();
  const email = session?.user?.email;
  const router = useRouter();
  const [visibleIndex, setVisibleIndex] = useState(-1);
  const words = "First year's recruitment tests are live now...".split(" ");

  useEffect(() => {
    const checkUserExistence = async () => {
      if (session && email) {
        const res = await isUserExist(email);
        console.log(res);
        if (!res) {
          router.push("/signup");
        } else {
          router.push("/dashboard");
        }
      }
    };
    checkUserExistence();
  }, [session, email, router]);

  useEffect(() => {
    if (visibleIndex < words.length - 1) {
      const timer = setTimeout(() => {
        setVisibleIndex((prev) => prev + 1);
      }, 500); // Adjust timing as needed
      return () => clearTimeout(timer);
    } else {
      // Reset animation after all words are shown
      const resetTimer = setTimeout(() => {
        setVisibleIndex(-1);
      }, 2000); // Wait before resetting
      return () => clearTimeout(resetTimer);
    }
  }, [visibleIndex, words.length]);

  return (
    <>
      <div className="bg-white flex  overflow-y-hidden">
        <div className="bg-white absolute shadow-2xl flex justify-center py-0.5 overflow-y-hidden w-full">
          <Image
            src={acmLogo}
            alt="Logo"
            width={130}
            height={500}
            className="z-10"
          />
        </div>
        <div className="flex">
          <Image src="/acm.png" alt="Logo" width={170} height={1200} />
          <div className="flex flex-col  gap-12 my-32">
            <h1 className="text-black font-bold text-6xl ml-4">
              Apply Now!
            </h1>
            <h1 className="text-black w-fit font-bold text-6xl ml-4">
              <AnimatePresence mode="wait">
                {words.map((word, index) => (
                  <motion.span
                    key={word + index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={
                      index <= visibleIndex
                        ? {
                            opacity: 1,
                            y: 0,
                          }
                        : {
                            opacity: 0,
                            y: 20,
                          }
                    }
                    exit={{ opacity: 0, y: -20 }}
                    transition={{
                      duration: 0.3,
                    }}
                    className="inline-block mr-2"
                  >
                    {word}
                  </motion.span>
                ))}
              </AnimatePresence>
            </h1>
            <div className="sm:flex gap-8 flex flex-col">

            <div className="mt-12 ml-4">
              <SubmitButton
                onClick={() => {
                  signIn("google");
                }}
                disabled={false}
                />
            </div>
            <div className=" ">
              <LeaderboardButton onClick={() => router.push("/leaderboard")} disabled={false} />
            </div>
                </div>
          </div>
          <Image
            src={frontGroup}
            alt="Logo"
            width={600}
            height={1200}
            className="mt-24 m-10"
          />
        </div>
      </div>
    </>
  );
}
