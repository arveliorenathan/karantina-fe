"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, FileText, FlaskConical } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function AgendaPage() {
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [klasifikasi, setKlasifikasi] = useState("");
  const router = useRouter();

  const handleButtonClick = () => {
    if (startDate && endDate && klasifikasi) {
      router.push(`/admin/agenda/document?startDate=${startDate}&endDate=${endDate}&klasifikasi=${klasifikasi}`);
    } else {
      alert("Harap lengkapi semua input");
    }
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Rekapitulasi Agenda Hasil Pengujian</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-6 items-center">
            {/* Tanggal Awal */}
            <div className="flex-1">
              <Field>
                <FieldLabel className="text-sm ">
                  <Calendar className="h-4 w-4" />
                  Tanggal Awal
                </FieldLabel>
                <Input
                  type="date"
                  className="w-full p-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </Field>
            </div>
            {/* Tanggal Akhir */}
            <div className="flex-1">
              <Field>
                <FieldLabel className="text-sm ">
                  <Calendar className="h-4 w-4" />
                  Tanggal Akhir
                </FieldLabel>
                <Input
                  type="date"
                  className="w-full p-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </Field>
            </div>
            {/* Klasifikasi */}
            <div className="flex-1">
              <Field>
                <FieldLabel className="text-sm ">
                  <FlaskConical className="h-4 w-4" />
                  Klasifikasi
                </FieldLabel>
                <Select onValueChange={(value) => setKlasifikasi(value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pilih klasifikasi laboratorium" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="KH">Karantina Hewan</SelectItem>
                    <SelectItem value="KI">Karantina Ikan</SelectItem>
                    <SelectItem value="KT">Karantina Tumbuhan</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </div>
            <div>
              <Field>
                <FieldLabel></FieldLabel>
                <Button className="p-2 rounded-lg shadow-md transition-all duration-200 mt-4" onClick={handleButtonClick} disabled={loading}>
                  <FileText />
                  Tampilkan PDF
                </Button>
              </Field>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
