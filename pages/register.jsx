import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  useEffect(() => {
    if (localStorage.getItem("sanctum_token")) {
      router.push("/");
    }
  }, []);
  const register = async () => {
    try {
      const data = await axios.post(
        "http://localhost:8000/api/register",
        {
          email: email,
          password: password,
          name: name,
          phone_number: phoneNumber,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      console.log(data.data);
      router.push("/login");
    } catch (error) {
      // Error 😨
      if (error.response) {
        /*
         * The request was made and the server responded with a
         * status code that falls out of the range of 2xx
         */
        alert(error.response.data);
      } else if (error.request) {
        /*
         * The request was made but no response was received, `error.request`
         * is an instance of XMLHttpRequest in the browser and an instance
         * of http.ClientRequest in Node.js
         */
        alert(error.request);
      } else {
        // Something happened in setting up the request and triggered an Error
        alert("Error", error.message);
      }
      console.log(error);
    }
  };
  return (
    <div>
      <div className="mx-96 my-40 bg-red-600 rounded-md flex flex-col gap-4 p-8 items-center">
        <div className="text-white text-xl">Register</div>
        <input
          type="text"
          placeholder="name"
          className="outline-none rounded-lg p-2 focus:ring-2 focus:ring-red-400"
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="phone number"
          className="outline-none rounded-lg p-2 focus:ring-2 focus:ring-red-400"
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
        <input
          type="email"
          placeholder="email"
          className="outline-none rounded-lg p-2 focus:ring-2 focus:ring-red-400"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="password"
          className="outline-none rounded-lg p-2 focus:ring-2 focus:ring-red-400"
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="submit"
          value="Register"
          className="p-2 rounded-lg bg-white text-red-600 hover:text-white hover:bg-red-800 cursor-pointer"
          onClick={register}
        />
      </div>
    </div>
  );
}
