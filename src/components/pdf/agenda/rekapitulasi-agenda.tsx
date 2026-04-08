"use client";
import { Page, Text, View, Document, Image as Logo } from "@react-pdf/renderer";
import { Table, TR, TH, TD } from "@ag-media/react-pdf-table";
import { Permohonan } from "@/types/permohonan";
import { styles } from "./style";

type RekapitulasiAgendaProps = {
  data: Permohonan[];
  start_date: string;
  end_date: string;
};

export const RekapitulasiAgenda = ({
  data,
  start_date,
  end_date,
}: RekapitulasiAgendaProps) => {
  let rowIndex = 1;

  const formatDate = (date: string) => {
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Document>
      <Page orientation="landscape" size="A4" style={styles.page}>
        {/* Header Section */}
        <View style={styles.header}>
          <Logo src="/images/barantin.png" style={styles.logo} />
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerText}>BADAN KARANTINA INDONESIA</Text>
            <Text style={styles.headerText}>
              BALAI BESAR KARANTINA HEWAN, IKAN DAN TUMBUHAN BALI
            </Text>
            <Text style={styles.headerSubText}>
              JALAN RAYA BENOA NO. 20/JALAN RAYA SESETAN NO. 312, PEDUNGAN,
              DENPASAR SELATAN 80223
            </Text>
            <Text style={styles.headerSubText}>
              TELEPON/FAXSIMILE (0361) 720805
            </Text>
            <Text style={styles.headerSubText}>
              Email: karantinabali@karantinabalibali.com
            </Text>
            <Text style={styles.headerSubText}>
              www.karantinanindonesia.go.id
            </Text>
          </View>
        </View>
        {/* Garis Pemisah */}
        <View style={styles.garis} />
        {/* Judul */}
        <Text style={styles.judul}>Rekap Hasil Pengujian</Text>
        <Text>
          Rekapitulasi Periode: {formatDate(start_date)} -{" "}
          {formatDate(end_date)}
        </Text>
        <Table
          style={styles.table}
          tdStyle={styles.td}
          trStyle={{ fontSize: 8 }}>
          <TH>
            <TD
              weighting={0.5}
              style={{ justifyContent: "center", alignItems: "center" }}>
              No
            </TD>
            <TD
              weighting={2}
              style={{ justifyContent: "center", alignItems: "center" }}>
              Tanggal
            </TD>
            <TD
              weighting={4}
              style={{ justifyContent: "center", alignItems: "center" }}>
              Nama Perusahaan
            </TD>
            <TD
              weighting={3}
              style={{ justifyContent: "center", alignItems: "center" }}>
              Nama Sampel
            </TD>
            <TD
              weighting={3}
              style={{ justifyContent: "center", alignItems: "center" }}>
              Jumlah
            </TD>
            <TD
              weighting={3}
              style={{ justifyContent: "center", alignItems: "center" }}>
              Tujuan Uji
            </TD>
            <TD
              weighting={3}
              style={{ justifyContent: "center", alignItems: "center" }}>
              Parameter
            </TD>
            <TD
              weighting={3}
              style={{ justifyContent: "center", alignItems: "center" }}>
              Hasil Uji
            </TD>
            <TD
              weighting={4}
              style={{ justifyContent: "center", alignItems: "center" }}>
              Nama Penguji
            </TD>
            <TD
              weighting={3}
              style={{ justifyContent: "center", alignItems: "center" }}>
              Selesai Uji
            </TD>
          </TH>

          {/* Iterate over the data */}
          {data.map((permohonan) =>
            permohonan.sampel?.map((sampel) =>
              sampel.hasil_uji?.map((hasil) => {
                return (
                  <TR key={hasil.id}>
                    <TD
                      weighting={0.5}
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                      }}>
                      {rowIndex++}
                    </TD>
                    <TD
                      weighting={2}
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                      }}>
                      {permohonan.tanggal_diterima}
                    </TD>
                    <TD
                      weighting={4}
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                      }}>
                      {permohonan.nama_perusahaan}
                    </TD>
                    <TD
                      weighting={3}
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                      }}>
                      {sampel.nama_sampel}
                    </TD>
                    <TD
                      weighting={3}
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                      }}>
                      {sampel.jumlah} {sampel.satuan}
                    </TD>
                    <TD
                      weighting={3}
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                      }}>
                      {permohonan.tujuan_pengujian}
                    </TD>
                    <TD
                      weighting={3}
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                      }}>
                      {hasil.parameter?.nama_parameter}
                    </TD>
                    <TD
                      weighting={3}
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                      }}>
                      {hasil.hasil ?? "Proses Pengujian"}
                    </TD>
                    <TD
                      weighting={4}
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                      }}>
                      {hasil.penguji?.nama_pegawai}
                    </TD>
                    <TD
                      weighting={3}
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                      }}>
                      {hasil.tanggal_selesai ?? "Belum Selesai"}
                    </TD>
                  </TR>
                );
              }),
            ),
          )}
        </Table>
      </Page>
    </Document>
  );
};
