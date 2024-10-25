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
      className="flex gap-2 self-center px-9 py-4 mt-8 max-w-full text-xl font-semibold text-white whitespace-nowrap bg-lightblue rounded-2xl shadow-[0px_8px_23px_rgba(173,220,255,1)] w-[180px]"
      onClick={onClick}
      disabled={disabled}
    >
      <span className="grow">Signin Now </span>
      <img
        loading="lazy"
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/1b3f218f4269107c990a1fffcd133ff33dbba696fed536ec177ac34a3f8adbee?placeholderIfAbsent=true&apiKey=3bcad2a00ff743a3a851fc72d0289ec0"
        alt=""
        className="object-contain shrink-0 my-auto aspect-square w-[18px]"
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
        setVisibleIndex(prev => prev + 1);
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
      <div className="bg-white overflow-y-hidden">
        <div className="bg-white shadow-2xl flex justify-center py-0.5 overflow-y-hidden">
          <Image
            src={acmLogo}
            alt="Logo"
            width={130}
            height={500}
            className="z-10"
          />
        </div>
        <div className="flex justify-between">
          <Image src="/acm.png" alt="Logo" width={100} height={1200} />
          <h1 className="text-black font-extrabold text-6xl absolute ml-36 mt-8">
            Apply Now!
          </h1>
          <h1 className="text-black font-extrabold text-6xl ml-12 mt-36">
            <AnimatePresence mode="wait">
              {words.map((word, index) => (
                <motion.span
                  key={word + index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={index <= visibleIndex ? {
                    opacity: 1,
                    y: 0
                  } : {
                    opacity: 0,
                    y: 20
                  }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{
                    duration: 0.3
                  }}
                  className="inline-block mr-2"
                >
                  {word}
                </motion.span>
              ))}
            </AnimatePresence>
          </h1>
          <div className="absolute mt-96 ml-40 mr-2">
            <SubmitButton
              onClick={() => {
                signIn("google");
              }}
              disabled={false}
            />
          </div>
          <Image
            src={frontGroup}
            alt="Logo"
            width={600}
            height={1200}
            className="m-10"
          />
        </div>
      </div>
    </>
  );
}