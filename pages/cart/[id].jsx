import React from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
export default function cartItem() {
  const router = useRouter();
  const [cart, setCart] = useState(null);
  const [menu, setMenu] = useState([]);

  const [editable, setEditable] = useState(false);

  const update = async () => {
    try {
      const response = await axios.put(
        "http://localhost:8000/api/cart/update/" + router.query.id,
        {
          menu_id: cart.cart.menu_id,
          quantity: cart.cart.quantity,
          ingredient: cart.cart.ingredients,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: "Bearer " + localStorage.getItem("sanctum_token"),
          },
        }
      );
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(async () => {
    if (!router.isReady) return;
    try {
      const panier = await axios.get(
        "http://localhost:8000/api/cart/" + router.query.id,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: "Bearer " + localStorage.getItem("sanctum_token"),
          },
        }
      );
      const menus = await axios.get("http://localhost:8000/api/menu", {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: "Bearer " + localStorage.getItem("sanctum_token"),
        },
      });
      setMenu(menus.data);
      setCart(panier.data);
    } catch (err) {
      console.log(err);
    }
  }, [router.isReady, setCart]);

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
            <div className="text-[#795F53] font-bold">your order is</div>
            <div className="text-[#795F53]">{cart ? cart.cart.order : ""}</div>
          </div>
          <div className="flex px-8 py-2 justify-around w-full">
            <div className="text-[#795F53] font-bold">Menu</div>
            {editable ? (
              <div className="flex flex-col gap-2 text-[#D3635F]">
                {menu.map((elt) => {
                  return (
                    <label key={elt.id}>
                      <input
                        type="radio"
                        name="menus"
                        value={elt.name}
                        defaultChecked={elt.id == cart.cart.menu_id}
                        onClick={() => {
                          setEditable(false);
                          const newCart = { ...cart.cart, menu_id: elt.id };
                          setCart({ ...cart, cart: newCart, menu: elt.name });
                        }}
                      />
                      {elt.name}
                    </label>
                  );
                })}
              </div>
            ) : (
              <div className="flex gap-3">
                <div className="text-[#795F53]">{cart ? cart.menu : ""} </div>
                <div className="">
                  <FontAwesomeIcon
                    icon={faPen}
                    className="text-[#ECE5F0] bg-[#795F53] p-1 cursor-pointer rounded-md hover:bg-[#ECE5F0] hover:text-[#795F53]"
                    onClick={() => {
                      setEditable(true);
                    }}
                  />
                </div>
              </div>
            )}
          </div>
          <div className="flex px-8 py-2 justify-around w-full">
            <div className="text-[#795F53] font-bold">Quantity</div>
            <div className="text-[#795F53]">
              {cart ? cart.cart.quantity : ""}
            </div>
          </div>
          <div className="">
            <button onClick={update}>update</button>
          </div>
        </div>
      </div>
    </div>
  );
}
