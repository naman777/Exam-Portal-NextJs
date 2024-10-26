"use client";
import { getTests, getUserDetails } from "@/actions/user";
import Calendar from "@/components/Dashboard/Calender";
import Rules from "@/components/Dashboard/Rules";
import Timer from "@/components/Dashboard/Timer";
import Sidebar from "@/components/Sidebar/Sidebar";
import Loader from "@/components/ui/loader";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import thankyou from "/public/thankyou.svg";
import insta from "/public/instagram.svg";
import github from "/public/github.svg";
import linkedin from "/public/linkedin.svg";
import Image from "next/image";
import Link from "next/link";


interface User {
  id: string;
  email: string;
  name?: string | null;
  rollNo?: string | null;
  branch?: string | null;
  phone?: string | null;
  imageurl?: string | null;
  signUp: boolean;
  testSlotId?: string | null;
  testSlot?: TestSlot | null;
  testApplied: boolean;
  testGiven: boolean;
  testSubmitted: boolean;
  marks: number;
  createdAt: Date;
}

export interface TestSlot {
  id: string;
  timeSlot: Date;
  endTime: Date;
}

export interface TestSlotforTest {
  id: string;
  timeSlot: Date;
  endTime: Date;
  usersAllowed: number;
  totalMarks: number;
  usersFilled: number;
}

export interface TestsForUser {
  id: string;
  name: string;
  date: Date;
  testSlots: TestSlotforTest[];
}

// const demotests: TestsForUser[] = [
//   {
//     id: "1",
//     name: "Math Test",
//     date: new Date(2024, 8, 11),
//     testSlots: [
//       {
//         id: "1",
//         timeSlot: new Date(2024, 8, 15, 21, 0),
//         endTime: new Date(2024, 8, 15, 22, 0),
//         usersAllowed: 100,
//         totalMarks: 100,
//         usersFilled: 87,
//       },
//     ],
//   },
//   {
//     id: "2",
//     name: "Science Test",
//     date: new Date(2024, 8, 18),
//     testSlots: [
//       {
//         id: "2",
//         timeSlot: new Date(2024, 8, 18, 21, 0),
//         endTime: new Date(2024, 8, 18, 22, 0),
//         usersAllowed: 100,
//         totalMarks: 100,
//         usersFilled: 87,
//       },
//     ],
//   },
// ];

export default function DashBoard() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [tests, setTests] = useState<TestsForUser[]>([]);
  const { data: session } = useSession();
  const email = session?.user?.email;

  useEffect(() => {
    const fetch = async () => {
      if (session && email) {
        setLoading(true);
        const res = await getUserDetails(email);
        const tests = await getTests();
        setTests(tests as TestsForUser[]);
        setUser(res as User);
        setLoading(false);
      } else {
        router.push("/");
      }
    };
    fetch();
  }, [session, email]);

  return (
    <>
      {user && user.testApplied && !user.testGiven && !user.testSubmitted && (
        <div className="flex flex-col justify-center items-center ">
          <div className="w-1/2">
            <Timer examDate={new Date(user.testSlot!.timeSlot)} />
          </div>
          <div className="w-5/6">
            <Rules />
          </div>
        </div>
      )}

      {user && !user.testApplied && (
        <div className="flex h-screen">
          <div className="w-1/7 mt-5">
            <Sidebar />
          </div>
          <div className="w-4/5 p-6">
            <Calendar tests={tests} />
          </div>
        </div>
      )}

      {user && user.testSubmitted && (
        <div className="flex ">
          <div>
            <Sidebar />
          </div>
          <div className="bg-lightblue  w-4/5 ml-6 rounded-2xl shadow-2xl flex items-center justify-center">
            <div className="bg-white w-1/2 flex flex-col justify-center items-center p-20 rounded-2xl shadow-2xl gap-8">
            <div className="flex flex-col gap-4 items-center justify-center">

              <Image src={thankyou} alt="thankyou" width={100} height={100} />
              <h1 className="text-4xl font-bold">Thank You.</h1>
            </div>
              <h1 className="text-sm text-[#666666] font-medium text-center">
                Your test has been submitted and we will be reaching you shortly
                for the further recruitment process.
              </h1>

              <Link href="/leaderboard" className="px-2 py-1 bg-white border-2 border-lightblue text-lightblue font-medium rounded-lg">
                Checkout Leaderboard
              </Link>

              <div className="flex flex-col gap-4 justify-center items-center">
                <h1 className="font-bold text-3xl">Follow Us</h1>
                <div className="flex gap-14">
                  <Link href="https://www.instagram.com/acmthapar/" target="_blank" rel="noopener noreferrer" >
                  
                  <Image src={insta} alt="insta" width={30} height={30} />
                  </Link>
                  <Link href="https://github.com/ACM-Thapar" target="_blank" rel="noopener noreferrer">
                  
                  <Image src={github} alt="github" width={30} height={30} /> 
                  </Link>
                  <Link href="https://www.linkedin.com/company/thapar-acm-student-chapter/mycompany/" target="_blank" rel="noopener noreferrer">
                  <Image src={linkedin} alt="linkedin" width={30} height={30} />
                  
                  </Link>
                </div>
              </div>
              
            </div>
          </div>
        </div>
      )}

      {loading && <Loader />}
    </>
  );
}
