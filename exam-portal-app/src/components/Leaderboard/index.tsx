"use client"; // This allows client-side rendering in the App Router

import { useState, useEffect } from "react";

// Demo data for the leaderboard
const initialUsers = [
  { name: "Naman", marks: 89, email: "n@n.com" },
  { name: "Naman2", marks: 84, email: "n2@n.com" },
  { name: "John Doe", marks: 90, email: "john@example.com" },
  { name: "Jane Smith", marks: 75, email: "jane@example.com" },
];

type User = {
  name: string;
  marks: number;
  email: string;
};

export default function LeaderboardPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Load the demo users on component mount
  useEffect(() => {
    setUsers(initialUsers);
    setFilteredUsers(initialUsers);
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
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6">Leaderboard</h1>

      {/* Search Input */}
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search by name, email, or marks"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="border border-gray-300 rounded-md px-4 py-2 w-full max-w-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Leaderboard Table */}
      <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-gray-200">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Position</th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Name</th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Email</th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Marks</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user, index) => (
            <tr
              key={user.email}
              className={`border-b ${
                index === 0 ? "bg-blue-100" : "bg-white"
              } hover:bg-gray-50`}
            >
              <td className="px-6 py-4 text-sm font-medium text-gray-900">
                {index + 1}
              </td>
              <td className="px-6 py-4 text-sm text-gray-700">{user.name}</td>
              <td className="px-6 py-4 text-sm text-gray-700">{user.email}</td>
              <td className="px-6 py-4 text-sm text-gray-700">{user.marks}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
