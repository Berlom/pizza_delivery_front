import React from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

export default function commands() {
  const [commands, setCommands] = useState([]);

  useEffect(async () => {
    try {
      const commandsData = await axios.get("http://localhost:8000/api/cart", {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: "Bearer " + localStorage.getItem("sanctum_token"),
        },
      });
      setCommands(commandsData.data);
      console.log(commandsData.data);
    } catch (err) {
      console.log(err);
    }
  }, [setCommands]);

  const deleteFromCart = async (id) => {
    try {
      const response = await axios.delete(
        "http://localhost:8000/api/cart/delete/" + id,
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
  return (
    <div className=" grid grid-cols-10 grid-rows-6 h-screen w-screen">
      <Navbar />
      <Sidebar />
      <div className="bg-blue-900 col-span-8 row-span-5 p-8">
        <div className="flex flex-col gap-2">
          <table>
            <thead>
              <tr>
                <th>Order</th>
                <th>Quantity</th>
                <th>Unit Price</th>
              </tr>
            </thead>
            <tbody>
              {commands.map((elt) => {
                return (
                  <tr key={elt.id}>
                    <td className="">
                      {elt.order.length < 30
                        ? elt.order
                        : elt.order.substring(0, 30) + "..."}
                    </td>
                    <td className="">{elt.quantity}</td>
                    <td className="">{elt.unit_price}</td>
                    <td>
                      <FontAwesomeIcon
                        icon={faTrash}
                        className="p-1 text-teal-500 cursor-pointer shadow-md shadow-teal-600 rounded-md hover:text-white hover:bg-teal-500"
                        onClick={() => {
                          deleteFromCart(elt.id);
                        }}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
