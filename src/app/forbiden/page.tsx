import { Button } from "@/components/ui/button";
import { Home, ShieldOff } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function Forbidden() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden px-4">
      {/* Decorative background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 md:w-96 md:h-96 rounded-full bg-destructive/10 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 md:w-80 md:h-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 md:w-150 md:h-150 rounded-full border border-border/30" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 md:w-100 md:h-100 rounded-full border border-border/20" />
      </div>

      {/* Main card */}
      <div className="relative z-10 text-center space-y-6 max-w-md md:max-w-lg px-6 py-8 bg-white/50 backdrop-blur-md rounded-xl shadow-lg">
        {/* Icon */}
        <div className="mx-auto w-24 h-24 md:w-28 md:h-28 rounded-2xl bg-destructive/20 flex items-center justify-center border border-destructive/30 shadow-sm">
          <ShieldOff className="w-12 h-12 md:w-14 md:h-14 text-destructive" />
        </div>

        {/* Error code */}
        <div className="space-y-4">
          <h1 className="text-6xl md:text-8xl font-bold text-foreground/20 tracking-tighter select-none">403</h1>
          <h2 className="text-xl md:text-2xl font-bold text-foreground tracking-tight -mt-2 md:-mt-4">Akses Ditolak</h2>
        </div>

        {/* Description */}
        <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-sm mx-auto">
          Maaf, Anda tidak memiliki izin untuk mengakses halaman ini. Silakan hubungi administrator jika Anda merasa ini adalah kesalahan.
        </p>

        {/* Actions */}
        <div className="flex items-center justify-center mt-4">
          <Link href="/">
            <Button className="gap-2 hover:scale-105 transition-transform duration-200 shadow-sm">
              <Home className="w-4 h-4 md:w-5 md:h-5" />
              Halaman Utama
            </Button>
          </Link>
        </div>

        {/* Help link */}
        <p className="text-xs md:text-sm text-muted-foreground mt-2">
          Butuh bantuan?{" "}
          <a href="#" className="text-primary hover:underline font-medium">
            Hubungi administrator
          </a>
        </p>
      </div>
    </div>
  );
}
