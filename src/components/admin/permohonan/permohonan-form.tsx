"use client";
import { CreatePermohonan, CreatePermohonanSchema, EditPermohonan, EditPermohonanSchema } from "@/lib/schemas/permohonan";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "../../ui/field";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { ChevronsUpDown } from "lucide-react";
import { Laboratorium } from "@/types/laboratorium";
import { Pegawai } from "@/types/pegawai";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface PermohonanFormProps {
  defaultValue?: Partial<CreatePermohonan> | Partial<EditPermohonan>;
  onSubmit: (data: CreatePermohonan | EditPermohonan) => void;
  isEditMode?: boolean;
  laboratoriumList: Laboratorium[];
  pegawaiList: Pegawai[];
  loading: boolean;
}

export default function PermohonanForm({ defaultValue, pegawaiList, laboratoriumList, onSubmit, isEditMode, loading }: PermohonanFormProps) {
  const [openLab, setOpenLab] = useState(false);
  const [openPegawai, setOpenPegawai] = useState(false);

  const form = useForm<CreatePermohonan | EditPermohonan>({
    resolver: zodResolver(isEditMode ? EditPermohonanSchema : CreatePermohonanSchema),
    defaultValues: {
      nama_perusahaan: "",
      nama_pembawa: "",
      kontak: "",
      alamat: "",
      tujuan_pengujian: "",
      nomor_refrensi: "",
      lab_id: undefined,
      pegawai_id: undefined,
      status: undefined,
      status_penerimaan: isEditMode ? defaultValue?.status_penerimaan : "Menunggu Konfirmasi Admin",
      tanggal_masuk: "",
      tanggal_diterima: "",
      keterangan: "",
      ...defaultValue,
    },
  });

  const [nama_perusahaan, nama_pembawa, lab_id, status_penerimaan] = useWatch({
    control: form.control,
    name: ["nama_perusahaan", "nama_pembawa", "lab_id", "status_penerimaan"],
  });

  useEffect(() => {
    if (!isEditMode && lab_id) {
      const selectedLaboratorium = laboratoriumList.find((lab) => lab.id === lab_id);
      if (selectedLaboratorium) {
        form.setValue("status", "Distribusi Laboratorium");
      }
    }

    if (status_penerimaan === "Terima") {
      const today = new Date().toISOString().split("T")[0];
      form.setValue("tanggal_diterima", today);
    }
  }, [nama_perusahaan, nama_pembawa, lab_id, isEditMode, laboratoriumList, form, status_penerimaan]);

  const handleSubmit = (data: CreatePermohonan | EditPermohonan) => {
    onSubmit(data);
  };

  return (
    <div>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-3">
        <FieldGroup>
          <div className="grid grid-cols-2 gap-4">
            <Controller
              name="nama_perusahaan"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor="nama_perusahaan">
                    Nama Perusahaan <span className="text-red-500">*</span>
                  </FieldLabel>
                  <Input
                    {...field}
                    id="nama_perusahaan"
                    type="text"
                    aria-invalid={fieldState.invalid}
                    placeholder="Nama perusahaan pengguna jasa"
                    required
                  />
                  {fieldState.error && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="nama_pembawa"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor="nama_pembawa">
                    Nama Pembawa <span className="text-red-500">*</span>
                  </FieldLabel>
                  <Input {...field} id="nama_pembawa" type="text" aria-invalid={fieldState.invalid} placeholder="Nama pembawa sampel" required />
                  {fieldState.error && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Controller
              name="kontak"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor="kontak">
                    Kontak<span className="text-red-500">*</span>
                  </FieldLabel>
                  <Input {...field} id="kontak" type="text" aria-invalid={fieldState.invalid} required placeholder="Kontak pengguna jasa" />
                  {fieldState.error && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="alamat"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor="alamat">
                    Alamat<span className="text-red-500">*</span>
                  </FieldLabel>
                  <Input {...field} id="alamat" type="text" aria-invalid={fieldState.invalid} placeholder="Alamat pengguna jasa" required />
                  {fieldState.error && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Controller
              name="tujuan_pengujian"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor="tujuan_pengujian">
                    Tujuan Pengujian<span className="text-red-500">*</span>
                  </FieldLabel>
                  <Select onValueChange={field.onChange} value={field.value ?? ""}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Pilih tujuan pengujian" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Monitoring Mandiri">Monitoring Mandiri</SelectItem>
                      <SelectItem value="Wabah Penyakit">Wabah Penyakit</SelectItem>
                      <SelectItem value="Penelitian">Penelitian</SelectItem>
                      <SelectItem value="Uji Banding">Uji Banding</SelectItem>
                      <SelectItem value="Uji Profisiensi">Uji Profisiensi</SelectItem>
                      <SelectItem value="Lalu Lintas Domestik">Lalu Lintas Domestik</SelectItem>
                      <SelectItem value="Lalu Lintas Ekspor">Lalu Lintas Ekspor</SelectItem>
                      <SelectItem value="Lalu Lintas Impor">Lalu Lintas Impor</SelectItem>
                      <SelectItem value="Lainnya">Lainnya</SelectItem>
                    </SelectContent>
                  </Select>
                  {fieldState.error && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="nomor_refrensi"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor="nomor_refrensi">Nomor Referensi</FieldLabel>
                  <Input
                    placeholder="Nomor Referensi"
                    name="nomor_refrensi"
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                  {fieldState.error && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Laboratorium */}
            <Controller
              name="lab_id"
              control={form.control}
              render={({ field, fieldState }) => {
                const selectedLaboratorium = laboratoriumList.find((lab) => lab.id === field.value);

                return (
                  <Field>
                    <FieldLabel>
                      Laboratorium<span className="text-red-500">*</span>
                    </FieldLabel>
                    <Popover open={openLab} onOpenChange={setOpenLab}>
                      <PopoverTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          role="combobox"
                          aria-expanded={openLab}
                          className="w-full justify-between font-normal">
                          {selectedLaboratorium ? selectedLaboratorium.nama_laboratorium : "Pilih laboratorium"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>

                      <PopoverContent
                        className="p-0"
                        style={{
                          width: "var(--radix-popover-trigger-width)",
                        }}>
                        <Command>
                          <CommandInput placeholder="Cari laboratorium..." />
                          <CommandList>
                            <CommandEmpty>Laboratorium tidak ditemukan</CommandEmpty>
                            <CommandGroup>
                              {laboratoriumList.map((lab) => (
                                <CommandItem
                                  key={lab.id}
                                  value={lab.nama_laboratorium}
                                  onSelect={() => {
                                    field.onChange(lab.id);
                                    setOpenLab(false);
                                  }}>
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

            {/* Pegawai */}
            <Controller
              name="pegawai_id"
              control={form.control}
              render={({ field, fieldState }) => {
                const selectedPegawai = pegawaiList.find((p) => p.id === field.value);

                return (
                  <Field>
                    <FieldLabel>
                      Petugas Penerima <span className="text-red-500">*</span>
                    </FieldLabel>

                    <Popover open={openPegawai} onOpenChange={setOpenPegawai}>
                      <PopoverTrigger asChild>
                        <Button variant="outline" role="combobox" className="w-full justify-between font-normal">
                          {selectedPegawai ? selectedPegawai.nama_pegawai : "Pilih pegawai"}

                          <ChevronsUpDown className="h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>

                      <PopoverContent
                        className="p-0 "
                        style={{
                          width: "var(--radix-popover-trigger-width)",
                        }}>
                        <Command>
                          <CommandInput placeholder="Cari pegawai..." />

                          <CommandList>
                            <CommandEmpty>Pegawai tidak ditemukan</CommandEmpty>

                            <CommandGroup>
                              {pegawaiList.map((pegawai) => (
                                <CommandItem
                                  key={pegawai.id}
                                  value={pegawai.nama_pegawai}
                                  onSelect={() => {
                                    field.onChange(pegawai.id);
                                    setOpenPegawai(false);
                                  }}>
                                  {pegawai.nama_pegawai}
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Controller
              name="status"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor="klasifikasi">
                    Status <span className="text-red-500">*</span>
                  </FieldLabel>
                  <Select onValueChange={field.onChange} value={field.value ?? ""}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Pilih status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Selesai">Selesai</SelectItem>
                      <SelectItem value="Pengujian Laboratorium">Pengujian Laboratorium</SelectItem>
                      <SelectItem value="Distribusi Laboratorium">Distribusi Laboratorium</SelectItem>
                    </SelectContent>
                  </Select>
                  {fieldState.error && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="tanggal_masuk"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>
                    Tanggal Masuk <span className="text-red-500">*</span>
                  </FieldLabel>
                  <Input
                    {...field}
                    value={field.value ? new Date(field.value).toISOString().split("T")[0] : "-"}
                    onChange={(e) => field.onChange(e.target.value)}
                    type="date"
                    aria-invalid={fieldState.invalid}
                    required
                  />
                  {fieldState.error && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </div>
          <Controller
            name="status_penerimaan"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel htmlFor="klasifikasi">
                  Status Penerimaan <span className="text-red-500">*</span>
                </FieldLabel>
                <Select onValueChange={field.onChange} value={field.value ?? ""}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pilih status penerimaan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Terima">Terima</SelectItem>
                    <SelectItem value="Tolak">Tolak</SelectItem>
                    <SelectItem value="Menunggu Konfirmasi Admin">Menunggu Konfirmasi Admin</SelectItem>
                    <SelectItem value="Dibatalkan">Dibatalkan</SelectItem>
                  </SelectContent>
                </Select>
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          {status_penerimaan === "Terima" && (
            <Controller
              name="tanggal_diterima"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Tanggal Diterima</FieldLabel>
                  <Input
                    {...field}
                    value={field.value ? new Date(field.value).toISOString().split("T")[0] : "-"}
                    onChange={(e) => field.onChange(e.target.value)}
                    type="date"
                    aria-invalid={fieldState.invalid}
                    readOnly
                  />
                  {fieldState.error && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          )}

          {status_penerimaan === "Tolak" && (
            <Controller
              name="keterangan"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Keterangan Pembatalan</FieldLabel>
                  <Textarea {...field} value={field.value ?? ""} rows={3} />
                  <FieldError>{fieldState.error?.message}</FieldError>
                </Field>
              )}
            />
          )}

          <Field>
            <Button type="submit" className="w-full mt-2" disabled={loading}>
              {loading ? "Menyimpan..." : isEditMode ? "Simpan Perubahan" : "Submit"}
            </Button>

            <FieldDescription className="text-center text-gray-500">
              {isEditMode ? "Perbarui data permohonan sesuai kebutuhan." : "Isi data permohonan baru dengan benar."}
            </FieldDescription>
          </Field>
        </FieldGroup>
      </form>
    </div>
  );
}
