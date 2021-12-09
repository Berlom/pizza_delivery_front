import { useEffect } from "react";
import { useRouter } from "next/router";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

export default function index() {
  const router = useRouter();
  useEffect(() => {
    if (!localStorage.getItem("sanctum_token")) {
      router.push("/login");
    }
  }, []);
  return (
    <div className=" grid grid-cols-10 grid-rows-6 h-screen w-screen">
      <Navbar />
      <Sidebar />
      <div className="bg-blue-900 col-span-8 row-span-5">.</div>
    </div>
  );
}
