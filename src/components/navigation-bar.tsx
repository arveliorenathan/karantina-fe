import Image from "next/image";
import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";

export default function NavigationBar() {
  return (
    <nav className="sticky top-0 z-50 p-4 bg-primary shadow-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        {/* Left Section: Logo and Text */}
        <div className="flex items-center gap-4">
          <Image src="/images/Barantin.png" height={60} width={60} alt="Logo" />
          <div>
            <p className="text-xl font-bold text-white">Dewata e-Laboratory</p>
            <span className="text-sm text-white opacity-80 sm:inline">Balai Besar Karantina Hewan Ikan dan Tumbuhan Bali</span>
          </div>
        </div>

        {/* Right Section: Buttons */}
        <div className="flex items-center gap-4">
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
