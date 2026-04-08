"use client";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "../../ui/field";
import { Button } from "../../ui/button";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useState } from "react";
import { ChevronsUpDown } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Laboratorium } from "@/types/laboratorium";
import { CreateParameter, CreateParameterSchema, EditParameter, EditParameterSchema } from "@/lib/schemas/parameter";

interface ParameterFormProps {
  defaultValue?: Partial<CreateParameter> | Partial<EditParameter>;
  onSubmit: (data: CreateParameter | EditParameter) => void;
  laboratoriumList: Laboratorium[];
  isEditMode?: boolean;
  loading: boolean;
}

export default function ParameterForm({ defaultValue, onSubmit, laboratoriumList, isEditMode, loading }: ParameterFormProps) {
  const [open, setOpen] = useState(false);
  const form = useForm<CreateParameter | EditParameter>({
    resolver: zodResolver(isEditMode ? EditParameterSchema : CreateParameterSchema),
    defaultValues: {
      nama_parameter: "",
      satuan_parameter: "",
      lod: defaultValue?.lod ?? "",
      standar_parameter: "",
      metode_pengujian: "",
      spesifikasi_pengujian: "",
      keterangan_parameter: undefined,
      klasifikasi_parameter: "",
      estimasi_pnbp: "",
      kel_param: "",
      kel_param2: "",
      kel_param3: "",
      lab_id: undefined,
      sub_organo: "",
      estimasi_pengujian: "",
      status: isEditMode ? defaultValue?.status : "Tersedia",
      ...defaultValue,
    },
  });

  const handleSubmit = (data: CreateParameter | EditParameter) => {
    onSubmit(data);
  };

  return (
    <div>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-3">
        <FieldGroup>
          {/* Nama Parameter */}
          <Controller
            name="nama_parameter"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field className="space-y-1">
                <FieldLabel htmlFor="nama_parameter">
                  Nama Parameter <span className="text-red-500">*</span>
                </FieldLabel>
                <Input {...field} id="nama_parameter" type="text" placeholder="Masukkan nama parameter" aria-invalid={fieldState.invalid} />
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          {/* Satuan Parameter */}
          <Controller
            name="satuan_parameter"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field className="space-y-1">
                <FieldLabel htmlFor="satuan_parameter">
                  Satuan Parameter <span className="text-red-500">*</span>
                </FieldLabel>
                <Input {...field} id="satuan_parameter" type="text" placeholder="Masukkan satuan parameter" aria-invalid={fieldState.invalid} />
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            {/* LOD */}
            <Controller
              name="lod"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field className="space-y-1">
                  <FieldLabel htmlFor="lod">LOD (Limit of Detection)</FieldLabel>
                  <Input
                    {...field}
                    id="lod"
                    type="text"
                    aria-invalid={fieldState.invalid}
                    placeholder="Opsional"
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                  {fieldState.error && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            {/* Standar Parameter */}
            <Controller
              name="standar_parameter"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field className="space-y-1">
                  <FieldLabel htmlFor="standar_parameter">
                    Standar Parameter <span className="text-red-500">*</span>
                  </FieldLabel>
                  <Input {...field} id="standar_parameter" type="text" aria-invalid={fieldState.invalid} placeholder="Masukkan standar parameter" />
                  {fieldState.error && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            {/* Metode Pengujian */}
            <Controller
              name="metode_pengujian"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field className="space-y-1">
                  <FieldLabel htmlFor="metode_pengujian">
                    Metode Pengujian <span className="text-red-500">*</span>
                  </FieldLabel>
                  <Input {...field} id="metode_pengujian" type="text" aria-invalid={fieldState.invalid} placeholder="Masukkan metode pengujian" />
                  {fieldState.error && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            {/* Spesifikasi Sampel */}
            <Controller
              name="spesifikasi_pengujian"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field className="space-y-1">
                  <FieldLabel htmlFor="spesifikasi_pengujian">Spesifikasi Pengujian</FieldLabel>
                  <Input
                    {...field}
                    id="spesifikasi_pengujian"
                    type="text"
                    aria-invalid={fieldState.invalid}
                    placeholder="Opsional"
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                  {fieldState.error && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            {/* Keterangan Parameter */}
            <Controller
              name="keterangan_parameter"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field className="space-y-1">
                  <FieldLabel htmlFor="keterangan_parameter">
                    Keterangan Parameter <span className="text-red-500">*</span>
                  </FieldLabel>
                  <Select
                    value={field.value ?? ""}
                    onValueChange={(value) => {
                      field.onChange(value);
                    }}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Pilih KAN / Non KAN" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="KAN">Tertelusur (KAN)</SelectItem>
                      <SelectItem value="Non KAN">Non KAN</SelectItem>
                    </SelectContent>
                  </Select>
                  {fieldState.error && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            {/* Klasifikasi Parameter */}
            <Controller
              name="klasifikasi_parameter"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field className="space-y-1">
                  <FieldLabel htmlFor="klasifikasi_parameter">
                    Klasifikasi Parameter <span className="text-red-500">*</span>
                  </FieldLabel>
                  <Select onValueChange={field.onChange} value={field.value ?? ""}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Pilih klasifikasi parameter" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="KH">Hewan</SelectItem>
                      <SelectItem value="KI">Ikan</SelectItem>
                      <SelectItem value="KT">Tumbuhan</SelectItem>
                    </SelectContent>
                  </Select>
                  {fieldState.error && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            {/* Laboratorium */}
            <Controller
              name="lab_id"
              control={form.control}
              render={({ field, fieldState }) => {
                const selectedLaboratorium = laboratoriumList.find((lab) => lab.id === field.value);

                return (
                  <Field>
                    <FieldLabel>
                      Laboratorium <span className="text-red-500">*</span>
                    </FieldLabel>

                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger asChild>
                        <Button variant="outline" role="combobox" className="w-full justify-between font-normal">
                          {selectedLaboratorium ? selectedLaboratorium.nama_laboratorium : "Pilih laboratorium"}

                          <ChevronsUpDown className="h-4 w-4 opacity-50" />
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
                                    setOpen(false);
                                  }}>
                                  {lab.nama_laboratorium} - {lab.nama_kantor}
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

            {/* Estimasi PNBP */}
            <Controller
              name="estimasi_pnbp"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field className="space-y-1">
                  <FieldLabel htmlFor="estimasi_pnbp">
                    Estimasi PNBP (Rp) <span className="text-red-500">*</span>
                  </FieldLabel>
                  <Input {...field} id="estimasi_pnbp" type="text" placeholder="Contoh: 150000" aria-invalid={fieldState.invalid} />
                  {fieldState.error && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            {/* kel_param */}
            <Controller
              name="kel_param"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field className="space-y-1">
                  <FieldLabel htmlFor="kel_param">Kel. Parameter</FieldLabel>
                  <Input
                    {...field}
                    id="kel_param"
                    type="text"
                    aria-invalid={fieldState.invalid}
                    placeholder="Contoh: CKIB, HPIK"
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                  {fieldState.error && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            {/* kel_param2 */}
            <Controller
              name="kel_param2"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field className="space-y-1">
                  <FieldLabel htmlFor="kel_param2">Kel. Parameter 2</FieldLabel>
                  <Input
                    {...field}
                    id="kel_param2"
                    type="text"
                    aria-invalid={fieldState.invalid}
                    placeholder="Opsional"
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                  {fieldState.error && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            {/* kel_param3 */}
            <Controller
              name="kel_param3"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field className="space-y-1">
                  <FieldLabel htmlFor="kel_param3">Kel. Parameter 3</FieldLabel>
                  <Input
                    {...field}
                    id="kel_param3"
                    type="text"
                    aria-invalid={fieldState.invalid}
                    placeholder="Opsional"
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                  {fieldState.error && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            {/* Sub Organo */}
            <Controller
              name="sub_organo"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field className="space-y-1">
                  <FieldLabel htmlFor="sub_organo">Sub Organo</FieldLabel>
                  <Input
                    {...field}
                    id="sub_organo"
                    type="text"
                    aria-invalid={fieldState.invalid}
                    placeholder="Opsional"
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                  {fieldState.error && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            {/* Estimasi Pengujian */}
            <Controller
              name="estimasi_pengujian"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field className="space-y-1">
                  <FieldLabel htmlFor="estimasi_pengujian">Estimasi Pengujian</FieldLabel>
                  <Input
                    {...field}
                    id="estimasi_pengujian"
                    type="text"
                    aria-invalid={fieldState.invalid}
                    placeholder="- hari"
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                  {fieldState.error && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            {/* Status */}
            <Controller
              name="status"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field className="space-y-1">
                  <FieldLabel htmlFor="status">
                    Ketersediaan <span className="text-red-500">*</span>
                  </FieldLabel>
                  <Select onValueChange={field.onChange} value={field.value ?? ""}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Pilih status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Tersedia">Tersedia</SelectItem>
                      <SelectItem value="Tidak Tersedia">Tidak Tersedia</SelectItem>
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
              {isEditMode ? "Perbarui data parameter sesuai kebutuhan." : "Isi data parameter baru dengan benar."}
            </FieldDescription>
          </Field>
        </FieldGroup>
      </form>
    </div>
  );
}
