import { Suspense } from "react";
import { LoadingOverlay } from "@/components/admin/loading-data";
import SuratDocument from "./SuratTugas";

export default function Page() {
  return (
    <Suspense fallback={<LoadingOverlay text="Memuat data..." />}>
      <SuratDocument />
    </Suspense>
  );
}
