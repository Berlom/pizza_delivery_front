import React from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";

export default function menuItem() {
  const router = useRouter();
  const [menu, setMenu] = useState(null);
  const [ingredient, setIngredient] = useState("");
  const [ingredients, setIngredients] = useState([]);
  const [editable, setEditable] = useState(false);
  const [price, setPrice] = useState(0);

  const updatePrice = async (event) => {
    try {
      if (event.key === "Enter") {
        setMenu({ ...menu, price: price });
        setEditable(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const addIngredient = async (event) => {
    try {
      if (event.key === "Enter") {
        event.target.value = "";
        const ing = await axios.get(
          "http://localhost:8000/api/ingredient/" + ingredient,
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: "Bearer " + localStorage.getItem("sanctum_token"),
            },
          }
        );
        ingredients.push(ing.data[0].id);
        setIngredients(ingredients);
        const newMenu = { ...menu };
        newMenu.ingredient.push(ing.data[0]);
        console.log(newMenu);
        setMenu(newMenu);
        //fix your spaghetti code
      }
    } catch (error) {
      alert("invalid ingredient name");
    }
  };

  const update = async () => {
    console.log(menu);
    try {
      const response = await axios.put(
        "http://localhost:8000/api/menu/update/" + router.query.id,
        {
          name: menu.name,
          price: menu.price,
          ingredients: ingredients,
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
      const menuData = await axios.get(
        "http://localhost:8000/api/menu/" + router.query.id,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: "Bearer " + localStorage.getItem("sanctum_token"),
          },
        }
      );
      setMenu(menuData.data[0]);
      setPrice(menuData.data[0].price);
      console.log(menuData.data[0]);
      let arr = [];
      menuData.data[0].ingredient.map((elt) => {
        arr.push(elt.id);
      });
      setIngredients(arr);
      console.log(arr);
    } catch (error) {
      console.log(error);
    }
  }, [router.isReady, setMenu]);
  return (
    <div className=" grid grid-cols-10 grid-rows-6 h-screen w-screen">
      <Navbar />
      <Sidebar />
      <div className="bg-[#ECE5F0] col-span-8 row-span-5 p-8 select-none">
        <div className="flex flex-col justify-around items-center gap-4 ">
          <div className="font-logo text-4xl text-[#D3635F] decoration-wavy underline decoration-[#EEA144]">
            {menu ? menu.name : ""}
          </div>
          <div className="flex px-8 py-2 justify-around w-full">
            <div className="text-[#795F53] font-bold">Price</div>
            {editable ? (
              <input
                type="text"
                className="outline-none px-4 py-2 bg-[#ECE5F0] ring-2 ring-[#795F53] rounded-md"
                defaultValue={menu.price}
                onChange={(e) => {
                  setPrice(e.target.value);
                }}
                onKeyPress={updatePrice}
              />
            ) : (
              <div className="flex gap-3">
                <div className="text-[#795F53]">{menu ? menu.price : ""} </div>
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
              {menu
                ? menu.ingredient?.map((elt) => {
                    return (
                      <p
                        className="text-[#795F53] cursor-pointer"
                        key={elt.id}
                        onClick={() => {
                          let arr = ingredients.filter((e) => {
                            return e !== elt.id;
                          });
                          setIngredients(arr);
                          let newArr = menu.ingredient.filter((e) => {
                            return e.id !== elt.id;
                          });
                          const newMenu = { ...menu, ingredient: newArr };
                          setMenu(newMenu);
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
                placeholder="Add a new ingredient"
                onChange={(e) => {
                  setIngredient(e.target.value);
                }}
                onKeyPress={addIngredient}
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
