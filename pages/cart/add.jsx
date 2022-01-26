import React from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPen, faPlus } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";

export default function add() {
  const router = useRouter();

  const [menu, setMenu] = useState([]);
  const [editable, setEditable] = useState(true);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [ings, setIngs] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    let tot = selectedMenu?.price ?? 0;
    selectedMenu?.ingredient.map((elt) => {
      if (ings.includes(elt.name)) tot += elt.price;
    });
    tot *= quantity;
    setTotal(tot);
  }, [selectedMenu, quantity, ings]);

  const addToCart = async () => {
    try {
      let ingString = "";
      selectedMenu.ingredient.map((elt) => {
        if (ings.includes(elt.name)) ingString += elt.id + "@";
      });
      ingString = ingString.substring(0, ingString.length - 1);
      const response = await axios.post(
        "http://localhost:8000/api/cart/add",
        {
          menu_id: selectedMenu.id,
          quantity: quantity,
          ingredient: ingString,
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
      router.push("/cart");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(async () => {
    try {
      const menus = await axios.get("http://localhost:8000/api/menu", {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: "Bearer " + localStorage.getItem("sanctum_token"),
        },
      });
      setMenu(menus.data);
      console.log(menus.data);
    } catch (error) {
      console.log(error);
    }
  }, [setMenu]);

  return (
    <div className=" grid grid-cols-10 grid-rows-6 h-screen w-screen">
      <Navbar />
      <Sidebar />
      <div className="bg-[#ECE5F0] col-span-8 row-span-5 p-8 select-none">
        <div className="flex flex-col justify-around items-center gap-4 ">
          <div className="font-logo text-4xl text-[#D3635F] decoration-wavy underline decoration-[#EEA144]">
            Your Order
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
                        onClick={() => {
                          setEditable(false);
                          setSelectedMenu(elt);
                          console.log(elt);
                        }}
                      />
                      {elt.name}
                    </label>
                  );
                })}
              </div>
            ) : (
              <div className="flex gap-3">
                <div className="text-[#795F53]">{selectedMenu.name} </div>
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
            <div className="text-[#795F53] font-bold flex">Ingredients</div>
            <div className="flex flex-col gap-3">
              {selectedMenu?.ingredient.map((elt) => {
                return (
                  <label key={elt.id} className="inline-flex items-center mt-3">
                    <input
                      type="checkbox"
                      className="form-checkbox h-5 w-5 text-gray-600"
                      onChange={(e) => {
                        if (e.target.checked) {
                          setIngs([...ings, elt.name]);
                        } else {
                          let newIngs = ings;
                          newIngs.splice(ings.indexOf(elt.name), 1);
                          setIngs(newIngs);
                        }
                      }}
                    />
                    <span className="ml-2 text-gray-700">{elt.name}</span>
                  </label>
                );
              })}
            </div>
          </div>
          <div className="flex px-8 py-2 justify-around w-full">
            <div className="text-[#795F53] font-bold">Quantity</div>
            <div className="flex gap-3">
              <FontAwesomeIcon
                icon={faMinus}
                className="text-[#ECE5F0] bg-[#795F53] p-1 cursor-pointer rounded-md hover:bg-[#ECE5F0] hover:text-[#795F53]"
                onClick={() => {
                  setQuantity(quantity - 1);
                }}
              />
              <div className="text-[#795F53]">{quantity}</div>
              <FontAwesomeIcon
                icon={faPlus}
                className="text-[#ECE5F0] bg-[#795F53] p-1 cursor-pointer rounded-md hover:bg-[#ECE5F0] hover:text-[#795F53]"
                onClick={() => {
                  setQuantity(quantity + 1);
                }}
              />
            </div>
          </div>
          <div className="flex px-8 py-2 justify-around w-full">
            <div className="text-[#795F53] font-bold flex">Total</div>
            <div className="flex flex-col gap-3">{total}</div>
          </div>
          <div>
            <button
              className="px-4 py-2 text-[#795F53] font-bold rounded-md ring-1 ring-[#795F53] hover:text-[#ECE5F0] hover:bg-[#795F53] hover:shadow-md hover:shadow-[#34271D]"
              onClick={addToCart}
            >
              add to cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
