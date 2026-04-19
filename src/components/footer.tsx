import { Building2 } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t bg-card/50">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Building2 className="h-4 w-4" />
            <span>© 2026 Balai Karantina Hewan, Ikan, dan Tumbuhan</span>
          </div>
          <p className="text-xs text-muted-foreground">Sistem Informasi e-Laboratory Balai Karantina Hewan, Ikan, dan Tumbuhan Bali</p>
        </div>
      </div>
    </footer>
  );
}
