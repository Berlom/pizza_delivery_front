import React from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUpRightFromSquare,
  faCheckCircle,
  faTimesCircle,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

export default function command() {
  const [commands, setCommands] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);

  const acceptOrder = async (id) => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/commande/" + id + "/accept",
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: "Bearer " + localStorage.getItem("sanctum_token"),
          },
        }
      );
    } catch (error) {
      console.log(error);
    }
  };
  const declineOrder = async (id) => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/commande/" + id + "/decline",
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: "Bearer " + localStorage.getItem("sanctum_token"),
          },
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  const deleteCommand = async (id) => {
    try {
      const response = await axios.delete(
        "http://localhost:8000/api/commande/delete/" + id,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: "Bearer " + localStorage.getItem("sanctum_token"),
          },
        }
      );
      console.log(response.data);
      const result = commands.filter((elt) => {
        return elt.id != id;
      });
      setCommands(result);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(async () => {
    setIsAdmin(JSON.parse(localStorage.getItem("user")).role == "admin");
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
    } catch (error) {
      console.log(error);
    }
  }, [setCommands, declineOrder, acceptOrder]);

  return (
    <div className=" grid grid-cols-10 grid-rows-6 h-screen w-screen">
      <Navbar />
      <Sidebar />
      <div className="bg-[#ECE5F0] col-span-8 row-span-5 p-8">
        {isAdmin ? (
          <table className="w-full ">
            <thead>
              <tr>
                <th>Client Name</th>
                <th>Client Number</th>
                <th>Address</th>
                <th>date</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {commands.map((elt) => {
                return (
                  <tr
                    key={elt.id}
                    className="odd:bg-[#795F53] odd:text-[#ECE5F0]"
                  >
                    <td className="text-center">{elt.users.name}</td>
                    <td className="text-center">{elt.users.phone_number}</td>
                    <td className="text-center">
                      {elt.addresses.street +
                        ", " +
                        elt.addresses.state +
                        ", " +
                        elt.addresses.zip_code}
                    </td>
                    <td className="text-center">
                      {new Date(elt.created_at).toDateString()}
                    </td>
                    <td className="text-center">{elt.total}</td>
                    <td className="odd:text-[#ECE5F0]">
                      <FontAwesomeIcon
                        icon={faCheckCircle}
                        className="p-1 text-[#D3635F] cursor-pointer hover:shadow-md shadow-[#D3635F] rounded-md hover:text-[#ECE5F0] hover:bg-[#D3635F]"
                        onClick={() => {
                          acceptOrder(elt.id);
                        }}
                      />
                    </td>
                    <td className="odd:text-[#ECE5F0]">
                      <FontAwesomeIcon
                        icon={faTimesCircle}
                        className="p-1 text-[#D3635F] cursor-pointer hover:shadow-md shadow-[#D3635F] rounded-md hover:text-[#ECE5F0] hover:bg-[#D3635F]"
                        onClick={() => {
                          declineOrder(elt.id);
                        }}
                      />
                    </td>
                    <td className="odd:text-[#ECE5F0]">
                      <Link
                        href={{
                          pathname: "/command/[id]",
                          query: { id: elt.id },
                        }}
                      >
                        <a>
                          <FontAwesomeIcon
                            icon={faArrowUpRightFromSquare}
                            className="p-1 text-[#D3635F] cursor-pointer hover:shadow-md shadow-[#D3635F] rounded-md hover:text-[#ECE5F0] hover:bg-[#D3635F]"
                          />
                        </a>
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <table className="w-full ">
            <thead>
              <tr>
                <th>Orders</th>
                <th>address</th>
                <th>date</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {commands.map((elt) => {
                return (
                  <tr
                    key={elt.id}
                    className="odd:bg-[#795F53] odd:text-[#ECE5F0]"
                  >
                    <td className="text-center">
                      {elt.orders.length < 50
                        ? elt.orders
                        : elt.orders.substring(0, 50) + "..."}
                    </td>
                    <td className="text-center">
                      {elt.addresses.street +
                        ", " +
                        elt.addresses.state +
                        ", " +
                        elt.addresses.zip_code}
                    </td>
                    <td className="text-center">
                      {new Date(elt.created_at).toDateString()}
                    </td>
                    <td className="text-center">{elt.total}</td>
                    <td className="text-center">{elt.status}</td>
                    <td className="odd:text-[#ECE5F0]">
                      <FontAwesomeIcon
                        icon={faTrash}
                        className="p-1 text-[#D3635F] cursor-pointer hover:shadow-md shadow-[#D3635F] rounded-md hover:text-[#ECE5F0] hover:bg-[#D3635F]"
                        onClick={() => {
                          deleteCommand(elt.id);
                        }}
                      />
                    </td>
                    <td className="odd:text-[#ECE5F0]">
                      <Link
                        href={{
                          pathname: "/command/[id]",
                          query: { id: elt.id },
                        }}
                      >
                        <a>
                          <FontAwesomeIcon
                            icon={faArrowUpRightFromSquare}
                            className="p-1 text-[#D3635F] cursor-pointer hover:shadow-md shadow-[#D3635F] rounded-md hover:text-[#ECE5F0] hover:bg-[#D3635F]"
                          />
                        </a>
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
