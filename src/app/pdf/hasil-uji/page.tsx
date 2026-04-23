import { Suspense } from "react";
import { LoadingOverlay } from "@/components/admin/loading-data";
import LembarHasilUji from "./HasilUji";

interface PageProps {
  searchParams: Promise<{ id?: string }>;
}

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;
  const id = params.id;

  return (
    <Suspense fallback={<LoadingOverlay text="Memuat data..." />}>
      <LembarHasilUji id={id} />
    </Suspense>
  );
}
