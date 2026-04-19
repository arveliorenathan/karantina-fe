import Image from "next/image";
import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";

export default function NavigationBar() {
  return (
    <nav className="sticky top-0 z-50 p-4 bg-primary shadow-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between flex-wrap sm:flex-nowrap">
        {/* Left Section: Logo and Text */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          <Image src="/images/Barantin.png" height={50} width={50} alt="Logo" className="sm:h-15 sm:w-15" />
          <div className="flex flex-col text-white">
            <p className="text-lg sm:text-xl font-bold">Dewata e-Laboratory</p>
            <span className="text-xs sm:text-sm opacity-80 truncate sm:whitespace-normal">Balai Besar Karantina Hewan Ikan dan Tumbuhan Bali</span>
          </div>
        </div>

        {/* Right Section: Buttons */}
        <div className="flex items-center gap-2 sm:gap-4 mt-2 sm:mt-0">
          <Link href="/login">
            <Button variant="default" className="border hover:bg-white hover:text-primary px-4 py-2 rounded-md transition-colors cursor-pointer">
              Masuk
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
