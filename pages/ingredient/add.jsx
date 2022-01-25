import React from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

export default function menuItem() {
  const router = useRouter();
  const [menu, setMenu] = useState("");
  const [menus, setMenus] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);

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
        console.log(men.data[0].id);
        const newMenus = [...menus];
        newMenus.push(men.data[0]);
        setMenus(newMenus);
      }
    } catch (error) {
      alert("invalid menu name");
    }
  };

  const add = async () => {
    try {
      let newArr = [];
      menus.map((elt) => {
        return newArr.push(elt.id);
      });
      console.log(newArr);
      const response = await axios.post(
        "http://localhost:8000/api/ingredient/add",
        {
          name: name,
          price: price,
          menu_id: newArr,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: "Bearer " + localStorage.getItem("sanctum_token"),
          },
        }
      );
      router.push("/ingredient");
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
            Add a new Ingredient
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
            <div className="text-[#795F53] font-bold flex">Menus</div>
            <div className="flex flex-col gap-3" id="ing">
              {menus
                ? menus.map((elt) => {
                    return (
                      <p
                        className="text-[#795F53] cursor-pointer"
                        key={elt?.id}
                        onClick={() => {
                          let arr = menus.filter((e) => {
                            return e.id !== elt.id;
                          });
                          setMenus(arr);
                          let newArr = menus.filter((e) => {
                            return e.id !== elt.id;
                          });
                          setMenus(newArr);
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
              onClick={add}
            >
              Add Ingredient
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
