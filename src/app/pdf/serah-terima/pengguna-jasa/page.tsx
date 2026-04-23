import { Suspense } from "react";
import LembarHasilUjiContent from "./PenggunaJasa";
import { LoadingOverlay } from "@/components/admin/loading-data";

export default function Page() {
  return (
    <Suspense
      fallback={
        <LoadingOverlay text="Memuat data..."/>
      }>
      <LembarHasilUjiContent />
    </Suspense>
  );
}
