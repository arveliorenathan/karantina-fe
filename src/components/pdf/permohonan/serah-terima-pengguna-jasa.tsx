"use client";
import { Page, Text, View, Document, Image as Logo } from "@react-pdf/renderer";
import { styles } from "./style";
import { Table, TR, TH, TD } from "@ag-media/react-pdf-table";
import { Permohonan } from "@/types/permohonan";
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

const getCurrentDateAndDay = () => {
  const now = new Date();

  const date = now.toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const day = now.toLocaleString("id-ID", { weekday: "long" });
  const time = now.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return { day, date, time };
};

const { day, date, time } = getCurrentDateAndDay();

const generateQRCode = (url: string) => {
  const qrCode = qr.imageSync(url, { type: "png" });
  return `data:image/png;base64,${qrCode.toString("base64")}`;
};

const SignatureSection = ({ data }: { data: Permohonan | null }) => (
  <View wrap={false} style={{ width: "100%" }}>
    <Table style={styles.signatureTable} tdStyle={styles.signatureTd} trStyle={{ fontSize: 10 }}>
      <TH>
        <TD style={{ justifyContent: "center", alignItems: "center" }}>Berita Acara Serah Terima Sampel Uji</TD>
      </TH>
      <TR>
        <TD>
          <View style={styles.signatureTableContent}>
            <Text style={styles.signatureTableDate}>
              Telah diserahkan sampel uji tersebut pada hari: {time}, {day} {date}
            </Text>

            <View style={styles.signatureTableColumns}>
              <View style={styles.signatureTableColumn}>
                <Text style={styles.signatureTableLabel}>Yang Menyerahkan Sampel Uji</Text>
                <View style={(styles.qrContainer, { marginVertical: 33 })}></View>
                <Text style={styles.signatureTableName}>{data?.nama_pembawa || "___________________"}</Text>
              </View>

              <View style={styles.signatureTableColumn}>
                <Text style={styles.signatureTableLabel}>Yang Menerima Sampel Uji</Text>
                <View style={styles.qrContainer}>
                  <Logo
                    src={generateQRCode(`http://localhost:3000/pdf/serah-terima/pengguna-jasa?id=${data?.id}`)}
                    style={{ width: 70, height: 70 }}
                  />
                </View>
                <Text style={styles.signatureTableName}>{data?.pegawai?.nama_pegawai || "___________________"}</Text>
              </View>
            </View>
          </View>
        </TD>
      </TR>
    </Table>
    {/* <Text style={styles.note}>*Catatan: Web yang diakses</Text> */}
    <Text style={styles.campaign}>“Anda Memasuki Zona Integritas Wilayah Bebas dari Korupsi (WBK)”</Text>
  </View>
);

export const SerahTerimaPenggunaJasa = ({ data }: { data: Permohonan | null }) => {
  const totalRows = data?.sampel?.reduce((acc, sampel) => acc + (sampel.hasil_uji?.length || 0), 0) || 0;

  const NEEDS_PAGE_BREAK = totalRows > 18;

  let counter = 1;

  return (
    <Document>
      {/* Halaman Pertama */}
      <Page size="A4" style={styles.page}>
        {/* Header Section */}
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

        {/* Garis Pemisah */}
        <View style={styles.garis} />

        {/* Judul */}
        <Text style={styles.judul}>Berita Acara Tanda Terima Sampel</Text>

        <View style={styles.titleContent}>
          <Text>Telah diterima sampel dari: </Text>
          <View>
            <Text>Kode Tracking Permohonan: {data?.kode_permohonan}</Text>
            <Text>PIN : {data?.pin}</Text>
          </View>
        </View>

        {/* Biodata */}
        <View style={styles.biodata}>
          <View style={styles.biodataRow}>
            <Text style={styles.label}>Nama Perusahaan</Text>
            <Text style={styles.data}>: {data?.nama_perusahaan}</Text>
          </View>
          <View style={styles.biodataRow}>
            <Text style={styles.label}>Nama Pembawa</Text>
            <Text style={styles.data}>: {data?.nama_pembawa}</Text>
          </View>
          <View style={styles.biodataRow}>
            <Text style={styles.label}>Alamat</Text>
            <Text style={styles.data}>: {data?.alamat}</Text>
          </View>
          <View style={styles.biodataRow}>
            <Text style={styles.label}>Kontak</Text>
            <Text style={styles.data}>: {data?.kontak}</Text>
          </View>
          <View style={styles.biodataRow}>
            <Text style={styles.label}>Laboratorium</Text>
            <Text style={styles.data}>: {data?.laboratorium?.nama_laboratorium}</Text>
          </View>
          <View style={styles.biodataRow}>
            <Text style={styles.label}>Jumlah Sampel</Text>
            <Text style={styles.data}>: {data?.sampel?.length}</Text>
          </View>

          <Text style={styles.label}>Tujuan Pengujian:</Text>

          {/* Checkbox Group */}
          <View style={styles.titleContent}>
            <View style={styles.checkboxColumn}>
              <CheckboxItem checked={isChecked("Monitoring Mandiri", data?.tujuan_pengujian)} label="Monitoring mandiri (Own Check)" />
              <CheckboxItem checked={isChecked("Wabah Penyakit", data?.tujuan_pengujian)} label="Wabah penyakit" />
              <CheckboxItem checked={isChecked("Penelitian", data?.tujuan_pengujian)} label="Penelitian" />
            </View>

            <View style={styles.checkboxColumn}>
              <CheckboxItem checked={isChecked("Uji Banding", data?.tujuan_pengujian)} label="Uji Banding" />
              <CheckboxItem checked={isChecked("Uji Profisiensi", data?.tujuan_pengujian)} label="Uji Profisiensi" />
              <CheckboxItem checked={isChecked("Lainnya", data?.tujuan_pengujian)} label="Lainnya" />
            </View>

            <View style={styles.checkboxColumn}></View>
          </View>
        </View>

        {/* Tabel Sampel */}
        <Table style={styles.table} tdStyle={styles.td} trStyle={{ fontSize: 10 }}>
          <TH>
            <TD weighting={1} style={{ justifyContent: "center", alignItems: "center" }}>
              Nomor
            </TD>
            <TD weighting={3} style={{ justifyContent: "center", alignItems: "center" }}>
              Nama Sampel
            </TD>
            <TD weighting={3} style={{ justifyContent: "center", alignItems: "center" }}>
              Tujuan Pengujian
            </TD>
            <TD weighting={3} style={{ justifyContent: "center", alignItems: "center" }}>
              Metode Pengujian
            </TD>
            <TD weighting={4} style={{ justifyContent: "center", alignItems: "center" }}>
              Estimasi Pengujian
            </TD>
          </TH>

          {data?.sampel?.map((sampel) =>
            sampel.hasil_uji?.map((hasil) => (
              <TR key={hasil.id}>
                <TD weighting={1} style={{ justifyContent: "center", alignItems: "center" }}>
                  <Text>{counter++}</Text>
                </TD>
                <TD weighting={3} style={{ justifyContent: "center", alignItems: "center" }}>
                  <Text>{sampel.nama_sampel}</Text>
                </TD>
                <TD weighting={3} style={{ justifyContent: "center", alignItems: "center" }}>
                  <Text>{hasil.parameter?.nama_parameter}</Text>
                </TD>
                <TD weighting={3} style={{ justifyContent: "center", alignItems: "center" }}>
                  <Text>{hasil.parameter?.metode_pengujian}</Text>
                </TD>
                <TD weighting={4} style={{ justifyContent: "center", alignItems: "center" }}>
                  <Text>{hasil.parameter?.estimasi_pengujian}</Text>
                </TD>
              </TR>
            )),
          )}
        </Table>
        {!NEEDS_PAGE_BREAK && <SignatureSection data={data} />}
      </Page>

      {NEEDS_PAGE_BREAK && (
        <Page size="A4" style={styles.page}>
          <SignatureSection data={data} />
        </Page>
      )}
    </Document>
  );
};
