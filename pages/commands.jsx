import React from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useEffect, useState } from "react";
import axios from "axios";

export default function commands() {
  const [commands, setCommands] = useState([]);

  useEffect(async () => {
    try {
      const commandsData = await axios.get(
        "http://localhost:8000/api/commande",
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: "Bearer " + localStorage.getItem("sanctum_token"),
          },
        }
      );
      setCommands(commandsData.data);
      console.log(commandsData.data);
    } catch (err) {
      console.log(err);
    }
  }, []);
  return (
    <div className=" grid grid-cols-10 grid-rows-6 h-screen w-screen">
      <Navbar />
      <Sidebar />
      <div className="bg-blue-900 col-span-8 row-span-5 p-8">
        <div className="flex flex-col gap-2">
          {commands.map((elt) => {
            return (
              <div
                key={elt.id}
                className="flex justify-between items-center content-center text-white"
              >
                <div className="">
                  {elt.orders.length < 30
                    ? elt.orders
                    : elt.orders.substring(0, 30) + "..."}
                </div>
                <div className="">{elt.total}</div>
                <div className="">{elt.addresses.street}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
