"use client";
import { Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function LoadingOverlay({ text = "Memuat Data..." }: { text?: string }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <Card className="w-75 shadow-lg border">
        <CardContent className="flex flex-col items-center justify-center gap-4 p-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground tracking-wide">{text}</p>
        </CardContent>
      </Card>
    </div>
  );
}
