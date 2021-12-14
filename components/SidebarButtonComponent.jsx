import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function SidebarButtonComponent({ icon, name }) {
  return (
    <div className="transition-all duration-300 hover:scale-110 flex justify-around px-4 py-2 bg-[#34271D] text-white cursor-pointer rounded-lg select-none hover:bg-white hover:text-[#34271D] items-center hover:shadow-md hover:shadow-[#34271D]">
      <FontAwesomeIcon icon={icon} />
      <button>{name}</button>
    </div>
  );
}
