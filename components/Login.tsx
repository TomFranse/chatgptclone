"use client";

import React from "react";
import { signIn } from "next-auth/react";

type Props = {};

function Login({}: Props) {
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  return (
    <div className="bg-[#11A37F] h-screen flex flex-col items-center justify-center text-center">
      <img
        src="https://drive.google.com/uc?export=download&id=1mxgawX_xUIKrIgiOpOb1MTwt8l2fXTaL"
        alt="logo"
        className="w-96"
      />
      <button
        onClick={() => signIn("google")}
        className="text-white font-bold text-3xl animate-pulse mb-4"
      >
        Sign In to use ChatGpt
      </button>
      
      {isDevelopment && (
        <button
          onClick={() => signIn("development")}
          className="text-white font-bold text-xl bg-gray-600 px-4 py-2 rounded"
        >
          Development Login (No Auth)
        </button>
      )}
    </div>
  );
}

export default Login;
