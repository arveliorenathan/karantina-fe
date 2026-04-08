import { CreateTarif, CreateTarifSchema, EditTarif, EditTarifSchema } from "@/lib/schemas/tarif";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "../../ui/field";
import { Input } from "../../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { Button } from "../../ui/button";

interface TarifFormProps {
  defaultValue?: Partial<CreateTarif> | Partial<EditTarif>;
  onSubmit: (data: CreateTarif | EditTarif) => void;
  isEditMode?: boolean;
  loading?: boolean;
}

export default function TarifForm({ defaultValue, onSubmit, loading, isEditMode }: TarifFormProps) {
  const form = useForm<CreateTarif | EditTarif>({
    resolver: zodResolver(isEditMode ? EditTarifSchema : CreateTarifSchema),
    defaultValues: {
      nama_layanan: "",
      deskripsi: "",
      tarif: 0,
      satuan: "",
      kelompok_pengujian: "",
      klasifikasi: "",
      ...defaultValue,
    },
  });

  const handleSubmit = (data: CreateTarif | EditTarif) => {
    onSubmit(data);
  };

  return (
    <div>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-3">
        <FieldGroup>
          <Controller
            name="nama_layanan"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel htmlFor="nama_layanan">
                  Nama Layanan <span className="text-red-500">*</span>
                </FieldLabel>
                <Input {...field} id="nama_layanan" type="text" placeholder="Masukan nama layanan" aria-invalid={fieldState.invalid} required />
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Controller
            name="deskripsi"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel htmlFor="nama_layanan">
                  Deskripsi <span className="text-red-500">*</span>
                </FieldLabel>
                <Input {...field} id="nama_layanan" type="text" placeholder="Masukan nama layanan" aria-invalid={fieldState.invalid} required />
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Controller
            name="kelompok_pengujian"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel htmlFor="nama_layanan">Kelompok Pengujian</FieldLabel>
                <Input {...field} id="nama_layanan" type="text" placeholder="Masukan nama layanan" aria-invalid={fieldState.invalid} required />
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <div className="grid grid-cols-2 gap-4">
            {/* Jenis Kelamin */}
            <Controller
              name="tarif"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor="tarif">
                    Tarif <span className="text-red-500">*</span>
                  </FieldLabel>
                  <Input
                    {...field}
                    id="tarif"
                    type="number"
                    placeholder="0"
                    aria-invalid={fieldState.invalid}
                    required
                    onChange={(e) => {
                      const value = e.target.value;
                      field.onChange(parseFloat(value));
                    }}
                  />
                  {fieldState.error && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            {/* Status */}
            <Controller
              name="satuan"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor="satuan">
                    Satuan <span className="text-red-500">*</span>
                  </FieldLabel>

                  <Input {...field} id="satuan" type="text" placeholder="Sampel, Ekor, ..." aria-invalid={fieldState.invalid} required />
                  {fieldState.error && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </div>

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
                    <SelectValue placeholder="Pilih klasifikasi layanan" />
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

          {/* Button Submit */}
          <Field>
            <Button type="submit" className="w-full mt-2" disabled={loading}>
              {loading ? "Menyimpan..." : isEditMode ? "Simpan Perubahan" : "Submit"}
            </Button>
            <FieldDescription className="text-center text-gray-500">
              {isEditMode ? "Perbarui data tarif layanan sesuai kebutuhan." : "Isi data tarif layanan baru dengan benar."}
            </FieldDescription>
          </Field>
        </FieldGroup>
      </form>
    </div>
  );
}
