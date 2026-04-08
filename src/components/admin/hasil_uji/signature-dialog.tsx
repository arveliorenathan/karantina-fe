import { useState } from "react";
import { toast } from "sonner";
import { updateHasilUji } from "@/services/hasilUjiService";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { HasilUji } from "@/types/hasilUji";

interface SignatureDialogProps {
  trigger: React.ReactNode;
  defaultValues: HasilUji[];
  onSuccess?: () => void;
}

export default function SignatureDialog({ trigger, defaultValues, onSuccess }: SignatureDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const updatedResults = defaultValues.map((hasil) => ({
        ...hasil,
        status: "Menunggu Verifikasi",
      }));

      for (const hasil of updatedResults) {
        await updateHasilUji(hasil.id, hasil);
      }

      onSuccess?.();
      toast.success("Tanda tangan berhasil diajukan!");
      setOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Terjadi kesalahan, coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{trigger}</DialogTrigger>
        <DialogContent className="w-2xl">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-bold">Pengajuan Tanda Tangan</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4">
            <p className="text-lg">Apakah Anda yakin ingin mengajukan tanda tangan untuk hasil uji ini?</p>
            <div className="flex gap-4">
              <Button variant="default" size="lg" onClick={handleSubmit} disabled={loading}>
                {loading ? "Mengajukan..." : "Ya"}
              </Button>
              <Button variant="destructive" size="lg" onClick={handleCancel} disabled={loading}>
                Tidak
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
