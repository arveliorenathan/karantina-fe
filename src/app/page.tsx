import Footer from "@/components/footer";
import NavigationBar from "@/components/navigation-bar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart3, FileSearch, FileText, FlaskConical, Globe2, ShieldCheck, TestTube, TestTubeDiagonal, Users } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const features = [
    {
      icon: FileText,
      title: "Manajemen Permohonan",
      description: "Kelola permohonan pengujian karantina secara digital dengan tracking status real-time.",
    },
    {
      icon: TestTube,
      title: "Pengelolaan Sampel",
      description: "Catat, lacak, dan kelola sampel pengujian dari penerimaan hingga selesai.",
    },
    {
      icon: FlaskConical,
      title: "Data Laboratorium",
      description: "Integrasi data laboratorium dan parameter uji untuk hasil yang akurat.",
    },
    {
      icon: BarChart3,
      title: "Rekap & Laporan",
      description: "Rekap agenda hasil pengujian dengan filter dan klasifikasi lengkap.",
    },
    {
      icon: Users,
      title: "Manajemen Pegawai",
      description: "Kelola data pegawai, penandatangan, dan surat tugas secara terpusat.",
    },
    {
      icon: ShieldCheck,
      title: "Keamanan Data",
      description: "Sistem terintegrasi dengan keamanan data yang terjamin dan akses terkontrol.",
    },
  ];
  return (
    <div>
      <NavigationBar />
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <Badge className="inline-flex items-center gap-2 px-3 py-1 mb-4">
              <Globe2 className="h-3.5 w-3.5 text-white" />
              Sistem Informasi Balai Karantina Digital
            </Badge>

            <h1 className="text-primary text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-extrabold tracking-tight text-center">
              Sistem Informasi Laboratorium
              <br />
              Balai Besar Karantina Hewan, Ikan, dan Tumbuhan Bali
            </h1>

            <p className="mt-4 sm:mt-6 text-base sm:text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-xl mx-auto">
              Platform digital terpadu untuk pengelolaan pengujian karantina hewan, ikan, dan tumbuhan. Efisien, transparan, dan terintegrasi.
            </p>

            <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row sm:justify-center gap-4">
              <Link href="/tracking-permohonan">
                <Button variant="outline" size="lg" className="gap-2 px-6 sm:px-8 text-base w-full sm:w-auto cursor-pointer">
                  Tracking Permohonan <FileSearch className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/parameter">
                <Button variant="default" size="lg" className="gap-2 px-6 sm:px-8 text-base w-full sm:w-auto cursor-pointer">
                  Ketersediaan Parameter Uji <TestTubeDiagonal className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-28">
        <div className="mx-auto mb-10 sm:mb-14 max-w-2xl text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-primary">Fitur Unggulan</h2>
          <p className="mt-2 sm:mt-4 text-sm sm:text-base text-muted-foreground">
            Semua yang Anda butuhkan untuk mengelola proses karantina dalam satu platform.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className="group relative overflow-hidden border bg-card transition-all hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5">
              <CardContent className="p-6">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/15">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="mb-2 text-base sm:text-lg font-semibold text-foreground">{feature.title}</h3>
                <p className="text-sm sm:text-base leading-relaxed text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
      <Footer />
    </div>
  );
}
