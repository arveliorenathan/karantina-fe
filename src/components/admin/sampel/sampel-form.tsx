import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CreateSampel, CreateSampelSchema, EditSampel, EditSampelSchema } from "@/lib/schemas/sampel";
import { Laboratorium } from "@/types/laboratorium";
import { Permohonan } from "@/types/permohonan";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

interface SampelFormProps {
  onSubmit: (data: CreateSampel | EditSampel) => void;
  defaultValues?: Partial<CreateSampel> | Partial<EditSampel>;
  isEditMode?: boolean;
  laboratoriumList: Laboratorium[];
  permohonanList: Permohonan[];
  loading: boolean;
}

export default function SampelForm({ onSubmit, defaultValues, isEditMode, laboratoriumList, permohonanList, loading }: SampelFormProps) {
  const [openPermohonan, setOpenPermohonan] = useState(false);
  const [openLab, setOpenLab] = useState(false);

  const form = useForm<CreateSampel | EditSampel>({
    resolver: zodResolver(isEditMode ? EditSampelSchema : CreateSampelSchema),
    defaultValues: {
      kode_permohonan: "",
      nama_sampel: "",
      spesies: "",
      jumlah: 0,
      satuan: "",
      lab_id: 0,
      tanggal_pengujian: "",
      ...defaultValues,
    },
  });

  const handleSubmit = (data: CreateSampel | EditSampel) => {
    console.log(data);
    onSubmit(data);
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
      <FieldGroup>
        <div className="space-y-6">
          {/* Pilih Permohonan Card */}
          <Card className="border">
            <CardHeader>
              <CardTitle>Pilih Permohonan</CardTitle>
              <CardDescription>Pilih kode permohonan untuk sampel yang akan di-submit.</CardDescription>
            </CardHeader>
            <CardContent>
              <Controller
                name="kode_permohonan"
                control={form.control}
                render={({ field, fieldState }) => {
                  const selectedPermohonan = permohonanList.find((p) => p.kode_permohonan === field.value);
                  return (
                    <Field>
                      <FieldLabel>Kode Permohonan</FieldLabel>
                      <Popover open={openPermohonan} onOpenChange={setOpenPermohonan}>
                        <PopoverTrigger asChild>
                          <Button type="button" variant="outline" role="combobox" className="w-full justify-between font-normal min-w-0">
                            <span className="truncate">
                              {selectedPermohonan
                                ? `${selectedPermohonan.kode_permohonan} - ${selectedPermohonan.nama_perusahaan}`
                                : "Pilih kode permohonan"}
                            </span>
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent
                          className="p-0 pointer-events-auto"
                          align="start"
                          style={{
                            width: "var(--radix-popover-trigger-width)",
                          }}>
                          <Command className="w-full">
                            <CommandInput placeholder="Cari kode permohonan..." className="h-9" />
                            <CommandList>
                              <CommandEmpty>Kode permohonan tidak ditemukan</CommandEmpty>
                              <CommandGroup className="max-h-62.5 overflow-y-auto">
                                {permohonanList.map((p) => (
                                  <CommandItem
                                    key={p.id}
                                    value={`${p.kode_permohonan} - ${p.nama_perusahaan}`}
                                    onSelect={() => {
                                      field.onChange(p.kode_permohonan);
                                      setOpenPermohonan(false);
                                    }}
                                    className="truncate">
                                    {p.kode_permohonan} - {p.nama_perusahaan}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      {fieldState.error && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  );
                }}
              />
            </CardContent>
          </Card>

          {/* Data Sampel Card */}
          <Card className="border">
            <CardHeader>
              <CardTitle>Data Sampel</CardTitle>
              <CardDescription>Masukan rincian data sampel yang akan diuji.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Row 1: Nama Sampel & Nama Spesies */}
              <div className="grid grid-cols-2 gap-4">
                <Controller
                  name="nama_sampel"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel htmlFor="nama_sampel">Nama Sampel</FieldLabel>
                      <Input {...field} id="nama_sampel" type="text" placeholder="Nama sampel" aria-invalid={fieldState.invalid} required />
                      {fieldState.error && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />

                <Controller
                  name="spesies"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel htmlFor="spesies">Spesies (Nama Latin)</FieldLabel>
                      <Input {...field} id="spesies" type="text" placeholder="Contoh: Salacca zalacca" aria-invalid={fieldState.invalid} required />
                      {fieldState.error && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
              </div>

              {/* Row 2: Jumlah & Satuan */}
              <div className="grid grid-cols-2 gap-4">
                <Controller
                  name="jumlah"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel htmlFor="jumlah">Jumlah Komoditas</FieldLabel>
                      <Input
                        {...field}
                        id="jumlah"
                        type="number"
                        aria-invalid={fieldState.invalid}
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(Number(value));
                        }}
                        required
                      />
                      {fieldState.error && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
                <Controller
                  name="satuan"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel htmlFor="satuan">Satuan Komoditas</FieldLabel>
                      <Input {...field} id="satuan" type="text" placeholder="" aria-invalid={fieldState.invalid} required />
                      {fieldState.error && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
              </div>

              {/* Row 3: Laboratorium & Penandatangan */}
              <div className="grid grid-cols-2 gap-4">
                <Controller
                  name="lab_id"
                  control={form.control}
                  render={({ field, fieldState }) => {
                    const selectedLaboratorium = laboratoriumList.find((lab) => lab.id === field.value);

                    return (
                      <Field>
                        <FieldLabel>Laboratorium</FieldLabel>
                        <Popover open={openLab} onOpenChange={setOpenLab}>
                          <PopoverTrigger asChild>
                            <Button
                              type="button"
                              variant="outline"
                              role="combobox"
                              aria-expanded={openLab}
                              className="w-full justify-between font-normal min-w-0">
                              <span className="truncate">{selectedLaboratorium ? selectedLaboratorium.nama_laboratorium : "Pilih laboratorium"}</span>
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>

                          <PopoverContent
                            className="p-0"
                            align="start"
                            style={{
                              width: "var(--radix-popover-trigger-width)",
                            }}>
                            <Command className="w-full">
                              <CommandInput placeholder="Cari laboratorium..." className="h-9" />
                              <CommandList>
                                <CommandEmpty>Laboratorium tidak ditemukan</CommandEmpty>
                                <CommandGroup className="max-h-62.5 overflow-y-auto">
                                  {laboratoriumList.map((lab) => (
                                    <CommandItem
                                      key={lab.id}
                                      value={lab.nama_laboratorium}
                                      onSelect={() => {
                                        field.onChange(lab.id);
                                        setOpenLab(false);
                                      }}
                                      className="truncate">
                                      {lab.nama_laboratorium}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        {fieldState.error && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    );
                  }}
                />
                <Controller
                  name="tanggal_pengujian"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel htmlFor="tanggal_pengujian">Tanggal Pengujian</FieldLabel>
                      <Input {...field} id="tanggal_pengujian" type="date" value={field.value ?? ""} aria-invalid={fieldState.invalid} />
                      {fieldState.error && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Submit Button */}
        <div className="pt-6 space-y-2">
          <Button type="submit" className="w-full mt-2" disabled={loading}>
            {loading ? "Menyimpan..." : isEditMode ? "Simpan Perubahan" : "Submit"}
          </Button>
          <FieldDescription className="text-center text-gray-500">
            {isEditMode ? "Perbarui data sampel sesuai kebutuhan." : "Isi data sampel baru dengan benar."}
          </FieldDescription>
        </div>
      </FieldGroup>
    </form>
  );
}
