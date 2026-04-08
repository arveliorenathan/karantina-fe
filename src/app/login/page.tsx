import { LoginForm } from "@/components/login-form";
import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <Link href="/">
          <div className="flex items-center gap-4">
            <Image src="/images/Barantin.png" height={60} width={60} alt="Logo" />
            <div>
              <p className="text-xl font-bold ">Dewata e-Laboratory</p>
              <span className="text-sm opacity-80 sm:inline">Balai Besar Karantina Hewan Ikan dan Tumbuhan Bali</span>
            </div>
          </div>
        </Link>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <Image
          src="/images/Kantor.jpeg"
          height={100}
          width={60}
          alt="Logo"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
    </div>
  );
}
