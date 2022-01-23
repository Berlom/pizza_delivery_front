import React from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
export default function commandItem() {
  const router = useRouter();
  const [command, setCommand] = useState(null);

  const deleteCommand = async () => {
    try {
      const response = await axios.delete(
        "http://localhost:8000/api/commande/delete/" + router.query.id,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: "Bearer " + localStorage.getItem("sanctum_token"),
          },
        }
      );
      console.log(response.data);
      router.push("/command");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(async () => {
    if (!router.isReady) return;
    try {
      const commandData = await axios.get(
        "http://localhost:8000/api/commande/" + router.query.id,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: "Bearer " + localStorage.getItem("sanctum_token"),
          },
        }
      );
      setCommand(commandData.data);
      console.log(commandData.data);
    } catch (error) {
      console.log(error);
    }
  }, [router.isReady]);

  return (
    <div className=" grid grid-cols-10 grid-rows-6 h-screen w-screen">
      <Navbar />
      <Sidebar />
      <div className="bg-[#ECE5F0] col-span-8 row-span-5 p-8 select-none">
        <div className="flex flex-col justify-around items-center gap-4 ">
          <div className="font-logo text-4xl text-[#D3635F] decoration-wavy underline decoration-[#EEA144]">
            Your Command
          </div>
          <div className="flex px-8 py-2 justify-around w-full">
            <div className="text-[#795F53] font-bold">your order is</div>
            <div className="text-[#795F53]">
              {command
                ? command.orders.split("\r\n").map((elt) => {
                    return <p key={elt}>{elt}</p>;
                  })
                : ""}
            </div>
          </div>
          <div className="flex px-8 py-2 justify-around w-full">
            <div className="text-[#795F53] font-bold">your address</div>
            <div className="text-[#795F53]">
              {command
                ? command.addresses.street +
                  ", " +
                  command.addresses.state +
                  ", " +
                  command.addresses.zip_code
                : ""}
            </div>
          </div>
          <div className="flex px-8 py-2 justify-around w-full">
            <div className="text-[#795F53] font-bold">Date of command</div>
            <div className="text-[#795F53]">
              {command ? new Date(command.created_at).toUTCString() : ""}
            </div>
          </div>
          <div className="flex px-8 py-2 justify-around w-full">
            <div className="text-[#795F53] font-bold">Current Status</div>
            <div className="text-[#795F53]">
              {command ? command.status : ""}
            </div>
          </div>
          <div className="flex px-8 py-2 justify-around w-full">
            <div className="text-[#795F53] font-bold">Total</div>
            <div className="text-[#795F53]">{command ? command.total : ""}</div>
          </div>
          <div className="">
            <button
              className="px-4 py-2 text-[#795F53] font-bold rounded-md ring-1 ring-[#795F53] hover:text-[#ECE5F0] hover:bg-[#795F53] hover:shadow-md hover:shadow-[#34271D]"
              onClick={deleteCommand}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
