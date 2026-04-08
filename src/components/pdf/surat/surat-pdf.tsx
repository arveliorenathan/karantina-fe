"use client";

import { Page, Text, View, Document, Image as Logo } from "@react-pdf/renderer";
import { Surat } from "@/types/surat";
import { styles } from "./style";
import { Table, TR, TH, TD } from "@ag-media/react-pdf-table";
import qr from "qr-image";

const CheckboxItem = ({ checked = false, label = "" }) => (
  <View style={{ flexDirection: "row", alignItems: "flex-start", marginBottom: 4 }}>
    <View style={styles.checkbox}>{checked && <View style={styles.checkboxFill} />}</View>
    <Text style={styles.checkBoxLabel}>{label}</Text>
  </View>
);

const isChecked = (label: string, perihal?: string) => {
  if (!perihal) return false;
  return label.trim() === perihal.trim();
};

export const SuratPenugasan = ({ data }: { data: { surat: Surat | null } }) => {
  const url = `http://localhost:3000/pdf/kuitansi?id=${data?.surat?.id}`;

  const generateQRCode = (url: string) => {
    const qrCode = qr.imageSync(url, { type: "png" });
    return `data:image/png;base64,${qrCode.toString("base64")}`;
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Logo src="/images/barantin.png" style={styles.logo} />
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerText}>BADAN KARANTINA INDONESIA</Text>
            <Text style={styles.headerText}>BALAI BESAR KARANTINA HEWAN, IKAN DAN TUMBUHAN BALI</Text>
            <Text style={styles.headerSubText}>JALAN RAYA BENOA NO. 20/JALAN RAYA SESETAN NO. 312, PEDUNGAN, DENPASAR SELATAN 80223</Text>
            <Text style={styles.headerSubText}>TELEPON/FAXSIMILE (0361) 720805</Text>
            <Text style={styles.headerSubText}>Email: karantinabali@karantinabalibali.com</Text>
            <Text style={styles.headerSubText}>www.karantinanindonesia.go.id</Text>
          </View>
        </View>
        <View style={styles.garis} />

        {/* Judul */}
        <Text style={styles.judul}>SURAT TUGAS</Text>

        {/* Penomoran */}
        <View style={styles.penomoran}>
          <Text>Nomor: {data?.surat?.nomor_surat || "-"}</Text>
          <Text>Perihal: {data?.surat?.perihal || "-"}</Text>
        </View>

        {/* Data Petugas */}
        <View style={styles.pegawai}>
          <Text>Kepada Sdr/Sdri: </Text>

          <Table style={styles.table} tdStyle={styles.td} trStyle={{ fontSize: 10 }}>
            <TH>
              <TD weighting={1}>No</TD>
              <TD weighting={4}>Nama</TD>
              <TD weighting={3}>NIP</TD>
              <TD weighting={4}>Jabatan</TD>
            </TH>

            {data?.surat?.penerima_tugas?.map((item, index) => (
              <TR key={index}>
                <TD weighting={1}>{index + 1}</TD>
                <TD weighting={4}>{item.nama_pegawai}</TD>
                <TD weighting={3}>{item.nip}</TD>
                <TD weighting={4}>{item.jabatan}</TD>
              </TR>
            ))}
          </Table>
        </View>

        {/* Deskripsi */}
        <View>
          <Text style={styles.deskripsi}>
            Berdasarkan Laporan Permohonan Rencana Kedatangan Alat Angkut/ Pemasukan/Pengeluaran/Serah Terima/Nota Intelejen atas media pembawa ,
            Nomor {data?.surat?.nomor_surat || "-"} tanggal{" "}
            {data?.surat?.tanggal_surat
              ? new Date(data?.surat?.tanggal_surat).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })
              : "-"}{" "}
            dan hasil Analisis Laporan No…Tanggal… Ditugaskan kepada Saudara, untuk melakukan :
          </Text>
        </View>

        {/* Tabel Tugas */}
        <Table style={styles.table} tdStyle={styles.td} trStyle={{ fontSize: 10 }}>
          <TH>
            <TD style={{ justifyContent: "center", alignItems: "center" }}>A. Tindakan Karantina dan hal terkait lainnya, berupa:</TD>
          </TH>

          <TR>
            <TD weighting={1} style={{ flexDirection: "column", alignItems: "flex-start" }}>
              <CheckboxItem
                checked={isChecked("Pemerikasaan Administrasi dan Penerimaan Sampel", data?.surat?.perihal)}
                label="Pemerikasaan Administrasi dan Penerimaan Sampel"
              />
              <CheckboxItem checked={isChecked("Analisa dan Pengujian Sampel", data?.surat?.perihal)} label="Analisa dan Pengujian Sampel" />
              <CheckboxItem checked={isChecked("Laporan Hasil Uji Laboratorium", data?.surat?.perihal)} label="Laporan Hasil Uji Laboratorium" />
            </TD>
          </TR>
        </Table>

        <View>
          <Text style={styles.deskripsi}>
            Demikian agar dilaksanakan dengan penuh tanggung jawab dan melaporkan hasil pelaksanaan tugas selambatlambatnya 1 x 24 jam setelah selesai
            dilaksanakan.
          </Text>
        </View>

        <View style={styles.footer}>
          <View style={styles.footerContainer}>
            <Text style={styles.footerText}>Diterbitkan di: {data?.surat?.kota_penerbit}</Text>
            <Text style={styles.footerText}>Pada tanggal: {data?.surat?.tanggal_surat || "-"}</Text>
            <Text style={styles.footerText}>Pejabat Karantina</Text>
            <View style={styles.qrContainer}>
              <Logo src={generateQRCode(url)} style={{ width: 100, height: 100 }} />
            </View>
            <Text style={styles.footerTextRight}>{data?.surat?.pemberi_tugas?.nama_pegawai}</Text>
            <Text style={styles.footerTextRight}>NIP. {data?.surat?.pemberi_tugas?.nip}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};
