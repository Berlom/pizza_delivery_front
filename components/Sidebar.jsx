import React from "react";
import { faHome, faTruck } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import SidebarButtonComponent from "../components/SidebarButtonComponent";

export default function Sidebar() {
  return (
    <div className="bg-red-900 col-span-2 row-span-5 flex flex-col p-4 gap-4">
      <Link href="/">
        <a>
          <SidebarButtonComponent icon={faHome} name="HomePage" />
        </a>
      </Link>
      <Link href="/commands">
        <a>
          <SidebarButtonComponent icon={faTruck} name="commands" />
        </a>
      </Link>
    </div>
  );
}
