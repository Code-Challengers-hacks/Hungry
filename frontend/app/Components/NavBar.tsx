import Link from "next/link";
import "./styles.css";
import { Button, Tooltip } from "@mantine/core";
import { AuthContext } from "../Context/authContext";
import { useContext } from "react";
import { useRouter } from "next/navigation";
import { Bounce, toast } from "react-toastify";
import Image from "next/image";
import Help from '@/public/question.png'

export const NavBar = () => {
  const member: boolean = localStorage.getItem("Auth") !== null;
  const { dispatch} = useContext(AuthContext) || {}
  const router = useRouter();

  const handleHelp = () => {
    window.open('https://drive.google.com/drive/folders/1XzoNtOlFF6ESCdN87TBNVsrrZx70qLQw?usp=sharing', "_blank");
  }

  const handleLogout = async () => {
    router.push('/login');
    dispatch ? dispatch({type : 'LOGOUT' }) : {};
    toast.success('Logged out successfully!', {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      transition: Bounce,
    });
    localStorage.removeItem("Auth");
    console.log("Logged out");
  }

  return (
    <div className="flex content-center text-center align-middle text-5xl w-full h-24 mb-10 rounded-b-3xl py-6 border-b-4 border-b-blue-800/55 shadow-xl shadow-sky-500">
      <Link
        href="/"
        className="flex text-center align-middle content-center justify-end navbar_heading w-2/3 pr-36 pb-10"
      >
        HUNGRY
      </Link>
      {member  ? <Button variant="outline" color="red" size="md" radius="lg" className="flex justify-center ml-36 align-middle content-center " onClick={handleLogout} >
        Logout
      </Button> : ""}
      <Tooltip label='Help' position="bottom"><Image src={Help} alt='Help' width={50} height={50} className="absolute right-5 cursor-pointer" onClick={handleHelp} /></Tooltip>
    </div>
  );
};
