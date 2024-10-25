"use client";
import { useEffect } from "react";
import { isUserExist } from "@/actions/user";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const Dashboard = () => {
  const { data: session } = useSession();
  const email = session?.user?.email;
  const router = useRouter();

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

  return (
    <div className="">
      {session ? (
        <div>
          <h1>Dashboard</h1>
          <p>Welcome {session?.user?.name}</p>
          {JSON.stringify(session)}
        </div>
      ) : (
        <div>
          <h1>Dashboard</h1>
          <button
            className="bg-black p-2 text-white font-bold text-xl rounded-lg hover:bg-gray-950"
            onClick={() => signIn("google")}
          >
            Sign in with Google
          </button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
