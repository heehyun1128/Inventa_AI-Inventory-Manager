"use client"
import bgi from "../../public/images/bgi.jpg";
import "./globals.css";
import Image from "next/image";
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <div className="home-background">
      <h1 className="puff-in-bottom">iNVENTa</h1>
      <h2 className="focus-in-contract">Your Inventory Manager</h2>
      <Button
        sx={{
       
          padding:"15px 40px",
          borderRadius:"1rem"
        }}
        className="home-btn slide-in-bottom"
        variant="contained"
        onClick={()=>{
          router.push('/dashboard');
        }}
      >
        Get Started
      </Button>
    </div>
  );
}
