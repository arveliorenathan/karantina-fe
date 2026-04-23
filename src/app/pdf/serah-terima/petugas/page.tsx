import { Suspense } from "react";
import { LoadingOverlay } from "@/components/admin/loading-data";
import SerahTerimaPetugasPage from "./Petugas";

export default function Page() {
  return (
    <Suspense fallback={<LoadingOverlay text="Memuat data..." />}>
      <SerahTerimaPetugasPage />
    </Suspense>
  );
}
