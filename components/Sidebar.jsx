import React, { useEffect, useState } from "react";
import {
  faAdd,
  faBacon,
  faHamburger,
  faHome,
  faTruck,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import SidebarButtonComponent from "../components/SidebarButtonComponent";

export default function Sidebar() {
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    setIsAdmin(JSON.parse(localStorage.getItem("user")).role === "admin");
  }, []);

  return (
    <div className="shadow-md shadow-[#34271D] z-20 bg-[#34271D] col-span-2 row-span-5 flex flex-col p-4 gap-4">
      <Link href="/">
        <a>
          <SidebarButtonComponent icon={faHome} name="HomePage" />
        </a>
      </Link>
      <Link href="/command">
        <a>
          <SidebarButtonComponent icon={faTruck} name="Commandes" />
        </a>
      </Link>
      <Link href="/cart/add">
        <a>
          <SidebarButtonComponent icon={faAdd} name="Add to cart" />
        </a>
      </Link>
      {isAdmin ? (
        <Link href="/menu">
          <a>
            <SidebarButtonComponent icon={faHamburger} name="Manage Menus" />
          </a>
        </Link>
      ) : (
        ""
      )}
      {isAdmin ? (
        <Link href="/ingredient">
          <a>
            <SidebarButtonComponent icon={faBacon} name="Manage Ingredients" />
          </a>
        </Link>
      ) : (
        ""
      )}
    </div>
  );
}
