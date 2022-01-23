import React from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

export default function menuItem() {
  const router = useRouter();
  const [ingredient, setIngredient] = useState("");
  const [ingredients, setIngredients] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);

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
        console.log(ing.data[0].id);
        const newIngs = [...ingredients];
        newIngs.push(ing.data[0]);
        setIngredients(newIngs);
      }
    } catch (error) {
      alert("invalid ingredient name");
    }
  };

  const add = async () => {
    try {
      let newArr = [];
      ingredients.map((elt) => {
        return newArr.push(elt.id);
      });
      console.log(newArr);
      const response = await axios.post(
        "http://localhost:8000/api/menu/add",
        {
          name: name,
          price: price,
          ingredients: newArr,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: "Bearer " + localStorage.getItem("sanctum_token"),
          },
        }
      );
      router.push("/menu");
    } catch (error) {
      // Error 😨
      if (error.response) {
        /*
         * The request was made and the server responded with a
         * status code that falls out of the range of 2xx
         */
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        /*
         * The request was made but no response was received, `error.request`
         * is an instance of XMLHttpRequest in the browser and an instance
         * of http.ClientRequest in Node.js
         */
        console.log(error.request);
      } else {
        // Something happened in setting up the request and triggered an Error
        console.log("Error", error.message);
      }
      console.log(error);
    }
  };

  useEffect(async () => {
    if (JSON.parse(localStorage.getItem("user")).role !== "admin")
      router.push("/");
  }, []);
  return (
    <div className=" grid grid-cols-10 grid-rows-6 h-screen w-screen">
      <Navbar />
      <Sidebar />
      <div className="bg-[#ECE5F0] col-span-8 row-span-5 p-8 select-none">
        <div className="flex flex-col justify-around items-center gap-4 ">
          <div className="font-logo text-4xl text-[#D3635F] decoration-wavy underline decoration-[#EEA144]">
            Add a new Menu
          </div>
          <div className="flex px-8 py-2 justify-around w-full">
            <div className="text-[#795F53] font-bold">Name</div>
            <input
              type="text"
              className="outline-none px-4 py-2 bg-[#ECE5F0] ring-2 ring-[#795F53] rounded-md"
              placeholder="enter a name"
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
          </div>
          <div className="flex px-8 py-2 justify-around w-full">
            <div className="text-[#795F53] font-bold">Price</div>
            <input
              type="text"
              className="outline-none px-4 py-2 bg-[#ECE5F0] ring-2 ring-[#795F53] rounded-md"
              placeholder="enter a price"
              onChange={(e) => {
                setPrice(e.target.value);
              }}
            />
          </div>
          <div className="flex px-8 py-2 justify-around w-full">
            <div className="text-[#795F53] font-bold flex">Ingredients</div>
            <div className="flex flex-col gap-3" id="ing">
              {ingredients
                ? ingredients.map((elt) => {
                    return (
                      <p
                        className="text-[#795F53] cursor-pointer"
                        key={elt?.id}
                        onClick={() => {
                          let arr = ingredients.filter((e) => {
                            return e.id !== elt.id;
                          });
                          setIngredients(arr);
                          let newArr = ingredients.filter((e) => {
                            return e.id !== elt.id;
                          });
                          setIngredients(newArr);
                        }}
                      >
                        {" "}
                        {elt?.name}
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
              onClick={add}
            >
              Add Menu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
