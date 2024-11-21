"use client";
import bgi from "../../public/images/bgi.jpg";
import "./globals.css";
import Image from "next/image";
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth, SignedIn, SignedOut } from "@clerk/clerk-react";

export default function Home() {
  const router = useRouter();
  return (
    <div className="home-background">
      <h1 className="puff-in-bottom home-main-text">iNVENTa</h1>
      <h2 className="focus-in-contract home-sub-text">Your Inventory Manager</h2>
      <div style={{display:"flex"}}>
      <SignedOut>
        <Link href="/sign-in">
          <button className="signin-btn slide-in-bottom">Login</button>
        </Link>
        <Link href="/sign-up">
          <button className="register-btn slide-in-bottom">Register</button>
        </Link>
      </SignedOut>
      </div>
     
        <button
          style={{
            padding: "15px 40px",
            borderRadius: "1rem",
            // color:"white",
            cursor:"pointer"
          }}
          className="home-btn slide-in-bottom"
          
          onClick={() => {
            router.push("/dashboard");
          }}
        >
          Try As a Demo User
        </button>
     
    </div>
  );
}
