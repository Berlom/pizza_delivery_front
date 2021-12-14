import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function NavbarIconComponent({ icon, handler }) {
  return (
    <FontAwesomeIcon
      icon={icon}
      className="transition-all duration-300 scale-125 ml-4 p-1 rounded-md hover:bg-white text-white cursor-pointer hover:text-[#795F53]  hover:shadow-md hover:shadow-[#34271D]"
      onClick={handler}
    ></FontAwesomeIcon>
  );
}
