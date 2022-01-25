import React from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";

export default function ingredientItem() {
  const router = useRouter();
  const [menu, setMenu] = useState("");
  const [ingredient, setIngredient] = useState(null);
  const [menus, setMenus] = useState([]);
  const [editable, setEditable] = useState(false);
  const [price, setPrice] = useState(0);

  const updatePrice = async (event) => {
    try {
      if (event.key === "Enter") {
        setIngredient({ ...ingredient, price: price });
        setEditable(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const addMenu = async (event) => {
    try {
      if (event.key === "Enter") {
        event.target.value = "";
        const men = await axios.get("http://localhost:8000/api/menu/" + menu, {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: "Bearer " + localStorage.getItem("sanctum_token"),
          },
        });
        menus.push(men.data[0].id);
        setMenus(menus);
        const newIngredient = { ...ingredient };
        newIngredient.menu.push(men.data[0]);
        console.log(newIngredient);
        setIngredient(newIngredient);
      }
    } catch (error) {
      alert("invalid ingredient name");
    }
  };

  const update = async () => {
    try {
      const response = await axios.put(
        "http://localhost:8000/api/ingredient/update/" + router.query.id,
        {
          name: ingredient.name,
          price: ingredient.price,
          menu_id: menus,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: "Bearer " + localStorage.getItem("sanctum_token"),
          },
        }
      );
      window.location.reload(true);
    } catch (error) {
      alert("error in update");
    }
  };

  useEffect(async () => {
    if (JSON.parse(localStorage.getItem("user")).role !== "admin")
      router.push("/");
    if (!router.isReady) return;
    try {
      const ingredientData = await axios.get(
        "http://localhost:8000/api/ingredient/" + router.query.id,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: "Bearer " + localStorage.getItem("sanctum_token"),
          },
        }
      );
      setIngredient(ingredientData.data[0]);
      setPrice(ingredientData.data[0].price);
      console.log(ingredientData.data[0]);
      let arr = [];
      ingredientData.data[0].menu.map((elt) => {
        arr.push(elt.id);
      });
      setMenus(arr);
      console.log(arr);
    } catch (error) {
      console.log(error);
      router.push("/ingredient");
    }
  }, [router.isReady, setIngredient]);
  return (
    <div className=" grid grid-cols-10 grid-rows-6 h-screen w-screen">
      <Navbar />
      <Sidebar />
      <div className="bg-[#ECE5F0] col-span-8 row-span-5 p-8 select-none">
        <div className="flex flex-col justify-around items-center gap-4 ">
          <div className="font-logo text-4xl text-[#D3635F] decoration-wavy underline decoration-[#EEA144]">
            {ingredient ? ingredient.name : ""}
          </div>
          <div className="flex px-8 py-2 justify-around w-full">
            <div className="text-[#795F53] font-bold">Price</div>
            {editable ? (
              <input
                type="text"
                className="outline-none px-4 py-2 bg-[#ECE5F0] ring-2 ring-[#795F53] rounded-md"
                defaultValue={ingredient.price}
                onChange={(e) => {
                  setPrice(e.target.value);
                }}
                onKeyPress={updatePrice}
              />
            ) : (
              <div className="flex gap-3">
                <div className="text-[#795F53]">
                  {ingredient ? ingredient.price : ""}{" "}
                </div>
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
            <div className="flex flex-col gap-3" id="ing">
              {ingredient
                ? ingredient.menu?.map((elt) => {
                    return (
                      <p
                        className="text-[#795F53] cursor-pointer"
                        key={elt.id}
                        onClick={() => {
                          let arr = menus.filter((e) => {
                            return e !== elt.id;
                          });
                          setMenus(arr);
                          let newArr = ingredient.menu.filter((e) => {
                            return e.id !== elt.id;
                          });
                          const newIngredient = { ...ingredient, menu: newArr };
                          setIngredient(newIngredient);
                        }}
                      >
                        {" "}
                        {elt.name}
                      </p>
                    );
                  })
                : ""}
              <input
                type="text"
                className="outline-none px-4 py-2 bg-[#ECE5F0] ring-2 ring-[#795F53] rounded-md"
                placeholder="Add a new menu"
                onChange={(e) => {
                  setMenu(e.target.value);
                }}
                onKeyPress={addMenu}
              />
            </div>
          </div>
          <div>
            <button
              className="px-4 py-2 text-[#795F53] font-bold rounded-md ring-1 ring-[#795F53] hover:text-[#ECE5F0] hover:bg-[#795F53] hover:shadow-md hover:shadow-[#34271D]"
              onClick={update}
            >
              update
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
