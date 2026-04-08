"use client";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "../../ui/field";
import { Button } from "../../ui/button";
import {
  CreateLaboratorium,
  CreateLaboratoriumSchema,
  EditLaboratorium,
  EditLaboratoriumSchema,
} from "@/lib/schemas/laboratorium";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import { ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Pegawai } from "@/types/pegawai";

interface LaboratoriumFormProps {
  defaultValue?: Partial<CreateLaboratorium> | Partial<EditLaboratorium>;
  onSubmit: (data: CreateLaboratorium | EditLaboratorium) => void;
  pegawaiList: Pegawai[];
  isEditMode?: boolean;
  loading?: boolean;
}

export default function LaboratoriumForm({
  defaultValue,
  onSubmit,
  pegawaiList,
  loading,
  isEditMode,
}: LaboratoriumFormProps) {
  const [open, setOpen] = useState(false);
  const form = useForm<CreateLaboratorium | EditLaboratorium>({
    resolver: zodResolver(
      isEditMode ? EditLaboratoriumSchema : CreateLaboratoriumSchema,
    ),
    defaultValues: {
      nama_laboratorium: "",
      nama_kantor: "",
      alamat: "",
      kontak: "",
      pegawai_id: undefined,
      klasifikasi: undefined,
      status: isEditMode ? defaultValue?.status : "Aktif",
      ...defaultValue,
    },
  });

  const handleSubmit = (data: CreateLaboratorium | EditLaboratorium) => {
    onSubmit(data);
  };

  return (
    <div>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-3">
        <FieldGroup>
          {/* Nama Laboratorium */}
          <Controller
            name="nama_laboratorium"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel htmlFor="nama_laboratorium">
                  Nama Laboratorium <span className="text-red-500">*</span>
                </FieldLabel>
                <Input
                  {...field}
                  id="nama_laboratorium"
                  type="text"
                  placeholder="Contoh: Laboratorium Hewan {nama kantor}"
                  aria-invalid={fieldState.invalid}
                  required
                />
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          {/* Nama Kantor */}
          <Controller
            name="nama_kantor"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel htmlFor="nama_kantor">
                  Nama Kantor <span className="text-red-500">*</span>
                </FieldLabel>
                <Input {...field} id="nama_kantor" type="text" placeholder="Masukan nama kantor" aria-invalid={fieldState.invalid} required />
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Alamat */}
            <Controller
              name="alamat"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor="alamat">
                    Alamat <span className="text-red-500">*</span>
                  </FieldLabel>
                  <Input {...field} id="alamat" type="text" placeholder="Masukan alamat kantor" aria-invalid={fieldState.invalid} required />
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
                  <Input {...field} id="kontak" type="text" placeholder="Contoh: 08......." aria-invalid={fieldState.invalid} required />
                  {fieldState.error && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </div>

          {/* Penanggung Jawab */}
          <Controller
            name="pegawai_id"
            control={form.control}
            render={({ field, fieldState }) => {
              const selectedPegawai = pegawaiList.find((p) => p.id === field.value);

              return (
                <Field>
                  <FieldLabel>
                    Penanggung Jawab <span className="text-red-500">*</span>
                  </FieldLabel>

                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" role="combobox" className="w-full justify-between font-normal">
                        {selectedPegawai ? selectedPegawai.nama_pegawai : "Pilih pegawai"}

                        <ChevronsUpDown className="h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>

                    <PopoverContent
                      className="p-0"
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
                                  setOpen(false);
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Klasifikasi */}
            <Controller
              name="klasifikasi"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor="klasifikasi">
                    Klasifikasi <span className="text-red-500">*</span>
                  </FieldLabel>
                  <Select onValueChange={field.onChange} value={field.value ?? ""}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Pilih jenis klasifikasi" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="KH">Karantina Hewan</SelectItem>
                      <SelectItem value="KI">Karantina Ikan</SelectItem>
                      <SelectItem value="KT">Karantina Tumbuhan</SelectItem>
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
                  <FieldLabel htmlFor="klasifikasi">
                    Status <span className="text-red-500">*</span>
                  </FieldLabel>
                  <Select onValueChange={field.onChange} value={field.value ?? ""}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Pilih status laboratorium" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Aktif">Aktif</SelectItem>
                      <SelectItem value="Perbaikan">Perbaikan</SelectItem>
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
              {isEditMode ? "Perbarui data laboratorium sesuai kebutuhan." : "Isi data laboratorium baru dengan benar."}
            </FieldDescription>
          </Field>
        </FieldGroup>
      </form>
    </div>
  );
}
