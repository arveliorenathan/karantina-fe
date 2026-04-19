import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, useWatch } from "react-hook-form";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "../../ui/field";
import { Button } from "../../ui/button";
import { CreateHasilUji, CreateHasilUjiSchema, EditHasilUji, EditHasilUjiSchema } from "@/lib/schemas/hasilUji";
import { Sampel } from "@/types/sampel";
import { Parameter } from "@/types/parameter";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { ChevronsUpDown } from "lucide-react";
import { useState, useEffect } from "react";
import { Pegawai } from "@/types/pegawai";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

interface HasilUjiFormProps {
  defaultValue?: Partial<CreateHasilUji> | Partial<EditHasilUji>;
  onSubmit: (data: CreateHasilUji | EditHasilUji) => void;
  isEditMode?: boolean;
  loading?: boolean;
  sampel?: Sampel;
  parameterList: Parameter[];
  pegawaiList: Pegawai[];
}

export default function HasilUjiForm({ defaultValue, onSubmit, loading, sampel, parameterList, pegawaiList, isEditMode }: HasilUjiFormProps) {
  const [openParameter, setOpenParameter] = useState(false);
  const [openPegawai, setOpenPegawai] = useState(false);

  const form = useForm<CreateHasilUji | EditHasilUji>({
    resolver: zodResolver(isEditMode ? EditHasilUjiSchema : CreateHasilUjiSchema),
    defaultValues: {
      sampel_id: sampel?.id || undefined,
      parameter_id: undefined,
      penguji_id: undefined,
      hasil_sementara: "",
      hasil: "",
      keterangan_sementara: "",
      keterangan: "",
      status: isEditMode ? undefined : "Pengujian",
      status_penerimaan: undefined,
      tanggal_pengujian: "",
      tanggal_selesai: "",
      ...defaultValue,
    },
  });

  const [status] = useWatch({
    control: form.control,
    name: ["status"],
  });

  useEffect(() => {
    if (sampel?.id) {
      form.setValue("sampel_id", sampel.id);
    }
  }, [sampel, status, form]);

  const handleSubmit = (data: CreateHasilUji | EditHasilUji) => {
    onSubmit(data);
    console.log(data);
  };

  return (
    <div>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-3">
        <FieldGroup>
          {/* sampel_id */}
          <Field>
            <FieldLabel>Sampel</FieldLabel>
            <div className="flex flex-col space-y-2 p-3 border rounded-md bg-gray-50">
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-700">Kode:</span>
                <span className="text-sm font-semibold">{sampel?.kode_sampel || "-"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-700">Nama:</span>
                <span className="text-sm font-semibold">{sampel?.nama_sampel || "-"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-700">Spesies:</span>
                <span className="text-sm font-semibold">{sampel?.spesies || "-"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-700">Jumlah:</span>
                <span className="text-sm font-semibold">
                  {sampel?.jumlah || "0"} {sampel?.satuan || ""}
                </span>
              </div>
            </div>
            <Input type="hidden" {...form.register("sampel_id")} value={form.getValues("sampel_id") ?? ""} />
          </Field>

          {/* parameter_id */}
          <Controller
            name="parameter_id"
            control={form.control}
            render={({ field, fieldState }) => {
              const selectedParameter = parameterList.find((parameter) => parameter.id === field.value);

              return (
                <Field>
                  <FieldLabel>Parameter</FieldLabel>
                  <Popover open={openParameter} onOpenChange={setOpenParameter}>
                    <PopoverTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        role="combobox"
                        aria-expanded={openParameter}
                        className="w-full justify-between font-normal min-w-0">
                        <span className="truncate">{selectedParameter ? selectedParameter.nama_parameter : "Pilih parameter"}</span>
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
                        <CommandInput placeholder="Cari parameter..." className="h-9" />
                        <CommandList>
                          <CommandEmpty>Parameter tidak ditemukan</CommandEmpty>
                          <CommandGroup className="max-h-62.5 overflow-y-auto">
                            {parameterList.map((parameter) => (
                              <CommandItem
                                key={parameter.id}
                                value={parameter.nama_parameter}
                                onSelect={() => {
                                  field.onChange(parameter.id);
                                  setOpenParameter(false);
                                }}
                                className="truncate">
                                {parameter.nama_parameter}
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

          {/* penguji */}
          <Controller
            name="penguji_id"
            control={form.control}
            render={({ field, fieldState }) => {
              const selectedPegawai = pegawaiList.find((p) => p.id === field.value);

              return (
                <Field>
                  <FieldLabel>Petugas Penguji</FieldLabel>
                  <Popover open={openPegawai} onOpenChange={setOpenPegawai}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" role="combobox" className="w-full justify-between font-normal min-w-0">
                        <span className="truncate">{selectedPegawai ? selectedPegawai.nama_pegawai : "Pilih pegawai"}</span>
                        <ChevronsUpDown className="h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>

                    <PopoverContent
                      className="p-0"
                      align="start"
                      style={{
                        width: "var(--radix-popover-trigger-width)",
                      }}>
                      <Command className="w-full">
                        <CommandInput placeholder="Cari pegawai..." className="h-9" />
                        <CommandList>
                          <CommandEmpty>Pegawai tidak ditemukan</CommandEmpty>
                          <CommandGroup className="max-h-62.5 overflow-y-auto">
                            {pegawaiList.map((pegawai) => (
                              <CommandItem
                                key={pegawai.id}
                                value={pegawai.nama_pegawai}
                                onSelect={() => {
                                  field.onChange(pegawai.id);
                                  setOpenPegawai(false);
                                }}
                                className="truncate">
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

          {isEditMode && (
            <>
              {/* Status */}
              <Controller
                name="status"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor="status">Status</FieldLabel>
                    <Select onValueChange={field.onChange} value={field.value ?? ""}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Pilih status hasil uji" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Revisi LHU">Revisi LHU</SelectItem>
                        <SelectItem value="LHU Sementara">LHU Sementara</SelectItem>
                        <SelectItem value="Hasil Sementara">Hasil Sementara</SelectItem>
                        <SelectItem value="Pengujian">Pengujian</SelectItem>
                      </SelectContent>
                    </Select>
                    {fieldState.error && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              {status === "Hasil Sementara" && (
                <>
                  {/* Tanggal Pengujian */}
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
                  {/* Status Penerimaan */}
                  <Controller
                    name="status_penerimaan"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field>
                        <FieldLabel htmlFor="status_penerimaan">Status Penerimaan</FieldLabel>
                        <Select onValueChange={field.onChange} value={field.value ?? ""}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Pilih status penerimaan hasil uji" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Terima">Terima</SelectItem>
                            <SelectItem value="Tolak">Tolak</SelectItem>
                          </SelectContent>
                        </Select>
                        {fieldState.error && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />

                  {/* hasil */}
                  <Controller
                    name="hasil_sementara"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field>
                        <FieldLabel htmlFor="hasil_sementara">Hasil Sementara</FieldLabel>
                        <Input
                          {...field}
                          value={field.value ?? ""}
                          id="hasil"
                          type="text"
                          placeholder="Masukan hasil pengujian"
                          aria-invalid={fieldState.invalid}
                          required
                        />
                        {fieldState.error && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />

                  {/* keterangan */}
                  <Controller
                    name="keterangan_sementara"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field>
                        <FieldLabel>Keterangan Sementara</FieldLabel>
                        <Textarea {...field} value={field.value ?? ""} rows={3} />
                        {fieldState.error && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />
                </>
              )}
              
              {(status === "LHU Sementara" || status === "Revisi LHU") && (
                  <>
                    {/* Status Penerimaan */}
                    <Controller
                      name="status_penerimaan"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field>
                          <FieldLabel htmlFor="status_penerimaan">Status Penerimaan</FieldLabel>
                          <Select onValueChange={field.onChange} value={field.value ?? ""}>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Pilih status penerimaan hasil uji" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Terima">Terima</SelectItem>
                              <SelectItem value="Tolak">Tolak</SelectItem>
                            </SelectContent>
                          </Select>
                          {fieldState.error && <FieldError errors={[fieldState.error]} />}
                        </Field>
                      )}
                    />

                    {/* hasil */}
                    <Controller
                      name="hasil_sementara"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field>
                          <FieldLabel htmlFor="hasil_sementara">Hasil Sementara</FieldLabel>
                          <Input
                            {...field}
                            value={field.value ?? ""}
                            id="hasil"
                            type="text"
                            placeholder="Masukan hasil pengujian"
                            aria-invalid={fieldState.invalid}
                            disabled
                            required
                          />
                          {fieldState.error && <FieldError errors={[fieldState.error]} />}
                        </Field>
                      )}
                    />
                    <Controller
                      name="hasil"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field>
                          <FieldLabel htmlFor="hasil">Hasil</FieldLabel>
                          <Input
                            {...field}
                            value={field.value ?? ""}
                            id="hasil"
                            type="text"
                            placeholder="Masukan hasil pengujian"
                            aria-invalid={fieldState.invalid}
                            required
                          />
                          {fieldState.error && <FieldError errors={[fieldState.error]} />}
                        </Field>
                      )}
                    />

                    {/* keterangan */}
                    <Controller
                      name="keterangan_sementara"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field>
                          <FieldLabel>Keterangan Sementara</FieldLabel>
                          <Textarea {...field} value={field.value ?? ""} rows={3} disabled />
                          {fieldState.error && <FieldError errors={[fieldState.error]} />}
                        </Field>
                      )}
                    />

                    <Controller
                      name="keterangan"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field>
                          <FieldLabel>Keterangan</FieldLabel>
                          <Textarea {...field} value={field.value ?? ""} rows={3} />
                          {fieldState.error && <FieldError errors={[fieldState.error]} />}
                        </Field>
                      )}
                    />
                  </>
                )}
            </>
          )}

          {/* Button Submit */}
          <Field>
            <Button type="submit" className="w-full mt-2" disabled={loading}>
              {loading ? "Menyimpan..." : isEditMode ? "Simpan Perubahan" : "Submit"}
            </Button>
            <FieldDescription className="text-center text-gray-500">
              {isEditMode ? "Perbarui data hasil pengujian sesuai kebutuhan." : "Isi data hasil pengujian dengan benar."}
            </FieldDescription>
          </Field>
        </FieldGroup>
      </form>
    </div>
  );
}
