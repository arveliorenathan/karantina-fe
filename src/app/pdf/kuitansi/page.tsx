import { Suspense } from "react";
import { LoadingOverlay } from "@/components/admin/loading-data";
import KuitansiPage from "./Kuitansi";

export default function Page() {
  return (
    <Suspense fallback={<LoadingOverlay text="Memuat data..." />}>
      <KuitansiPage />
    </Suspense>
  );
}
