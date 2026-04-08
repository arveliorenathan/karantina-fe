"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { EditSampel } from "@/lib/schemas/sampel";
import KesimpulanForm from "./kesimpulan-form";
import { updateSampel } from "@/services/sampelService";

interface KesimpulanDialogProps {
  trigger: React.ReactNode;
  onSuccess?: () => void;
  id: number;
}

export default function KesimpulanDialog({ trigger, onSuccess, id }: KesimpulanDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: EditSampel) => {
    console.log("Submitting data", data)
    setLoading(true);
    try {
      await updateSampel(id, data as EditSampel);

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
            <DialogTitle className="text-center text-xl font-bold">Kesimpulan Pengujian</DialogTitle>
          </DialogHeader>

          <KesimpulanForm id={id} onSubmit={handleSubmit} loading={loading} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
