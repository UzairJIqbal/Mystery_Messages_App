"use client";
import { motion } from "motion/react";
import React from "react";
import { TypewriterEffectSmooth } from "@/components/ui/typewriter-effect";
import Link from "next/link";
const words = [
  {
    text: "Step",
  },
  {
    text: "Into",
  },
  {
    text: "the",
  },
  {
    text: "shadows of...",
  },
  {
    text: "Mystery Message",
    className: "text-blue-500 dark:text-blue-500",
  },
];

const Page = () => {
  return (
    <div className="relative  min-h-[150vh]  overflow-x-hidden">
      <div className="flex flex-col items-center justify-center h-[40rem] ">
        <p className="text-neutral-600 dark:text-neutral-200 text-lg sm:text-base  ">
          Venture into the unknown with messages that keep your identity locked
          away.
        </p>
        <TypewriterEffectSmooth words={words} />
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 space-x-0 md:space-x-4">
          <Link href="/sign-up">
          <button className="w-40 h-10 rounded-xl bg-black border dark:border-white border-transparent text-white text-sm">
            Join now
          </button></Link>
         <Link href="/sign-in">
          <button className="w-40 h-10 rounded-xl bg-white text-black border border-black  text-sm">
            SignIn
          </button>
         </Link>
        </div>
      </div>

      <footer className="absolute bottom-0 left-0 w-full text-center p-4 md:p-6 bg-gray-900 text-white text-sm">
        © 2025 Mystery Message. All rights reserved.
      </footer>
    </div>
  );
};

export default Page;
