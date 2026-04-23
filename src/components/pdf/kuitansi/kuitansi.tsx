"use client";
import { Page, Document, View, Text, Image as Logo } from "@react-pdf/renderer";
import { Pnbp } from "@/types/pnbp";
import { styles } from "./styles";
import { Table, TD, TH, TR } from "@ag-media/react-pdf-table";
import { format } from "date-fns";
import qr from "qr-image";

export const Kuitansi = ({ data }: { data: { pnbp: Pnbp | null } }) => {
  const getCurrentDate = () => {
    return format(new Date(), "dd MMMM yyyy");
  };

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const url = `http://localhost:3000/pdf/kuitansi?id=${data?.pnbp?.id}`;
  const generateQRCode = (url: string) => {
    const qrCode = qr.imageSync(url, { type: "png" });
    return `data:image/png;base64,${qrCode.toString("base64")}`;
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Logo src="/images/barantin.png" style={styles.logoBarantin} />

          <View style={[styles.headerTextContainer, { flex: 1, justifyContent: "center", alignItems: "center" }]}>
            <Text style={styles.headerText}>BADAN KARANTINA INDONESIA</Text>
            <Text style={styles.headerText}>BALAI BESAR KARANTINA HEWAN, IKAN DAN TUMBUHAN BALI</Text>
            <Text style={styles.headerSubText}>JALAN RAYA BENOA NO. 20/JALAN RAYA SESETAN NO. 312, PEDUNGAN, DENPASAR SELATAN 80223</Text>
            <Text style={styles.headerSubText}>TELEPON/FAXSIMILE (0361) 720805</Text>
            <Text style={styles.headerSubText}>Email: karantinabali@karantinabalibali.com</Text>
            <Text style={styles.headerSubText}>www.karantinanindonesia.go.id</Text>
          </View>

          <Logo src="/" style={styles.logoBarantin} />
        </View>

        {/* Garis Pemisah */}
        <View style={styles.garis} />

        {/* Judul */}
        <Text style={styles.judul}>Kuitansi</Text>
        <Text style={styles.subJudul}>Recipt</Text>

        <View style={styles.biodata}>
          <View style={styles.biodataRow}>
            <Text style={styles.label}>
              Pengguna Jasa/<Text style={{ fontStyle: "italic" }}>Service Users</Text>
            </Text>
            <Text style={styles.data}>: {data?.pnbp?.permohonan?.nama_perusahaan}</Text>
          </View>

          <View style={styles.biodataRow}>
            <Text style={styles.label}>
              Alamat/<Text style={{ fontStyle: "italic" }}>Address</Text>
            </Text>
            <Text style={styles.data}>: {data?.pnbp?.permohonan?.alamat}</Text>
          </View>

          <View style={styles.biodataRow}>
            <Text style={styles.label}>
              No Kuitansi/<Text style={{ fontStyle: "italic" }}>Recipt Number</Text>
            </Text>
            <Text style={styles.data}>: {data?.pnbp?.no_pnbp}</Text>
          </View>

          <View style={styles.biodataRow}>
            <Text style={styles.label}>
              Kode Tracking/<Text style={{ fontStyle: "italic" }}>Tracking Kode</Text>
            </Text>
            <Text style={styles.data}>: {data?.pnbp?.permohonan?.kode_permohonan}</Text>
          </View>

          <View style={styles.biodataRow}>
            <Text style={styles.label}>
              PIN/<Text style={{ fontStyle: "italic" }}>PIN</Text>
            </Text>
            <Text style={styles.data}>: {data?.pnbp?.permohonan?.pin}</Text>
          </View>
        </View>

        <Table style={styles.table} tdStyle={styles.td} trStyle={{ fontSize: 10 }}>
          <TH>
            <TD weighting={2} style={{ justifyContent: "flex-start", alignItems: "flex-start", flexWrap: "wrap" }}>
              Nomor/<Text style={{ fontStyle: "italic" }}>Number</Text>
            </TD>
            <TD weighting={5} style={{ justifyContent: "flex-start", alignItems: "flex-start", flexWrap: "wrap" }}>
              Jenis Pemeriksaan/<Text style={{ fontStyle: "italic" }}>Type of Inspection</Text>
            </TD>
            <TD weighting={4} style={{ justifyContent: "flex-start", alignItems: "flex-start", flexWrap: "wrap" }}>
              Jumlah/<Text style={{ fontStyle: "italic" }}>Amount</Text>
            </TD>
            <TD weighting={4} style={{ justifyContent: "flex-start", alignItems: "flex-start", flexWrap: "wrap" }}>
              Tarif per Periksa/<Text style={{ fontStyle: "italic" }}>Rate Check</Text>
            </TD>
            <TD weighting={4} style={{ justifyContent: "flex-start", alignItems: "flex-start", flexWrap: "wrap" }}>
              Total Tarif/<Text style={{ fontStyle: "italic" }}>Total Rate</Text>
            </TD>
          </TH>

          {data?.pnbp?.tarif_layanan?.map((data, index) => (
            <TR key={data.id}>
              <TD weighting={2} style={{ justifyContent: "flex-start", alignItems: "flex-start", flexWrap: "wrap" }}>
                {index + 1}
              </TD>
              <TD weighting={5} style={{ justifyContent: "flex-start", alignItems: "flex-start", flexWrap: "wrap" }}>
                {data.nama_layanan}
              </TD>
              <TD weighting={4} style={{ justifyContent: "flex-start", alignItems: "flex-start", flexWrap: "wrap" }}>
                {data.pivot.jumlah}
              </TD>
              <TD weighting={4} style={{ justifyContent: "flex-end", alignItems: "flex-end", flexWrap: "wrap" }}>
                {formatRupiah(data.tarif)}
              </TD>
              <TD weighting={4} style={{ justifyContent: "flex-end", alignItems: "flex-end", flexWrap: "wrap" }}>
                {formatRupiah(data.pivot.total || 0)}
              </TD>
            </TR>
          ))}

          <TR>
            <TD weighting={4}>Total PNBP </TD>
            <TD weighting={1} style={{ justifyContent: "flex-end", alignItems: "flex-end", flexWrap: "wrap" }}>
              {formatRupiah(Number(data.pnbp?.total_nominal))}
            </TD>
          </TR>
        </Table>

        <Text>Catatan: Mohon dicek terlebih dahulu, apabila sudah sesuai silakan dilanjutkan untuk pembuatan billing dan pelunasan tagihan</Text>

        <View style={styles.footer}>
          <View style={styles.footerContainer}>
            <Text style={styles.footerText}>Diterbitkan di Bali</Text>
            <Text style={styles.footerText}>Pada tanggal: {getCurrentDate()}</Text>
            <Text style={styles.footerText}>Petugas Karantina</Text>
            <View style={styles.qrContainer}>
              <Logo src={generateQRCode(url)} style={{ width: 100, height: 100 }} />
            </View>
            <Text style={styles.footerTextRight}>{data?.pnbp?.pegawai?.nama_pegawai}</Text>
            <Text style={styles.footerTextRight}>NIP. {data?.pnbp?.pegawai?.nip}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};
