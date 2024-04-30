'use client'

import Image from "next/image"
import logo from "../public/logo-nobg.png"
import { Button } from '@mantine/core';
import './globals.css';
import Link from "next/link";
import { useContext, useEffect } from "react";
import { AuthContext } from "./Context/authContext";
import { useRouter } from "next/navigation";
import Typer from "./Components/typer";
import DescTyper from "./Components/descTyper";


export default function Home() {  

  return (
    <div className= "w-full h-screen backgorund">

      <Image
        src={logo}
        alt="Hungry Logo"
        width={500}
        height={200}
        priority={true}
        className="flex justify-center mx-auto relative"
      />

      <Typer />
      <DescTyper />

    <div className="flex justify-evenly align-middle w-full mb-5 absolute bottom-5">
      <Link href="/login" ><Button variant="outline" size="xl" color="blue" radius="md" className="loginButton">Login 🍱</Button></Link>
    </div>

    </div>
  );
}
