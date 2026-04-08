import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  CreateSurat,
  CreateSuratSchema,
  EditSurat,
  EditSuratSchema,
} from "@/lib/schemas/surat";
import { Pegawai } from "@/types/pegawai";
import { Permohonan } from "@/types/permohonan";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { ChevronsUpDown } from "lucide-react";
import React, { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SuratFormProps {
  defaultValue?: Partial<CreateSurat> | Partial<EditSurat>;
  onSubmit: (data: CreateSurat | EditSurat) => void;
  isEditMode?: boolean;
  permohonanList: Permohonan[];
  pegawaiList: Pegawai[];
  loading: boolean;
}

export default function SuratForm({
  defaultValue,
  onSubmit,
  isEditMode,
  permohonanList,
  pegawaiList,
  loading,
}: SuratFormProps) {
  const [searchPenerima, setSearchPenerima] = useState("");
  const [openPermohonan, setOpenPermohonan] = useState(false);
  const [openPemberi, setOpenPemberi] = useState(false);

  const form = useForm<CreateSurat | EditSurat>({
    resolver: zodResolver(isEditMode ? EditSuratSchema : CreateSuratSchema),
    defaultValues: {
      permohonan_id: 0,
      tanggal_surat: "",
      perihal: "",
      pemberi_id: 0,
      penerima_id: [],
      kota_penerbit: "",
      ...defaultValue,
    },
  });

  const filteredPenerimaList = useMemo(() => {
    if (!searchPenerima.trim()) return pegawaiList;

    return pegawaiList.filter((pegawai) =>
      `${pegawai.nama_pegawai} ${pegawai.jabatan || ""}`
        .toLowerCase()
        .includes(searchPenerima.toLowerCase()),
    );
  }, [searchPenerima, pegawaiList]);

  const handleSubmit = (data: CreateSurat | EditSurat) => {
    onSubmit(data);
  };

  return (
    <div>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <FieldGroup>

          {/* Tanggal Surat */}
          <Controller
            name="tanggal_surat"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel htmlFor="tanggal_surat">Tanggal Surat</FieldLabel>
                <Input
                  {...field}
                  id="tanggal_surat"
                  type="date"
                  aria-invalid={fieldState.invalid}
                  required
                />
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          {/* Perihal */}
          <Controller
            name="perihal"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel htmlFor="perihal">Perihal</FieldLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value ?? ""}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pilih perihal surat" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pemerikasaan Administrasi dan Penerimaan Sampel">
                      Pemerikasaan Administrasi dan Penerimaan Sampel
                    </SelectItem>

                    <SelectItem value="Analisa dan Pengujian Sampel">
                      Analisa dan Pengujian Sampel
                    </SelectItem>

                    <SelectItem value="Laporan Hasil Uji Laboratorium">
                      Laporan Hasil Uji Laboratorium
                    </SelectItem>
                  </SelectContent>
                </Select>
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          {/* Permohonan ID*/}
          <Controller
            name="permohonan_id"
            control={form.control}
            render={({ field, fieldState }) => {
              const selectedPermohonan = permohonanList.find(
                (p) => p.id === field.value,
              );

              return (
                <Field>
                  <FieldLabel>Permohonan</FieldLabel>
                  <Popover
                    open={openPermohonan}
                    onOpenChange={setOpenPermohonan}>
                    <PopoverTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        role="combobox"
                        className="w-full justify-between font-normal min-w-0">
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
                        <CommandInput
                          placeholder="Cari kode permohonan..."
                          className="h-9"
                        />
                        <CommandList>
                          <CommandEmpty>
                            Kode permohonan tidak ditemukan
                          </CommandEmpty>
                          <CommandGroup className="max-h-62.5 overflow-y-auto">
                            {permohonanList.map((p) => (
                              <CommandItem
                                key={p.id}
                                value={`${p.kode_permohonan} - ${p.nama_perusahaan}`}
                                onSelect={() => {
                                  field.onChange(p.id);
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

                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              );
            }}
          />

          {/* Kota Penerbit */}
          <Controller
            name="kota_penerbit"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel htmlFor="kota_penerbit">Kota Penerbit</FieldLabel>
                <Input
                  {...field}
                  id="kota_penerbit"
                  type="text"
                  placeholder="Masukkan kota penerbit"
                  aria-invalid={fieldState.invalid}
                  required
                />
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          {/* Pemberi Tugas */}
          <Controller
            name="pemberi_id"
            control={form.control}
            render={({ field, fieldState }) => {
              const selectedPegawai = pegawaiList.find(
                (p) => p.id === field.value,
              );

              return (
                <Field>
                  <FieldLabel>Pemberi Tugas</FieldLabel>
                  <Popover open={openPemberi} onOpenChange={setOpenPemberi}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        className="w-full justify-between font-normal min-w-0">
                        <span className="truncate">
                          {selectedPegawai
                            ? selectedPegawai.nama_pegawai
                            : "Pilih pegawai"}
                        </span>
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
                        <CommandInput
                          placeholder="Cari pegawai..."
                          className="h-9"
                        />
                        <CommandList>
                          <CommandEmpty>Pegawai tidak ditemukan</CommandEmpty>
                          <CommandGroup className="max-h-62.5 overflow-y-auto">
                            {pegawaiList.map((pegawai) => (
                              <CommandItem
                                key={pegawai.id}
                                value={pegawai.nama_pegawai}
                                onSelect={() => {
                                  field.onChange(pegawai.id);
                                  setOpenPemberi(false);
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

                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              );
            }}
          />

          {/* Penerima Tugas */}
          <Controller
            name="penerima_id"
            control={form.control}
            render={({ field, fieldState }) => {
              const selectedIds: number[] = Array.isArray(field.value)
                ? field.value
                : [];

              const toggle = (id: number, checked: boolean) => {
                if (checked) {
                  field.onChange([...selectedIds, id]);
                } else {
                  field.onChange(selectedIds.filter((v) => v !== id));
                }
              };
              return (
                <Field>
                  <FieldLabel>Penerima Tugas</FieldLabel>
                  <div className="relative mb-4">
                    <Input
                      type="text"
                      placeholder="Cari nama pegawai atau jabatan..."
                      value={searchPenerima}
                      onChange={(e) => setSearchPenerima(e.target.value)}
                      className="pr-10"
                    />
                    {searchPenerima && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                        onClick={() => setSearchPenerima("")}>
                        ✕
                      </Button>
                    )}
                  </div>

                  {filteredPenerimaList.length === 0 ? (
                    <div className="text-center py-4 border rounded-md text-gray-500">
                      Tidak ada data pegawai yang ditemukan
                    </div>
                  ) : (
                    <div className="border rounded-md overflow-hidden">
                      <Table>
                        <TableHeader className="bg-primary text-primary-foreground">
                          <TableRow>
                            <TableHead className="w-12 text-center font-semibold text-primary-foreground">
                              Pilih
                            </TableHead>
                            <TableHead className="font-semibold text-primary-foreground">
                              Nama Pegawai
                            </TableHead>
                            <TableHead className="font-semibold text-primary-foreground">
                              Jabatan
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredPenerimaList.map((pegawai) => {
                            const checked = selectedIds.includes(pegawai.id);

                            return (
                              <TableRow
                                key={pegawai.id}
                                className={checked ? "bg-primary/5" : ""}>
                                <TableCell className="text-center">
                                  <Checkbox
                                    checked={checked}
                                    onCheckedChange={(val) =>
                                      toggle(pegawai.id, Boolean(val))
                                    }
                                  />
                                </TableCell>
                                <TableCell className="font-medium">
                                  {pegawai.nama_pegawai}
                                </TableCell>
                                <TableCell className="font-medium">
                                  {pegawai.jabatan || "-"}
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </div>
                  )}

                  <div className="mt-2 text-sm text-gray-500">
                    {selectedIds.length > 0 ? (
                      <span>Dipilih {selectedIds.length} pegawai</span>
                    ) : (
                      <span>Belum ada pegawai yang dipilih</span>
                    )}
                  </div>

                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              );
            }}
          />

          <Field>
            <Button type="submit" className="w-full mt-2" disabled={loading}>
              {loading
                ? "Menyimpan..."
                : isEditMode
                  ? "Simpan Perubahan"
                  : "Submit"}
            </Button>

            <FieldDescription className="text-center text-gray-500">
              {isEditMode
                ? "Perbarui data surat sesuai kebutuhan."
                : "Isi data surat baru dengan benar."}
            </FieldDescription>
          </Field>
        </FieldGroup>
      </form>
    </div>
  );
}
