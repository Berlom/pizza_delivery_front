import React from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUpRightFromSquare,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

export default function carts() {
  const [carts, setCarts] = useState([]);

  useEffect(async () => {
    try {
      const cartsData = await axios.get("http://localhost:8000/api/cart", {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: "Bearer " + localStorage.getItem("sanctum_token"),
        },
      });
      setCarts(cartsData.data);
      console.log(cartsData.data);
    } catch (err) {
      console.log(err);
    }
  }, [setCarts]);

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
      const result = carts.filter((elt) => {
        return elt.id != id;
      });
      setCarts(result);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className=" grid grid-cols-10 grid-rows-6 h-screen w-screen">
      <Navbar />
      <Sidebar />
      <div className="bg-[#ECE5F0] col-span-8 row-span-5 p-8">
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
              {carts.map((elt) => {
                return (
                  <tr
                    key={elt.id}
                    className="odd:bg-[#795F53] odd:text-[#ECE5F0]"
                  >
                    <td className="text-center">
                      {elt.order.length < 50
                        ? elt.order
                        : elt.order.substring(0, 50) + "..."}
                    </td>
                    <td className="text-center">{elt.quantity}</td>
                    <td className="text-center">{elt.unit_price}</td>
                    <td className="odd:text-[#ECE5F0]">
                      <FontAwesomeIcon
                        icon={faTrash}
                        className="p-1 text-[#D3635F] cursor-pointer hover:shadow-md shadow-[#D3635F] rounded-md hover:text-[#ECE5F0] hover:bg-[#D3635F]"
                        onClick={() => {
                          deleteFromCart(elt.id);
                        }}
                      />
                    </td>
                    <td className="odd:text-[#ECE5F0]">
                      <Link
                        href={{
                          pathname: "/cart/[id]",
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
        </div>
      </div>
    </div>
  );
}
