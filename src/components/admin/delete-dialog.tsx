"use client";

import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import api from "@/lib/api";

interface DeleteDialogDeleteProps {
  trigger: React.ReactNode;
  endpoint: string;
  onSuccess?: () => void;
  title?: string;
  description?: string;
  successMessage?: string;
}

export default function DeleteDialog({
  trigger,
  endpoint,
  onSuccess,
  title = "Apakah Anda yakin ingin menghapus data ini?",
  description = "Tindakan ini tidak dapat dibatalkan. Apakah Anda yakin ingin menghapus data ini?",
  successMessage = "Data berhasil dihapus",
}: DeleteDialogDeleteProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await api.delete(endpoint);
      toast.success(successMessage);
      onSuccess?.();
      setOpen(false);
    } catch (error) {
      toast.error("Terjadi kesalahan saat menghapus data");
      console.error("Delete Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Batal</AlertDialogCancel>

          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleDelete();
            }}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700 disabled:bg-red-400">
            {loading ? "Menghapus..." : "Hapus"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
