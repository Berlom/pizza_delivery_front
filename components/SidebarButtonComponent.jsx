import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function SidebarButtonComponent({ icon, name }) {
  return (
    <div className="flex justify-around px-4 py-2 bg-red-900 text-white cursor-pointer rounded-lg select-none hover:bg-white hover:text-red-900 items-center">
      <FontAwesomeIcon icon={icon} />
      <button>{name}</button>
    </div>
  );
}
