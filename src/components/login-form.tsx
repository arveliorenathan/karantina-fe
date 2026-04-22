"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export function LoginForm({ className, ...props }: React.ComponentProps<"form">) {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("https://netqar2.linkpc.net/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.message || "Login gagal");
        setLoading(false);
        return;
      }

      // simpan token
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      console.log(data);

      router.push("/admin/pegawai");
    } catch (err) {
      setError("Terjadi kesalahan koneksi");
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className={cn("flex flex-col gap-6", className)} {...props}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Login to your account</h1>
          <p className="text-sm text-balance text-muted-foreground">Enter your username below to login to your account</p>
        </div>

        <Field>
          <FieldLabel>Username</FieldLabel>
          <Input type="text" placeholder="username" required value={username} onChange={(e) => setUsername(e.target.value)} />
        </Field>

        <Field>
          <FieldLabel>Password</FieldLabel>
          <Input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        </Field>

        {error && <div className="text-red-500 text-sm text-center">{error}</div>}

        <Field>
          <Button type="submit" disabled={loading}>
            {loading ? "Loading..." : "Login"}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
