import { CreatePegawai, CreatePegawaiSchema, EditPegawai, EditPegawaiSchema } from "@/lib/schemas/pegawai";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "../../ui/field";
import { Input } from "../../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { Button } from "../../ui/button";

interface PegawaiFormProps {
  defaultValue?: Partial<CreatePegawai> | Partial<EditPegawai>;
  onSubmit: (data: CreatePegawai | EditPegawai) => void;
  isEditMode?: boolean;
  loading?: boolean;
}

export default function PegawaiForm({ defaultValue, onSubmit, loading, isEditMode }: PegawaiFormProps) {
  const form = useForm<CreatePegawai | EditPegawai>({
    resolver: zodResolver(isEditMode ? EditPegawaiSchema : CreatePegawaiSchema),
    defaultValues: {
      nip: "",
      nama_pegawai: "",
      golongan: "",
      jabatan: "",
      email: "",
      kontak: "",
      jenis_kelamin: undefined,
      status: isEditMode ? defaultValue?.status : "Aktif",
      ...defaultValue,
    },
  });

  const handleSubmit = (data: CreatePegawai | EditPegawai) => {
    onSubmit(data);
  };

  return (
    <div>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-3">
        <FieldGroup>
          <div className="grid grid-cols-2 gap-4">
            {/* NIP */}
            <Controller
              name="nip"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor="nip">
                    NIP <span className="text-red-500">*</span>
                  </FieldLabel>
                  <Input {...field} id="nip" type="text" placeholder="Masukkan NIP pegawai" aria-invalid={fieldState.invalid} required />
                  {fieldState.error && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            {/* Nama Pegawai */}
            <Controller
              name="nama_pegawai"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor="nama_pegawai">
                    Nama <span className="text-red-500">*</span>
                  </FieldLabel>
                  <Input {...field} id="nama_pegawai" type="text" placeholder="Masukkan nama pegawai" aria-invalid={fieldState.invalid} required />
                  {fieldState.error && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Golongan */}
            <Controller
              name="golongan"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor="golongan">
                    Golongan <span className="text-red-500">*</span>
                  </FieldLabel>
                  <Select onValueChange={field.onChange} value={field.value ?? ""}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Pilih golongan pegawai" />
                    </SelectTrigger>
                    <SelectContent>
                      {/* Golongan IV */}
                      <SelectItem value="Golongan IV/a - Pembina Utama">Golongan IV/a - Pembina Utama</SelectItem>
                      <SelectItem value="Golongan IV/b - Pembina Utama Muda">Golongan IV/b - Pembina Utama Muda</SelectItem>
                      <SelectItem value="Golongan IV/c - Pembina Tingkat I">Golongan IV/c - Pembina Tingkat I</SelectItem>
                      <SelectItem value="Golongan IV/d - Pembina Utama Madya">Golongan IV/d - Pembina Utama Madya</SelectItem>
                      <SelectItem value="Golongan IV/e - Pembina Utama">Golongan IV/e - Pembina Utama</SelectItem>

                      {/* Golongan III */}
                      <SelectItem value="Golongan III/a - Penata Muda">Golongan III/a - Penata Muda</SelectItem>
                      <SelectItem value="Golongan III/b - Penata Muda Tingkat I">Golongan III/b - Penata Muda Tingkat I</SelectItem>
                      <SelectItem value="Golongan III/c - Penata">Golongan III/c - Penata</SelectItem>
                      <SelectItem value="Golongan III/d - Penata Tingkat I">Golongan III/d - Penata Tingkat I</SelectItem>

                      {/* Golongan II */}
                      <SelectItem value="Golongan II/a - Pengatur Muda">Golongan II/a - Pengatur Muda</SelectItem>
                      <SelectItem value="Golongan II/b - Pengatur Muda Tingkat I">Golongan II/b - Pengatur Muda Tingkat I</SelectItem>
                      <SelectItem value="Golongan II/c - Pengatur">Golongan II/c - Pengatur</SelectItem>
                      <SelectItem value="Golongan II/d - Pengatur Tingkat I">Golongan II/d - Pengatur Tingkat I</SelectItem>

                      {/* Golongan I */}
                      <SelectItem value="Golongan I/a - Juru Muda">Golongan I/a - Juru Muda</SelectItem>
                      <SelectItem value="Golongan I/b - Juru Juru Muda Tingkat I">Golongan I/b - Juru Muda Tingkat I</SelectItem>
                      <SelectItem value="Golongan I/c - Juru">Golongan I/c - Juru</SelectItem>
                      <SelectItem value="Golongan I/d - Juru Tingkat I">Golongan I/d - Juru Tingkat I</SelectItem>
                    </SelectContent>
                  </Select>
                  {fieldState.error && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            {/* Jabatan */}
            <Controller
              name="jabatan"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor="jabatan">
                    Jabatan <span className="text-red-500">*</span>
                  </FieldLabel>
                  <Input {...field} id="jabatan" type="text" placeholder="Contoh: Kepala BBKHIT Bali" aria-invalid={fieldState.invalid} required />
                  {fieldState.error && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Email */}
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor="email">
                    Email <span className="text-red-500">*</span>
                  </FieldLabel>
                  <Input {...field} id="email" type="email" placeholder="Contoh: example@gmail.com" aria-invalid={fieldState.invalid} required />
                  {fieldState.error && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            {/* Kontak */}
            <Controller
              name="kontak"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor="kontak">
                    Kontak <span className="text-red-500">*</span>
                  </FieldLabel>
                  <Input {...field} id="kontak" type="text" placeholder="Contoh: 08..." aria-invalid={fieldState.invalid} required />
                  {fieldState.error && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Jenis Kelamin */}
            <Controller
              name="jenis_kelamin"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor="jenis_kelamin">
                    Jenis Kelamin <span className="text-red-500">*</span>
                  </FieldLabel>
                  <Select onValueChange={field.onChange} value={field.value ?? ""}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Pilih jenis kelamin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pria">Laki-Laki</SelectItem>
                      <SelectItem value="Wanita">Perempuan</SelectItem>
                    </SelectContent>
                  </Select>
                  {fieldState.error && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            {/* Status */}
            <Controller
              name="status"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor="status">
                    Status <span className="text-red-500">*</span>
                  </FieldLabel>
                  <Select onValueChange={field.onChange} value={field.value ?? ""}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Pilih status pegawai" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Aktif">Aktif</SelectItem>
                      <SelectItem value="Cuti">Cuti</SelectItem>
                      <SelectItem value="Non Aktif">Non Aktif</SelectItem>
                    </SelectContent>
                  </Select>
                  {fieldState.error && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </div>

          {/* Button Submit */}
          <Field>
            <Button type="submit" className="w-full mt-2" disabled={loading}>
              {loading ? "Menyimpan..." : isEditMode ? "Simpan Perubahan" : "Submit"}
            </Button>
            <FieldDescription className="text-center text-gray-500">
              {isEditMode ? "Perbarui data pegawai sesuai kebutuhan." : "Isi data pegawai baru dengan benar."}
            </FieldDescription>
          </Field>
        </FieldGroup>
      </form>
    </div>
  );
}
