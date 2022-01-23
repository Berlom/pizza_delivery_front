import React, { useEffect, useState } from "react";
import { faShoppingCart, faSignOut } from "@fortawesome/free-solid-svg-icons";
import NavbarIconComponent from "../components/NavbarIconComponent";
import { useRouter } from "next/router";
import Link from "next/link";

export default function Navbar() {
  const router = useRouter();
  const [userPoints, setUserPoints] = useState(0);

  useEffect(() => {
    setUserPoints(JSON.parse(localStorage.getItem("user")).points);
  }, []);

  const logout = () => {
    localStorage.removeItem("sanctum_token");
    router.push("/login");
  };
  return (
    <div className="shadow-md shadow-[#795F53] z-10 bg-[#795F53] row-span-1 col-span-full px-8 py-4 flex justify-between items-center ">
      <div className="">
        <img
          src="/logo.png"
          alt="logo placeholder"
          className="rounded-md max-h-20 cursor-pointer ml-4 hover:scale-110 transition-all duration-300 select-none"
        />
      </div>
      <div className="font-logo text-white text-6xl cursor-pointer select-none hover:scale-110 transition-all duration-300">
        Pizza Delivery
      </div>
      <div className="flex gap-2 flex-row-reverse">
        <NavbarIconComponent icon={faSignOut} handler={logout} />
        <Link href="/cart">
          <a>
            <NavbarIconComponent icon={faShoppingCart} />
          </a>
        </Link>
        <div className="transition-all duration-300 scale-125 ml-4 py-1 px-2 rounded-md hover:bg-white text-white cursor-pointer hover:text-[#795F53]  hover:shadow-md hover:shadow-[#34271D]">
          {userPoints ?? 0}
        </div>
      </div>
    </div>
  );
}
