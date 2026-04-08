"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "../../ui/field";
import { Button } from "../../ui/button";
import { CreatePNBP, CreatePNBPSchema, EditPNBP, EditPNBPSchema } from "@/lib/schemas/pnbp";
import { Tarif } from "@/types/tarif";
import { Permohonan } from "@/types/permohonan";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { ChevronsUpDown } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { getTarif } from "@/services/tarifService";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pegawai } from "@/types/pegawai";

interface PnbpFormProps {
  defaultValue?: Partial<CreatePNBP> | Partial<EditPNBP>;
  onSubmit: (data: CreatePNBP | EditPNBP) => void;
  isEditMode?: boolean;
  permohonanList: Permohonan[];
  pegawaiList: Pegawai[];
  loading: boolean;
}

export default function PNBPForm({ defaultValue, pegawaiList, permohonanList, onSubmit, isEditMode, loading }: PnbpFormProps) {
  const [openPermohonan, setOpenPermohonan] = useState(false);
  const [openPegawai, setOpenPegawai] = useState(false);
  const [searchTarif, setSearchTarif] = useState("");
  const [tarifList, setTarifList] = useState<Tarif[]>([]);
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({});

  const form = useForm<CreatePNBP | EditPNBP>({
    resolver: zodResolver(isEditMode ? EditPNBPSchema : CreatePNBPSchema),
    defaultValues: {
      kode_permohonan: "",
      pegawai_id: 0,
      no_bil: "",
      ntpn: "",
      tarif_id: [],
      total_nominal: 0,
      tanggal_pnbp: "",
      status: "",
      jumlah: [],
      ...defaultValue,
    },
  });
  const selectedTarifIds = form.watch("tarif_id") || [];
  const status = form.watch("status");

  const handleQuantityChange = (tarifId: number, quantity: number) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [tarifId]: quantity,
    }));

    const updatedJumlah = selectedTarifIds.map((id) => quantities[id] || 0);
    form.setValue("jumlah", updatedJumlah);
  };

  const calculateTotalNominal = (selectedTarifIds: number[]) => {
    let total = 0;
    selectedTarifIds.forEach((tarifId: number) => {
      const tarif = tarifList.find((t) => t.id === tarifId);
      const quantity = quantities[tarifId] || 0;
      if (tarif && quantity > 0) {
        total += tarif.tarif * quantity;
      }
    });
    return total;
  };

  const handleSubmit = (data: CreatePNBP | EditPNBP) => {
    // Only calculate total_nominal for new entries
    if (!isEditMode) {
      const total = calculateTotalNominal(selectedTarifIds);
      data.total_nominal = total;
      data.jumlah = selectedTarifIds.map((id) => quantities[id]);
    }

    onSubmit(data);
    console.log("Data: ", data);
  };
  const fetchTarifByPermohonan = async (permohonan: Permohonan) => {
    if (permohonan.laboratorium?.klasifikasi) {
      try {
        const result = await getTarif({ klasifikasi: permohonan.laboratorium.klasifikasi });
        setTarifList(result.data);
        setQuantities({});
        form.setValue("tarif_id", []);
        form.setValue("total_nominal", 0);
      } catch (error) {
        console.error("Gagal memuat tarif:", error);
        setTarifList([]);
      }
    } else {
      setTarifList([]);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
      <FieldGroup>
        <div className="space-y-6">
          {/* Pilih Permohonan Card */}
          <Card className="border rounded-lg shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Informasi Kuitansi</CardTitle>
              <CardDescription className="text-gray-500">Masukkan detail informasi kuitansi.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Controller
                name="kode_permohonan"
                control={form.control}
                render={({ field, fieldState }) => {
                  const selectedPermohonan = permohonanList.find((p) => p.kode_permohonan === field.value);
                  return (
                    <Field>
                      <FieldLabel>
                        Kode Permohonan <span className="text-red-500">*</span>
                      </FieldLabel>
                      <Popover open={openPermohonan} onOpenChange={setOpenPermohonan}>
                        <PopoverTrigger asChild>
                          <Button
                            type="button"
                            variant="outline"
                            role="combobox"
                            aria-expanded={openPermohonan}
                            className={`w-full justify-between font-normal h-12 ${
                              fieldState.error ? "border-red-500 focus-visible:ring-red-500" : ""
                            }`}>
                            <span className="truncate text-left">
                              {selectedPermohonan
                                ? `${selectedPermohonan.kode_permohonan} - ${selectedPermohonan.nama_perusahaan}`
                                : "Pilih kode permohonan"}
                            </span>
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent
                          className="w-(--radix-popover-trigger-width) max-h-[--radix-popover-content-available-height]"
                          align="start"
                          sideOffset={4}>
                          <Command>
                            <CommandInput placeholder="Cari kode permohonan..." className="h-9" />
                            <CommandList>
                              <CommandEmpty className="py-6 text-center text-sm">
                                <div className="flex flex-col items-center gap-1">
                                  <span>Kode permohonan tidak ditemukan</span>
                                </div>
                              </CommandEmpty>
                              <CommandGroup>
                                {permohonanList.map((p) => (
                                  <CommandItem
                                    key={p.id}
                                    value={`${p.kode_permohonan} - ${p.nama_perusahaan}`}
                                    onSelect={() => {
                                      field.onChange(p.kode_permohonan);
                                      setOpenPermohonan(false);
                                      fetchTarifByPermohonan(p);
                                    }}
                                    className="cursor-pointer">
                                    <span className="truncate">
                                      {p.kode_permohonan} - {p.nama_perusahaan}
                                    </span>
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
                name="tanggal_pnbp"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor="tanggal_pnbp">
                      Tanggal PNBP <span className="text-red-500">*</span>
                    </FieldLabel>
                    <Input {...field} id="tanggal_pnbp" type="date" required aria-invalid={fieldState.invalid} />
                    {fieldState.error && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
                name="pegawai_id"
                control={form.control}
                render={({ field, fieldState }) => {
                  const selectedPegawai = pegawaiList.find((p) => p.id === field.value);

                  return (
                    <Field>
                      <FieldLabel>
                        Pembuat Kuitansi <span className="text-red-500">*</span>
                      </FieldLabel>

                      <Popover open={openPegawai} onOpenChange={setOpenPegawai}>
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

              {isEditMode && (
                <Controller
                  name="status"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel htmlFor="status">Status</FieldLabel>
                      <Select value={field.value} onValueChange={(value) => field.onChange(value)} required aria-invalid={fieldState.invalid}>
                        <SelectTrigger className="w-full h-11 border px-3">
                          <SelectValue placeholder="Pilih Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Sudah Dibayar">Sudah Dibayar</SelectItem>
                          <SelectItem value="Menunggu Pembayaran">Menunggu Pembayaran</SelectItem>
                          <SelectItem value="Pembayaran Dibatalkan">Pembayaran Dibatalkan</SelectItem>
                        </SelectContent>
                      </Select>
                      {fieldState.error && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
              )}

              {status === "Sudah Dibayar" && isEditMode && (
                <>
                  <Controller
                    name="no_bil"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field>
                        <FieldLabel htmlFor="no_bil">Nomor Billing</FieldLabel>
                        <Input
                          {...field}
                          id="no_bil"
                          placeholder="Masukan nomor billing pembayaran"
                          type="text"
                          required
                          aria-invalid={fieldState.invalid}
                        />
                        {fieldState.error && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />

                  <Controller
                    name="ntpn"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field>
                        <FieldLabel htmlFor="ntpn">NTPN (Nomor Transaksi Penerimaan Negara)</FieldLabel>
                        <Input
                          {...field}
                          id="ntpn"
                          placeholder="Masukan nomor transaksi penerimaan negara"
                          type="text"
                          required
                          aria-invalid={fieldState.invalid}
                        />
                        {fieldState.error && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />
                </>
              )}
            </CardContent>
          </Card>

          {/* Pilih Layanan Card */}
          {!isEditMode && (
            <Controller
              name="tarif_id"
              control={form.control}
              render={({ field }) => {
                const selectedIds: number[] = Array.isArray(field.value) ? field.value : [];

                const toggle = (id: number, checked: boolean) => {
                  let newSelectedIds: number[];
                  if (checked) {
                    newSelectedIds = [...selectedIds, id];
                    if (!quantities[id]) {
                      setQuantities({ ...quantities, [id]: 1 });
                    }
                  } else {
                    newSelectedIds = selectedIds.filter((v) => v !== id);
                    const newQuantities = { ...quantities };
                    delete newQuantities[id];
                    setQuantities(newQuantities);
                  }
                  field.onChange(newSelectedIds);
                };

                const updateQuantity = (id: number, quantity: number) => {
                  setQuantities({ ...quantities, [id]: quantity });
                  if (quantity === 0 && selectedIds.includes(id)) {
                    toggle(id, false);
                  }
                };

                return (
                  <Card className="border">
                    <CardHeader>
                      <CardTitle>Pilih Layanan</CardTitle>
                      <CardDescription>Cari layanan atau centang layanan yang digunakan.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between items-center p-4 bg-linear-to-r from-blue-50 to-blue-100 rounded-lg border-2 border-primary">
                        <span className="text-base font-semibold text-gray-700">Total Nominal:</span>
                        <span className="text-base font-bold text-primary">
                          Rp {calculateTotalNominal(selectedTarifIds)?.toLocaleString("id-ID") || "0"}{" "}
                        </span>
                      </div>
                      <Input placeholder="Cari layanan..." value={searchTarif} onChange={(e) => setSearchTarif(e.target.value)} className="mb-4" />
                      <Table className="border">
                        <TableHeader className="bg-primary">
                          <TableRow>
                            <TableHead className="text-center w-1/12 text-white">Pilih</TableHead>
                            <TableHead className="w-5/12 text-white">Nama Layanan</TableHead>
                            <TableHead className="w-2/12 text-center text-white">Tarif</TableHead>
                            <TableHead className="w-2/12 text-center text-white">Jumlah</TableHead>
                            <TableHead className="w-2/12 text-center text-white">Subtotal</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {tarifList
                            .filter((tarif) => tarif.nama_layanan.toLowerCase().includes(searchTarif.toLowerCase()))
                            .map((tarif) => {
                              const quantity = quantities[tarif.id] || 0;
                              const subtotal = tarif.tarif * quantity;
                              return (
                                <TableRow key={tarif.id}>
                                  <TableCell className="text-center">
                                    <Input
                                      type="checkbox"
                                      className="w-4 h-4"
                                      checked={selectedIds.includes(tarif.id)}
                                      onChange={(e) => toggle(tarif.id, e.target.checked)}
                                    />
                                  </TableCell>
                                  <TableCell>{tarif.nama_layanan}</TableCell>
                                  <TableCell className="text-center">Rp {tarif.tarif.toLocaleString("id-ID")}</TableCell>
                                  <TableCell className="text-center">
                                    <Input
                                      type="number"
                                      min="0"
                                      value={quantity}
                                      disabled={!selectedIds.includes(tarif.id)}
                                      onChange={(e) => {
                                        const quantityValue = parseInt(e.target.value) || 0;
                                        updateQuantity(tarif.id, quantityValue);
                                        handleQuantityChange(tarif.id, quantityValue);
                                      }}
                                      className="w-20 text-center"
                                    />
                                  </TableCell>
                                  <TableCell className="text-center">Rp {subtotal.toLocaleString("id-ID")}</TableCell>
                                </TableRow>
                              );
                            })}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                );
              }}
            />
          )}

          {/* Submit Button */}
          <div className="pt-6 space-y-2">
            <Button type="submit" className="w-full mt-2" disabled={loading}>
              {loading ? "Menyimpan..." : isEditMode ? "Simpan Perubahan" : "Submit"}
            </Button>
            <FieldDescription className="text-center text-gray-500">
              {isEditMode ? "Perbarui data sampel sesuai kebutuhan." : "Isi data sampel baru dengan benar."}
            </FieldDescription>
          </div>
        </div>
      </FieldGroup>
    </form>
  );
}
