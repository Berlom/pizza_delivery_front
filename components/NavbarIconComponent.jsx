import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function NavbarIconComponent({ icon, handler }) {
  return (
    <FontAwesomeIcon
      icon={icon}
      className="transform scale-125 ml-4 p-1 rounded-md hover:bg-white text-white cursor-pointer hover:text-gray-900"
      onClick={handler}
    ></FontAwesomeIcon>
  );
}
