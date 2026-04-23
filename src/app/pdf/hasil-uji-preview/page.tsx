import { Suspense } from "react";
import { LoadingOverlay } from "@/components/admin/loading-data";
import PreviewLembarHasilUji from "./PreviewContent";

export default function Page() {
  return (
    <Suspense fallback={<LoadingOverlay text="Memuat data..." />}>
      <PreviewLembarHasilUji />
    </Suspense>
  );
}
