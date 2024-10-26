"use client"; // This allows client-side rendering in the App Router

import Sidebar from "@/components/Sidebar/Sidebar";
import { useState, useEffect } from "react";
import searchicon from "/public/search.svg"
import Image from "next/image";
import { getLeaderboard } from "@/actions/user";
import Loader from "@/components/ui/loader";
// Demo data for the leaderboard

type User = {
  name: string;
  marks: number;
  email: string;
};

export default function LeaderboardPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    const fetch = async () =>{
        setLoading(true);
        const res = await getLeaderboard();
        setLoading(false);
        if (res.success) {
            //@ts-ignore
            const sortedUsers = res.users.sort((a, b) => b.marks - a.marks);
            //@ts-ignore
            setUsers(sortedUsers);
            //@ts-ignore
            setFilteredUsers(sortedUsers);
        }
        
    }
    fetch();
  }, []);

  // Handle search filtering logic
  const handleSearch = (query: string) => {
    setSearchQuery(query);

    const lowerQuery = query.toLowerCase();
    const filtered = users.filter(
      (user) =>
        user.name.toLowerCase().includes(lowerQuery) ||
        user.email.toLowerCase().includes(lowerQuery) ||
        user.marks.toString().includes(lowerQuery)
    );

    setFilteredUsers(filtered);
  };

  return (
    <div className="flex ">
      <div className="w-1/5">
        <Sidebar/>
      </div>
      <div className="w-4/5 bg-white p-8 rounded-2xl h-auto shadow-2xl">
        <h1 className="text-3xl font-bold mb-6">Leaderboard</h1>

        <div className="flex justify-between items-center mb-4">
            <div className="text-xl font-bold">
            All People
            </div>
            <div className="relative w-full max-w-md">
            <input
                type="text"
                placeholder="Search by name, email, or marks"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 bg-[#F4F4F6] pl-10"
            />
            <Image
                src={searchicon}
                alt="Search"
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
                width={20}
                height={20}
            />
            </div>
        </div>

        <table className="w-full bg-gray shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-[#505050]">
                Position
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-[#505050]">
                Name
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-[#505050]">
                Email
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-[#505050]">
                Marks
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user, index) => (
              <tr
                key={user.email}
                className={`border-b border-b-[#D9D9D9] ${
                  index === 0 ? "bg-[#0BAADD2E]" : "bg-white"
                } hover:bg-gray-50`}
              >
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {index + 1}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">{user.name}</td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {user.email}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {user.marks}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {
        loading && (
            <Loader/>
        )
      }
    </div>
  );
}
