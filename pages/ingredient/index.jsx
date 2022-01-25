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
import { useRouter } from "next/router";
export default function index() {
  const [ingredient, setIngredient] = useState([]);

  const router = useRouter();
  useEffect(() => {
    if (JSON.parse(localStorage.getItem("user")).role !== "admin")
      router.push("/");
  }, []);

  useEffect(async () => {
    try {
      const ingredientsData = await axios.get(
        "http://localhost:8000/api/ingredient",
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: "Bearer " + localStorage.getItem("sanctum_token"),
          },
        }
      );
      setIngredient(ingredientsData.data);
    } catch (error) {
      console.log(error);
    }
  }, [setIngredient]);

  const deleteIngredient = async (id) => {
    try {
      const response = await axios.delete(
        "http://localhost:8000/api/ingredient/delete/" + id,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: "Bearer " + localStorage.getItem("sanctum_token"),
          },
        }
      );
      console.log(response.data);
      const result = ingredient.filter((elt) => {
        return elt.name != id;
      });
      setIngredient(result);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className=" grid grid-cols-10 grid-rows-6 h-screen w-screen">
      <Navbar />
      <Sidebar />
      <div className="bg-[#ECE5F0] col-span-8 row-span-5 p-8">
        <table className="w-full ">
          <thead>
            <tr>
              <th>id</th>
              <th>name</th>
              <th>price</th>
              <th>menus</th>
            </tr>
          </thead>
          <tbody>
            {ingredient.map((elt) => {
              return (
                <tr
                  key={elt.id}
                  className="odd:bg-[#795F53] odd:text-[#ECE5F0]"
                >
                  <td className="text-center">{elt.id}</td>
                  <td className="text-center">{elt.name}</td>
                  <td className="text-center">{elt.price}</td>
                  <td className="text-center">
                    {elt.menu.map((elt) => {
                      return elt.name + ", ";
                    })}
                  </td>
                  <td className="odd:text-[#ECE5F0]">
                    <FontAwesomeIcon
                      icon={faTrash}
                      className="p-1 text-[#D3635F] cursor-pointer hover:shadow-md shadow-[#D3635F] rounded-md hover:text-[#ECE5F0] hover:bg-[#D3635F]"
                      onClick={() => {
                        deleteIngredient(elt.name);
                      }}
                    />
                  </td>
                  <td className="odd:text-[#ECE5F0]">
                    <Link
                      href={{
                        pathname: "/ingredient/[id]",
                        query: { id: elt.name },
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
        <div className="flex flex-col self-center px-8 py-4 gap-8">
          <Link href="/ingredient/add">
            <button className="px-4 py-2 text-[#795F53] font-bold rounded-md ring-1 ring-[#795F53] hover:text-[#ECE5F0] hover:bg-[#795F53] hover:shadow-md hover:shadow-[#34271D]">
              Add ingredient
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
