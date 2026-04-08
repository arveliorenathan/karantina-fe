"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { toast } from "sonner";
import { CreateHasilUji, EditHasilUji } from "@/lib/schemas/hasilUji";
import { Sampel } from "@/types/sampel";
import { Parameter } from "@/types/parameter";
import { Pegawai } from "@/types/pegawai";
import HasilUjiForm from "./hasil-uji-form";
import { createHasilUji, updateHasilUji } from "@/services/hasilUjiService";

interface HasilUjiDialogProps {
  title: string;
  trigger: React.ReactNode;
  method: "create" | "edit";
  onSuccess?: () => void;
  defaultValue?:
    | (Partial<CreateHasilUji> & { id?: number })
    | Partial<EditHasilUji>;
  sampel?: Sampel;
  parameterList: Parameter[];
  pegawaiList: Pegawai[];
}

export default function HasilUjiDialog({
  title,
  trigger,
  method = "create",
  onSuccess,
  sampel,
  parameterList,
  pegawaiList,
  defaultValue,
}: HasilUjiDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: CreateHasilUji | EditHasilUji) => {
    setLoading(true);
    try {
      if (method === "create") {
        await createHasilUji(data as CreateHasilUji);
      } else {
        if (!defaultValue?.id) {
          toast.error("Data hasil uji tidak ditemukan");
          return;
        }
        await updateHasilUji(defaultValue.id, data as EditHasilUji);
      }

      onSuccess?.();
      setOpen(false);
    } catch (error) {
      console.error(error);
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

          <HasilUjiForm
            onSubmit={handleSubmit}
            defaultValue={defaultValue}
            isEditMode={method === "edit"}
            sampel={sampel}
            parameterList={parameterList}
            pegawaiList={pegawaiList}
            loading={loading}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
