import React from "react";
import { faShoppingCart, faSignOut } from "@fortawesome/free-solid-svg-icons";
import NavbarIconComponent from "../components/NavbarIconComponent";
import { useRouter } from "next/router";

export default function Navbar() {
  const router = useRouter();
  const logout = () => {
    localStorage.removeItem("sanctum_token");
    router.push("/login");
  };
  return (
    <div className="bg-gray-900 row-span-1 col-span-full px-8 py-4 flex justify-between items-center">
      <div className="">
        <img
          src="logo.png"
          alt=""
          className="rounded-md max-h-20 cursor-pointer ml-4"
        />
      </div>
      <div className="font-logo text-white text-6xl cursor-pointer select-none">
        Pizza Delivery
      </div>
      <div className="flex gap-2 flex-row-reverse">
        <NavbarIconComponent icon={faSignOut} handler={logout} />
        <NavbarIconComponent icon={faShoppingCart} />
      </div>
    </div>
  );
}
