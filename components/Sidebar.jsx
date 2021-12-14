import React from "react";
import { faHome, faTruck } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import SidebarButtonComponent from "../components/SidebarButtonComponent";

export default function Sidebar() {
  return (
    <div className="shadow-md shadow-[#34271D] z-20 bg-[#34271D] col-span-2 row-span-5 flex flex-col p-4 gap-4">
      <Link href="/">
        <a>
          <SidebarButtonComponent icon={faHome} name="HomePage" />
        </a>
      </Link>
      <Link href="/">
        <a>
          <SidebarButtonComponent icon={faTruck} name="Commandes" />
        </a>
      </Link>
    </div>
  );
}
