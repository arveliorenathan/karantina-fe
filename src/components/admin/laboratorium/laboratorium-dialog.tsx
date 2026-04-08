"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import LaboratoriumForm from "./laboratorium-form";
import {
  CreateLaboratorium,
  EditLaboratorium,
} from "@/lib/schemas/laboratorium";
import { Pegawai } from "@/types/pegawai";
import {
  createLaboratorium,
  updateLaboratorium,
} from "@/services/laboratoriumService";
import { toast } from "sonner";

interface LaboratoriumDialogProps {
  title: string;
  trigger: React.ReactNode;
  method: "create" | "edit";
  onSuccess?: () => void;
  pegawaiList: Pegawai[];
  defaultValue?:
    | (Partial<CreateLaboratorium> & { id?: number })
    | Partial<EditLaboratorium>;
}

export default function LaboratoriumDialog({
  title,
  trigger,
  method = "create",
  onSuccess,
  pegawaiList,
  defaultValue,
}: LaboratoriumDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (data: CreateLaboratorium | EditLaboratorium) => {
    setLoading(true);
    try {
      if (method == "create") {
        await createLaboratorium(data as CreateLaboratorium);
      } else {
        if (!defaultValue?.id) {
          toast.error("Data laboratorium tidak ditemukan");
          throw new Error("ID laboratorium tidak ditemukan");
        }
        await updateLaboratorium(defaultValue?.id, data);
      }
      onSuccess?.();
      setOpen(false);
    } catch (error) {
      console.error("Error saat mengatur data laboratorium:", error);
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
            <DialogTitle className="text-center text-xl font-bold">
              {title}
            </DialogTitle>
          </DialogHeader>

          <LaboratoriumForm
            onSubmit={handleSubmit}
            defaultValue={defaultValue}
            pegawaiList={pegawaiList}
            isEditMode={method === "edit"}
            loading={loading}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
