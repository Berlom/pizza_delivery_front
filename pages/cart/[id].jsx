import React from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
export default function cartItem() {
  const router = useRouter();
  const [cart, setCart] = useState(null);

  useEffect(async () => {
    if (!router.isReady) return;
    try {
      const cart = await axios.get(
        "http://localhost:8000/api/cart/" + router.query.id,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: "Bearer " + localStorage.getItem("sanctum_token"),
          },
        }
      );
      console.log(cart.data);
      setCart(cart.data);
    } catch (err) {
      console.log(err);
    }
  }, [router.isReady]);
  return (
    <div className=" grid grid-cols-10 grid-rows-6 h-screen w-screen">
      <Navbar />
      <Sidebar />
      <div className="bg-[#ECE5F0] col-span-8 row-span-5 p-8">
        <div className="flex flex-col justify-around items-center gap-4 ">
          <div className="font-logo text-4xl text-[#D3635F] decoration-wavy underline decoration-[#EEA144]">
            Your Order
          </div>
          <div className="flex px-8 py-2 justify-around w-full">
            <div className="text-[#795F53]">your order is</div>
            <div className="text-[#795F53]">{cart ? cart.cart.order : ""}</div>
          </div>
          <div className="flex px-8 py-2 justify-around w-full">
            <div className="text-[#795F53]">Menu</div>
            <div className="text-[#795F53]">{cart ? cart.menu : ""}</div>
          </div>
          <div className="flex px-8 py-2 justify-around w-full">
            <div className="text-[#795F53]">Quantity</div>
            <div className="text-[#795F53]">
              {cart ? cart.cart.quantity : ""}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
