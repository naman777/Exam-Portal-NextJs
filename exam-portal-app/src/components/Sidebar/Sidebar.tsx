"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";

const Sidebar = () => {
  const [active, setActive] = useState("Dashboard");
  const router = useRouter();
  const pathname = usePathname();
  
  useEffect(() => {
    if (pathname === "/dashboard") {
      setActive("Dashboard");
    } else if (pathname === "/leaderboard") {
      setActive("Leaderboard");
    }
  }, [pathname]);
  const menuItems = [
    { name: "Dashboard", icon: "/dashBlack.svg", iconWhite: "/dashboard_icon.svg" },
    { name: "Leaderboard", icon: "/Leaderboard_icon.png", iconWhite: "/leaderboardwhite.png" },
  ];

  const handleItemClick = (name: string) => {
    setActive(name);
    router.push(name.toLowerCase());
  };

  return (
    <div className="w-64 h-screen bg-[#F4F4F6] p-4">
      <ul className="space-y-4">
        {menuItems.map((item) => (
          <li key={item.name}>
            <button
              onClick={() => handleItemClick(item.name)}
              className={`flex items-center p-3 w-full text-left rounded-lg ${
                active === item.name
                  ? "bg-[#0BAADD] text-white"
                  : "text-[#575757] hover:bg-gray-200"
              }`}
            >
              <Image
                src={active === item.name ? item.iconWhite : item.icon}
                alt={item.name}
                width={24}
                height={24}
                className="mr-2"
              />
              <span className="font-semibold text-xl">{item.name}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
