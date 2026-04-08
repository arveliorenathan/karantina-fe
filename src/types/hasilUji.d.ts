import { Parameter } from "./parameter";
import { Pegawai } from "./pegawai";
import { Sampel } from "./sampel";

export type HasilUji = {
  id: number;
  sampel_id: number;
  parameter_id: number;
  penguji_id: number;
  hasil?: string | null;
  keterangan?: string | null;
  status: string;
  status_penerimaan?: "Terima" | "Tolak" | null;
  tanggal_pengujian?: string | null;
  tanggal_selesai?: string | null;
  created_at: string;
  updated_at: string;

  sampel?: Sampel;
  parameter?: Parameter;
  penguji?: Pegawai;
};
