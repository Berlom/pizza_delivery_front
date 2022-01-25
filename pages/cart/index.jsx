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
  const [total, setTotal] = useState(0);
  const [coupons, setCoupons] = useState([]);
  const [couponName, setCouponName] = useState("");
  const [street, setStreet] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");

  const makeCommand = async () => {
    if (
      couponName !== "" &&
      !coupons.some((elt) => {
        return elt.name == couponName;
      })
    )
      alert("invalide coupon name");
    else if (total === 0) alert("Can't make Command with an empty cart");
    else {
      const address = await axios.post(
        "http://localhost:8000/api/address/add",
        {
          street: street,
          state: state,
          zip_code: zipCode,
          city: city,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: "Bearer " + localStorage.getItem("sanctum_token"),
          },
        }
      );
      if (couponName !== "") couponName = "/" + couponName;
      const response = await axios.post(
        "http://localhost:8000/api/commande/make" + couponName,
        {
          address_id: address.data.id,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: "Bearer " + localStorage.getItem("sanctum_token"),
          },
        }
      );
      console.log(response);
      window.location.reload(true);
    }
  };

  useEffect(async () => {
    try {
      const couponsData = await axios.get("http://localhost:8000/api/coupon", {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: "Bearer " + localStorage.getItem("sanctum_token"),
        },
      });
      setCoupons(couponsData.data);
      const cartsData = await axios.get("http://localhost:8000/api/cart", {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: "Bearer " + localStorage.getItem("sanctum_token"),
        },
      });
      setCarts(cartsData.data);
      console.log(cartsData.data);
      let tot = 0;
      cartsData.data.map((elt) => {
        tot += elt.unit_price * elt.quantity;
      });
      setTotal(tot);
    } catch (err) {
      console.log(err);
    }
  }, [setCarts, setTotal]);

  useEffect(() => {
    let tot = 0;
    carts?.map((elt) => {
      tot += elt.unit_price * elt.quantity;
    });
    setTotal(tot);
  }, [carts]);

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
            <tfoot>
              <tr className="odd:bg-[#795F53] odd:text-[#ECE5F0] border-t-4 border-[#34271D]">
                <td className="text-center">Total</td>
                <td className="text-center">{total}</td>
              </tr>
            </tfoot>
          </table>
          <div className="flex flex-col self-center px-8 py-4 gap-8">
            <input
              type="text"
              className="outline-none px-4 py-2 bg-[#ECE5F0] ring-2 ring-[#795F53] rounded-md"
              placeholder="Insert the coupoun name"
              onChange={(e) => {
                setCouponName(e.target.value);
              }}
            />
            <div className="grid grid-row-8 h-full w-full ring-2 rounded-md ring-[#34271D]">
              <div className="row-span-2 flex  justify-around text-xl text-[#795F53]">
                Address details
              </div>
              <div className="row-span-6 p-8 flex justify-between flex-wrap gap-4">
                <input
                  type="text"
                  className="outline-none px-4 py-2 bg-[#ECE5F0] ring-2 ring-[#795F53] rounded-md"
                  placeholder="Street"
                  onChange={(e) => {
                    setStreet(e.target.value);
                  }}
                />
                <input
                  type="text"
                  className="outline-none px-4 py-2 bg-[#ECE5F0] ring-2 ring-[#795F53] rounded-md"
                  placeholder="State"
                  onChange={(e) => {
                    setState(e.target.value);
                  }}
                />
                <input
                  type="text"
                  className="outline-none px-4 py-2 bg-[#ECE5F0] ring-2 ring-[#795F53] rounded-md"
                  placeholder="City"
                  onChange={(e) => {
                    setCity(e.target.value);
                  }}
                />
                <input
                  type="text"
                  className="outline-none px-4 py-2 bg-[#ECE5F0] ring-2 ring-[#795F53] rounded-md"
                  placeholder="Zip Code"
                  onChange={(e) => {
                    setZipCode(e.target.value);
                  }}
                />
              </div>
            </div>
            <button
              className="px-4 py-2 text-[#795F53] font-bold rounded-md ring-1 ring-[#795F53] hover:text-[#ECE5F0] hover:bg-[#795F53] hover:shadow-md hover:shadow-[#34271D]"
              onClick={makeCommand}
            >
              Make Command
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
