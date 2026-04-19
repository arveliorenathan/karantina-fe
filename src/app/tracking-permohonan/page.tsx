"use client";
import NavigationBar from "@/components/navigation-bar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building, Download, InfoIcon, PackageSearch, Search, TestTube } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PaginatedPermohonan, Permohonan } from "@/types/permohonan";
import { useCallback, useState } from "react";
import { getPermohonan } from "@/services/permohonanService";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function TrackingPermohonan() {
  const [permohonan, setPermohonan] = useState<Permohonan[]>([]);
  const [loading, setLoading] = useState(false);
  const [kode, setKode] = useState("");
  const [pin, setPin] = useState("");
  const router = useRouter();

  const fetchPermohonan = useCallback(async () => {
    if (!kode || !pin) {
      alert("Mohon masukkan Kode Permohonan dan PIN");
      return;
    }

    setLoading(true);
    try {
      const result: PaginatedPermohonan = await getPermohonan({
        page: 1,
        kode_permohonan: kode,
        pin,
        limit: 1,
      });
      setPermohonan(result.data);
    } catch (error) {
      console.error("Error fetch permohonan:", error);
      alert("Permohonan tidak ditemukan atau terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  }, [kode, pin]);

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "Selesai":
        return "bg-green-500 text-white";
      case "Pengujian Laboratorium":
        return "bg-blue-500 text-white";
      case "Distribusi Laboratorium":
        return "bg-yellow-500 text-white";
      default:
        return "bg-gray-400 text-white";
    }
  };

  return (
    <div>
      <NavigationBar />

      <section className="mx-auto max-w-5xl px-6 py-10 space-y-8">
        {/* Hero */}
        <div className="text-center space-y-3">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
            <PackageSearch className="h-7 w-7 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-primary">Tracking Permohonan</h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Lacak progres permohonan pengujian Anda secara real-time. Masukkan Kode Permohonan dan PIN untuk melihat status terkini.
          </p>
        </div>

        <Card className="border-2 border-dashed border-primary/20 bg-card shadow-sm">
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-[1fr_1fr_auto]">
              <div className="space-y-2">
                <Label htmlFor="kode" className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Kode Permohonan
                </Label>
                <Input id="kode" placeholder="Contoh: 2024-KI-0001" className="h-11" value={kode} onChange={(e) => setKode(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pin" className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  PIN
                </Label>
                <Input
                  id="pin"
                  type="password"
                  placeholder="6 digit PIN"
                  maxLength={6}
                  className="h-11"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                />
              </div>

              <div className="flex items-end">
                <Button className="h-11 px-6 w-full sm:w-auto" onClick={fetchPermohonan} disabled={loading}>
                  <Search className="h-4 w-4" />
                  <span>{loading ? "Loading..." : "Track Permohonan"}</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {permohonan.length === 0 ? (
          <p className="text-center text-muted-foreground">Masukkan Kode Permohonan dan PIN untuk melihat status permohonan.</p>
        ) : (
          permohonan.map((permohonan) => (
            <Card key={permohonan.id}>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <CardTitle className="text-lg text-primary">
                      <div className="flex items-center gap-3 ">
                        <div className="p-2 bg-primary rounded-full shrink-0">
                          <Building className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <p className="text-base text-primary font-semibold">{permohonan.nama_perusahaan}</p>
                          <p className="text-xs text-muted-foreground">
                            {permohonan.kode_permohonan} ·{" "}
                            {permohonan.tanggal_masuk ? new Date(permohonan.tanggal_masuk).toLocaleDateString("id-ID") : "-"}
                          </p>
                        </div>
                      </div>
                    </CardTitle>
                  </div>
                  <Badge className={`text-sm px-3 py-1 rounded-lg font-semibold ${getStatusBadgeColor(permohonan.status)}`}>
                    {permohonan.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                  <div className="space-y-1">
                    <span className="text-muted-foreground text-xs">Pembawa</span>
                    <p className="font-medium ">{permohonan.nama_pembawa}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-muted-foreground text-xs">Tujuan Pengujian</span>
                    <p className="font-medium text-primary">{permohonan.tujuan_pengujian}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-muted-foreground text-xs">Laboratorium</span>
                    <p className="font-medium text-primary">{permohonan.laboratorium?.nama_laboratorium}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-muted-foreground text-xs">Jumlah Sampel</span>
                    <p className="font-medium">{permohonan.sampel?.length}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary rounded-full shrink-0">
                    <TestTube className="h-4 w-4 text-white" />
                  </div>
                  <p className="text-sm text-primary font-semibold">Informasi Sampel</p>
                </div>
                {(permohonan?.sampel || []).map((sampel) => (
                  <Card key={sampel.id}>
                    <CardContent>
                      <div className="flex flex-col sm:flex-row">
                        <div className="flex-1 space-y-3">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                            <div>
                              <p className="font-semibold text-foreground">{sampel.nama_sampel}</p>
                              <p className="text-xs text-muted-foreground">
                                {sampel.kode_sampel} · <span className="italic">{sampel.spesies}</span>
                              </p>
                            </div>

                            <Button
                              size={"xs"}
                              disabled={
                                sampel.hasil_uji?.every((hasil) => hasil.status !== "Selesai") ||
                                permohonan.pnbp?.every((pnbp) => pnbp.status !== "Sudah Dibayar")
                              }
                              onClick={() => router.push(`/pdf/hasil-uji?id=${sampel.id}`)}>
                              <Download />
                              Laporan Hasil Uji
                            </Button>
                          </div>

                          {/* Sampel details */}
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                            <div>
                              <span className="text-muted-foreground">Jumlah</span>
                              <p className="font-medium text-foreground">
                                {sampel.jumlah} {sampel.satuan}
                              </p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Laboratorium</span>
                              <p className="font-medium text-foreground">{permohonan.laboratorium?.nama_laboratorium}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Tanggal Pengujian</span>
                              <p className="font-medium text-foreground">{sampel.tanggal_pengujian}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Tanggal Penandatanganan</span>
                              <p className="font-medium text-foreground">{sampel.tanggal_penandatanganan ?? "Belum Ditanda Tangan"}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <Accordion type="single" collapsible defaultValue="item-1">
                        <AccordionItem value="item-1">
                          <AccordionTrigger>Parameter Uji</AccordionTrigger>
                          <AccordionContent className="space-y-2">
                            {(sampel.hasil_uji || []).map((hasil) => (
                              <Card key={hasil.id}>
                                <CardContent className="space-y-4">
                                  <div className="flex justify-between items-center gap-3">
                                    <p className="text-xs text-primary font-semibold">{hasil.parameter?.nama_parameter}</p>
                                    <Badge className="px-3 py-1 text-xs">{hasil.status}</Badge>
                                  </div>
                                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                                    <div className="space-y-1">
                                      <span className="text-muted-foreground text-xs">Metode Pengujian</span>
                                      <p className="font-medium ">{hasil.parameter?.metode_pengujian}</p>
                                    </div>
                                    <div className="space-y-1">
                                      <span className="text-muted-foreground text-xs">Standar Pengujian</span>
                                      <p className="font-medium text-foreground">{hasil.parameter?.standar_parameter}</p>
                                    </div>
                                    <div className="space-y-1">
                                      <span className="text-muted-foreground text-xs">Satuan</span>
                                      <p className="font-medium text-foreground">{hasil.parameter?.satuan_parameter}</p>
                                    </div>
                                    <div className="space-y-1">
                                      <span className="text-muted-foreground text-xs">Hasil</span>
                                      <p className="font-medium">{hasil.hasil || "Proses Pengujian"}</p>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </CardContent>
                  </Card>
                ))}

                {permohonan.pnbp?.every((pnbp) => pnbp.status !== "Sudah Dibayar") && (
                  <Alert className="bg-red-600 text-white">
                    <InfoIcon />
                    <AlertTitle>Silahkan Membayar PNBP Terlebih Dahulu</AlertTitle>
                    <AlertDescription className="text-white">Pembayaran PNBP wajib dilakukan sebelum melanjutkan proses selanjutnya.</AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </section>
    </div>
  );
}
