import { Suspense } from "react";
import { LoadingOverlay } from "@/components/admin/loading-data";
import LembarHasilUji from "./HasilUji";

export default function Page() {
  return (
    <Suspense fallback={<LoadingOverlay text="Memuat data..." />}>
      <LembarHasilUji />
    </Suspense>
  );
}
