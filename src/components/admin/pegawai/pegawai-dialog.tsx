"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CreatePegawai, EditPegawai } from "@/lib/schemas/pegawai";

import { useState } from "react";
import PegawaiForm from "./pegawai-form";
import { createPegawai, updatePegawai } from "@/services/pegawaiService";
import { toast } from "sonner";

interface PegawaiDialogProps {
  title: string;
  trigger: React.ReactNode;
  method: "create" | "edit";
  onSuccess?: () => void;
  defaultValue?: (Partial<CreatePegawai> & { id?: number }) | Partial<EditPegawai>;
}

export default function PegawaiDialog({ title, trigger, method = "create", onSuccess, defaultValue }: PegawaiDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: CreatePegawai | EditPegawai) => {
    setLoading(true);
    try {
      if (method === "create") {
        await createPegawai(data as CreatePegawai);
        console.log("Data", data);
      } else {
        if (!defaultValue?.id) {
          toast.error("Data pegawai tidak ditemukan");
          throw new Error("ID pegawai tidak ditemukan");
        }
        await updatePegawai(defaultValue.id, data as EditPegawai);
      }
      onSuccess?.();
      setOpen(false);
    } catch (error) {
      console.error("Error saat mengatur data pegawai:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{trigger}</DialogTrigger>
        <DialogContent className="w-2xl">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-bold">{title}</DialogTitle>
          </DialogHeader>

          <PegawaiForm onSubmit={handleSubmit} defaultValue={defaultValue} isEditMode={method === "edit"} loading={loading} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
