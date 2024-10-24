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

const demotests: TestsForUser[] = [
  {
    id: "1",
    name: "Math Test",
    date: new Date(2024, 8, 11),
    testSlots: [
      {
        id: "1",
        timeSlot: new Date(2024, 8, 15, 21, 0),
        endTime: new Date(2024, 8, 15, 22, 0),
        usersAllowed: 100,
        totalMarks: 100,
        usersFilled: 87,
      },
    ],
  },
  {
    id: "2",
    name: "Science Test",
    date: new Date(2024, 8, 18),
    testSlots: [
      {
        id: "2",
        timeSlot: new Date(2024, 8, 18, 21, 0),
        endTime: new Date(2024, 8, 18, 22, 0),
        usersAllowed: 100,
        totalMarks: 100,
        usersFilled: 87,
      },
    ],
  },
];

export default function DashBoard() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [tests, setTests] = useState<TestsForUser[]>(demotests);
  const { data: session } = useSession();
  const email = session?.user?.email;

  useEffect(() => {
    const fetch = async () => {
      if (session && email) {
        setLoading(true);
        const res = await getUserDetails(email);
        const tests = await getTests();
        // setTests(tests as TestsForUser[]);
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
        <div>
          <Timer examDate={user.testSlot!.timeSlot} />
        </div>
      )}

      {user && !user.testApplied && (
        
        <div className="flex h-screen">
        <div className="w-1/7">
          <Sidebar />
        </div>
  
        <div className="w-4/5 p-6">
          <Calendar tests={tests} />
        </div>
      </div>
      )}

      {user && user.testGiven && !user.testSubmitted && (
        <div>
          You Have Submitted the Test
          <button
            className="bg-lightblue p-2 px-4 text-2xl font-bold mt-2"
            onClick={() => {
              router.push("/leaderboard");
            }}
          >
            Check LeaderBoard
          </button>
        </div>
      )}

      {user && user.testSubmitted && (
        <div>
          You Have Submitted the Test
          <button
            className="bg-lightblue p-2 px-4 text-2xl font-bold mt-2"
            onClick={() => {
              router.push("/leaderboard");
            }}
          >
            Check LeaderBoard
          </button>
        </div>
      )}

      {loading && <Loader />}
    </>
  );
}
