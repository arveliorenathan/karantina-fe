"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CreateTarif, EditTarif } from "@/lib/schemas/tarif";

import { useState } from "react";
import { toast } from "sonner";
import TarifForm from "./layanan-form";
import { createTarif, updateTarif } from "@/services/tarifService";

interface TarifDialogProps {
  title: string;
  trigger: React.ReactNode;
  method: "create" | "edit";
  onSuccess?: () => void;
  defaultValue?: (Partial<CreateTarif> & { id?: number }) | Partial<EditTarif>;
}

export default function TarifDialog({ title, trigger, method = "create", onSuccess, defaultValue }: TarifDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: CreateTarif | EditTarif) => {
    setLoading(true);
    try {
      if (method === "create") {
        await createTarif(data as CreateTarif);
        console.log("Data", data);
      } else {
        if (!defaultValue?.id) {
          toast.error("Data tarif layanan tidak ditemukan");
          throw new Error("ID tarif layanan tidak ditemukan");
        }
        await updateTarif(defaultValue.id, data as EditTarif);
      }
      onSuccess?.();
      setOpen(false);
    } catch (error) {
      console.error("Error saat mengatur data tarif layanan:", error);
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

          <TarifForm onSubmit={handleSubmit} defaultValue={defaultValue} isEditMode={method === "edit"} loading={loading} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
