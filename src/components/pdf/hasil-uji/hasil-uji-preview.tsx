  "use client";
  import { Page, Text, View, Document, Image as Logo } from "@react-pdf/renderer";
  import { styles } from "./styles";
  import { Table, TR, TH, TD } from "@ag-media/react-pdf-table";
  import { Sampel } from "@/types/sampel";
  import { Surat } from "@/types/surat";
  import { HasilUji } from "@/types/hasilUji";
  import qr from "qr-image";

  export const PreviewHasilUjiPDF = ({ data }: { data: { sampel: Sampel | null; surat: Surat[] } }) => {
    const currentDate = new Date();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
    const year = currentDate.getFullYear();
    const url = `http://localhost:3000/pdf/hasil-uji?id=${data?.sampel?.id}`;

    const formattedDate = currentDate.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

    const hasKANAccreditation = (hasil: HasilUji) => {
      return hasil?.parameter?.keterangan_parameter === "KAN";
    };

    const generateQRCode = (url: string) => {
      const qrCode = qr.imageSync(url, { type: "png" });
      return `data:image/png;base64,${qrCode.toString("base64")}`;
    };

    const kanParameters = data?.sampel?.hasil_uji?.filter((hasil) => hasKANAccreditation(hasil)) ?? [];
    const nonKanParameters = data?.sampel?.hasil_uji?.filter((hasil) => !hasKANAccreditation(hasil)) ?? [];

    return (
      <Document>
        {/* NON KAN */}
        {nonKanParameters.length > 0 && (
          <Page size="A4" style={styles.page}>
            {/* Header Section */}
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
            <Text style={styles.judul}>Preview Surat Hasil Pengujian Laboratorium</Text>
            <Text style={styles.subJudul}>Laboratory Test Result Letter</Text>
            <Text style={styles.subJudulBold}>
              Nomor/Number: {data.sampel?.kode_sampel}/I.4/LHU.130/{month}/{year}
            </Text>

            <View style={{ marginTop: 8 }}>
              <Text style={{ fontSize: 10 }}>
                Kepada YTH/<Text style={{ fontStyle: "italic" }}> To</Text>:{" "}
                <Text style={{ fontWeight: "bold" }}>{data?.sampel?.permohonan?.nama_perusahaan ?? "-"}</Text>
              </Text>
            </View>

            <View style={styles.titleContent}>
              <Text>
                Memenuhi Permohonan Pengujian Laboratorium {data?.sampel?.kode_permohonan} tanggal {data?.sampel?.permohonan?.tanggal_diterima}, bersama
                ini disampaikan hasil pengujian sampel dengan identitas sebagai berikut :
              </Text>
            </View>

            <Text style={styles.judulContent}>
              A. Keterangan Sampel (<Text style={{ fontStyle: "italic" }}>Sampel Description</Text>)
            </Text>

            <View style={styles.biodata}>
              <View style={styles.biodataRow}>
                <Text style={styles.label}>
                  Kode Sampel/<Text style={{ fontStyle: "italic" }}>Sampel Code</Text>
                </Text>
                <Text style={styles.data}>: {data?.sampel?.kode_sampel}</Text>
              </View>

              <View style={styles.biodataRow}>
                <Text style={styles.label}>
                  Nama Sampel/<Text style={{ fontStyle: "italic" }}>Sampel Name</Text>
                </Text>
                <Text style={styles.data}>: {data?.sampel?.nama_sampel}</Text>
              </View>

              <View style={styles.biodataRow}>
                <Text style={styles.label}>
                  Nama Ilmiah/<Text style={{ fontStyle: "italic" }}>Scientific Name</Text>
                </Text>
                <Text style={styles.data}>: {data?.sampel?.spesies}</Text>
              </View>

              <View style={styles.biodataRow}>
                <Text style={styles.label}>
                  Pemilik/<Text style={{ fontStyle: "italic" }}>Owner</Text>
                </Text>
                <Text style={styles.data}>: {data?.sampel?.permohonan?.nama_perusahaan}</Text>
              </View>

              <View style={styles.biodataRow}>
                <Text style={styles.label}>
                  Tanggal Penerimaan/<Text style={{ fontStyle: "italic" }}>Received Date</Text>
                </Text>
                <Text style={styles.data}>: {data?.sampel?.permohonan?.tanggal_diterima}</Text>
              </View>

              <View style={styles.biodataRow}>
                <Text style={styles.label}>
                  Tanggal Pengujian/<Text style={{ fontStyle: "italic" }}>Test Date</Text>
                </Text>
                <Text style={styles.data}>: {data?.sampel?.tanggal_pengujian}</Text>
              </View>

              <View style={styles.biodataRow}>
                <Text style={styles.label}>
                  Kategori/<Text style={{ fontStyle: "italic" }}>Category</Text>
                </Text>
                <Text style={styles.data}>: {data?.sampel?.laboratorium?.klasifikasi}</Text>
              </View>
            </View>

            <Text style={styles.judulContent}>
              B. Hasil Pengujian (<Text style={{ fontStyle: "italic" }}>Test Results</Text>)
            </Text>

            <Table style={styles.table} tdStyle={styles.td} trStyle={{ fontSize: 10 }}>
              <TH>
                <TD weighting={2} style={{ justifyContent: "flex-start", alignItems: "flex-start", flexWrap: "wrap" }}>
                  Nomor/<Text style={{ fontStyle: "italic" }}>Number</Text>
                </TD>
                <TD weighting={5} style={{ justifyContent: "flex-start", alignItems: "flex-start", flexWrap: "wrap" }}>
                  Tujuan Pengujian/<Text style={{ fontStyle: "italic" }}>Testing Objectives</Text>
                </TD>
                <TD weighting={5} style={{ justifyContent: "flex-start", alignItems: "flex-start", flexWrap: "wrap" }}>
                  Metode Pengujian/<Text style={{ fontStyle: "italic" }}>Testing Methods</Text>
                </TD>
                <TD weighting={5} style={{ justifyContent: "flex-start", alignItems: "flex-start", flexWrap: "wrap" }}>
                  Standar Pengujian/<Text style={{ fontStyle: "italic" }}>Testing Standards</Text>
                </TD>
                <TD weighting={5} style={{ justifyContent: "flex-start", alignItems: "flex-start", flexWrap: "wrap" }}>
                  Hasil Pengujian/<Text style={{ fontStyle: "italic" }}>Test Results</Text>
                </TD>
                <TD weighting={4} style={{ justifyContent: "flex-start", alignItems: "flex-start", flexWrap: "wrap" }}>
                  Keterangan/<Text style={{ fontStyle: "italic" }}>Information</Text>
                </TD>
              </TH>

              {nonKanParameters.map((hasil, index) => (
                <TR key={hasil.id}>
                  <TD weighting={2} style={{ justifyContent: "flex-start", alignItems: "flex-start", flexWrap: "wrap" }}>
                    {index + 1}
                  </TD>
                  <TD weighting={5} style={{ justifyContent: "flex-start", alignItems: "flex-start", flexWrap: "wrap" }}>
                    {hasil.parameter?.nama_parameter}
                  </TD>
                  <TD weighting={5} style={{ justifyContent: "flex-start", alignItems: "flex-start", flexWrap: "wrap" }}>
                    {hasil.parameter?.metode_pengujian}
                  </TD>
                  <TD weighting={5} style={{ justifyContent: "flex-start", alignItems: "flex-start", flexWrap: "wrap" }}>
                    {hasil.parameter?.standar_parameter}
                  </TD>
                  <TD weighting={5} style={{ justifyContent: "flex-start", alignItems: "flex-start", flexWrap: "wrap" }}>
                    {hasil.hasil ?? "Belum Selesai"}
                  </TD>
                  <TD weighting={4} style={{ justifyContent: "flex-start", alignItems: "flex-start", flexWrap: "wrap" }}>
                    {hasil.keterangan ?? "-"}
                  </TD>
                </TR>
              ))}
            </Table>

            <View style={styles.keterangan}>
              <Text>PF {data.sampel?.laboratorium?.klasifikasi} 7.8-1/BBKHIT Bali</Text>
              <Text>(*) Hanya untuk sampel yang diuji/only for tested samples</Text>
            </View>

            <Text style={styles.judulContent}>
              C. Simpulan Hasil Pengujian (<Text style={{ fontStyle: "italic" }}>Conclusion of Test Results</Text>)
            </Text>
            <Text>{data.sampel?.kesimpulan}</Text>

            <View style={styles.ttdContainer}>
              <Text style={styles.ttdPenutup}>Demikian disampaikan sebagai bahan pertimbangan lebih lanjut</Text>

              <View style={styles.ttdRow}>
                {/* KIRI */}
                <View style={styles.ttdCol}>
                  <Text style={styles.ttdJabatan}>
                    {data.surat?.[0]?.kota_penerbit}, {formattedDate}
                    {"\n"}
                    Ketua Tim Kerja / PJ. Laboratorium
                  </Text>

                  <View style={styles.qrContainer}>
                    <Logo src={generateQRCode(url)} style={{ width: 80, height: 80 }} />
                  </View>

                  <Text style={styles.ttdNama}>{data?.surat?.[0]?.pemberi_tugas?.nama_pegawai ?? "Tidak ada ketua tim"}</Text>

                  <Text style={styles.ttdNip}>NIP. {data?.surat?.[0]?.pemberi_tugas?.nip ?? "Tidak ada NIP"}</Text>
                </View>

                {/* KANAN */}
                <View style={styles.ttdCol}>
                  <Text style={styles.ttdJabatan}>{"\n"} Penyelia </Text>

                  <View style={styles.qrContainer}>
                    <Logo src={generateQRCode(url)} style={{ width: 80, height: 80 }} />
                  </View>

                  <Text style={styles.ttdNama}>{data?.surat?.[0]?.penerima_tugas?.[0]?.nama_pegawai ?? "Tidak ada penerima tugas"}</Text>

                  <Text style={styles.ttdNip}>NIP. {data?.surat?.[0]?.penerima_tugas?.[0]?.nip ?? "Tidak ada NIP"}</Text>
                </View>
              </View>
            </View>
          </Page>
        )}

        {/* KAN */}
        {kanParameters.length > 0 && (
          <Page size="A4" style={styles.page}>
            {/* Header Section */}
            <View style={styles.header}>
              <Logo src="/images/barantin.png" style={styles.logoBarantin} />

              <View style={[styles.headerTextContainer]}>
                <Text style={styles.headerText}>BADAN KARANTINA INDONESIA</Text>
                <Text style={styles.headerText}>BALAI BESAR KARANTINA HEWAN, IKAN DAN TUMBUHAN BALI</Text>
                <Text style={styles.headerSubText}>JALAN RAYA BENOA NO. 20/JALAN RAYA SESETAN NO. 312, PEDUNGAN, DENPASAR SELATAN 80223</Text>
                <Text style={styles.headerSubText}>TELEPON/FAXSIMILE (0361) 720805</Text>
                <Text style={styles.headerSubText}>Email: karantinabali@karantinabalibali.com</Text>
                <Text style={styles.headerSubText}>www.karantinanindonesia.go.id</Text>
              </View>

              <Logo src="/images/KAN.png" style={styles.logoKAN} />
            </View>

            {/* Garis Pemisah */}
            <View style={styles.garis} />

            {/* Judul */}
            <Text style={styles.judul}>Surat Hasil Pengujian Laboratorium</Text>
            <Text style={styles.subJudul}>Laboratory Test Result Letter</Text>
            <Text style={styles.subJudulBold}>
              Nomor/Number: {data.sampel?.kode_sampel}/I.4/LHU.130/{month}/{year}
            </Text>

            <View style={{ marginTop: 8 }}>
              <Text style={{ fontSize: 10 }}>
                Kepada YTH/<Text style={{ fontStyle: "italic" }}> To</Text>:{" "}
                <Text style={{ fontWeight: "bold" }}>{data?.sampel?.permohonan?.nama_perusahaan ?? "-"}</Text>
              </Text>
            </View>

            <View style={styles.titleContent}>
              <Text>
                Memenuhi Permohonan Pengujian Laboratorium {data?.sampel?.kode_permohonan} tanggal {data?.sampel?.permohonan?.tanggal_diterima}, bersama
                ini disampaikan hasil pengujian sampel dengan identitas sebagai berikut :
              </Text>
            </View>

            <Text style={styles.judulContent}>
              A. Keterangan Sampel (<Text style={{ fontStyle: "italic" }}>Sampel Description</Text>)
            </Text>

            <View style={styles.biodata}>
              <View style={styles.biodataRow}>
                <Text style={styles.label}>
                  Kode Sampel/<Text style={{ fontStyle: "italic" }}>Sampel Code</Text>
                </Text>
                <Text style={styles.data}>: {data?.sampel?.kode_sampel}</Text>
              </View>

              <View style={styles.biodataRow}>
                <Text style={styles.label}>
                  Nama Sampel/<Text style={{ fontStyle: "italic" }}>Sampel Name</Text>
                </Text>
                <Text style={styles.data}>: {data?.sampel?.nama_sampel}</Text>
              </View>

              <View style={styles.biodataRow}>
                <Text style={styles.label}>
                  Nama Ilmiah/<Text style={{ fontStyle: "italic" }}>Scientific Name</Text>
                </Text>
                <Text style={styles.data}>: {data?.sampel?.spesies}</Text>
              </View>

              <View style={styles.biodataRow}>
                <Text style={styles.label}>
                  Pemilik/<Text style={{ fontStyle: "italic" }}>Owner</Text>
                </Text>
                <Text style={styles.data}>: {data?.sampel?.permohonan?.nama_perusahaan}</Text>
              </View>

              <View style={styles.biodataRow}>
                <Text style={styles.label}>
                  Tanggal Penerimaan/<Text style={{ fontStyle: "italic" }}>Received Date</Text>
                </Text>
                <Text style={styles.data}>: {data?.sampel?.permohonan?.tanggal_diterima}</Text>
              </View>

              <View style={styles.biodataRow}>
                <Text style={styles.label}>
                  Tanggal Pengujian/<Text style={{ fontStyle: "italic" }}>Test Date</Text>
                </Text>
                <Text style={styles.data}>: {data?.sampel?.tanggal_pengujian}</Text>
              </View>

              <View style={styles.biodataRow}>
                <Text style={styles.label}>
                  Kategori/<Text style={{ fontStyle: "italic" }}>Category</Text>
                </Text>
                <Text style={styles.data}>: {data?.sampel?.laboratorium?.klasifikasi}</Text>
              </View>
            </View>

            <Text style={styles.judulContent}>
              B. Hasil Pengujian (<Text style={{ fontStyle: "italic" }}>Test Results</Text>)
            </Text>

            <Table style={styles.table} tdStyle={styles.td} trStyle={{ fontSize: 10 }}>
              <TH>
                <TD weighting={2} style={{ justifyContent: "flex-start", alignItems: "flex-start", flexWrap: "wrap" }}>
                  Nomor/<Text style={{ fontStyle: "italic" }}>Number</Text>
                </TD>
                <TD weighting={5} style={{ justifyContent: "flex-start", alignItems: "flex-start", flexWrap: "wrap" }}>
                  Tujuan Pengujian/<Text style={{ fontStyle: "italic" }}>Testing Objectives</Text>
                </TD>
                <TD weighting={5} style={{ justifyContent: "flex-start", alignItems: "flex-start", flexWrap: "wrap" }}>
                  Metode Pengujian/<Text style={{ fontStyle: "italic" }}>Testing Methods</Text>
                </TD>
                <TD weighting={5} style={{ justifyContent: "flex-start", alignItems: "flex-start", flexWrap: "wrap" }}>
                  Standar Pengujian/<Text style={{ fontStyle: "italic" }}>Testing Standards</Text>
                </TD>
                <TD weighting={5} style={{ justifyContent: "flex-start", alignItems: "flex-start", flexWrap: "wrap" }}>
                  Hasil Pengujian/<Text style={{ fontStyle: "italic" }}>Test Results</Text>
                </TD>
                <TD weighting={4} style={{ justifyContent: "flex-start", alignItems: "flex-start", flexWrap: "wrap" }}>
                  Keterangan/<Text style={{ fontStyle: "italic" }}>Information</Text>
                </TD>
              </TH>

              {kanParameters.map((hasil, index) => (
                <TR key={hasil.id}>
                  <TD weighting={2} style={{ justifyContent: "flex-start", alignItems: "flex-start", flexWrap: "wrap" }}>
                    {index + 1}
                  </TD>
                  <TD weighting={5} style={{ justifyContent: "flex-start", alignItems: "flex-start", flexWrap: "wrap" }}>
                    {hasil.parameter?.nama_parameter}
                  </TD>
                  <TD weighting={5} style={{ justifyContent: "flex-start", alignItems: "flex-start", flexWrap: "wrap" }}>
                    {hasil.parameter?.metode_pengujian}
                  </TD>
                  <TD weighting={5} style={{ justifyContent: "flex-start", alignItems: "flex-start", flexWrap: "wrap" }}>
                    {hasil.parameter?.standar_parameter}
                  </TD>
                  <TD weighting={5} style={{ justifyContent: "flex-start", alignItems: "flex-start", flexWrap: "wrap" }}>
                    {hasil.hasil ?? "Belum Selesai"}
                  </TD>
                  <TD weighting={4} style={{ justifyContent: "flex-start", alignItems: "flex-start", flexWrap: "wrap" }}>
                    {hasil.keterangan ?? "-"}
                  </TD>
                </TR>
              ))}
            </Table>

            <View style={styles.keterangan}>
              <Text>PF {data.sampel?.laboratorium?.klasifikasi} 7.8-1/BBKHIT Bali</Text>

              <Text>(*) Hanya untuk sampel yang diuji/only for tested samples</Text>
            </View>

            <Text style={styles.judulContent}>
              C. Simpulan Hasil Pengujian (<Text style={{ fontStyle: "italic" }}>Conclusion of Test Results</Text>)
            </Text>
            <Text>{data.sampel?.kesimpulan}</Text>

            <View style={styles.ttdContainer}>
              <Text style={styles.ttdPenutup}>Demikian disampaikan sebagai bahan pertimbangan lebih lanjut</Text>

              <View style={styles.ttdRow}>
                {/* KIRI */}
                <View style={styles.ttdCol}>
                  <Text style={styles.ttdJabatan}>
                    {data.surat?.[0]?.kota_penerbit}, {formattedDate}
                    {"\n"}
                    Ketua Tim Kerja / PJ. Laboratorium
                  </Text>

                  <View style={styles.qrContainer}>
                    <Logo src={generateQRCode(url)} style={{ width: 80, height: 80 }} />
                  </View>

                  <Text style={styles.ttdNama}>{data?.surat?.[0]?.pemberi_tugas?.nama_pegawai ?? "Tidak ada ketua tim"}</Text>

                  <Text style={styles.ttdNip}>NIP. {data?.surat?.[0]?.pemberi_tugas?.nip ?? "Tidak ada NIP"}</Text>
                </View>

                {/* KANAN */}
                <View style={styles.ttdCol}>
                  <Text style={styles.ttdJabatan}>{"\n"} Penyelia </Text>

                  <View style={styles.qrContainer}>
                    <Logo src={generateQRCode(url)} style={{ width: 80, height: 80 }} />
                  </View>

                  <Text style={styles.ttdNama}>{data?.surat?.[0]?.penerima_tugas?.[0]?.nama_pegawai ?? "Tidak ada penerima tugas"}</Text>

                  <Text style={styles.ttdNip}>NIP. {data?.surat?.[0]?.penerima_tugas?.[0]?.nip ?? "Tidak ada NIP"}</Text>
                </View>
              </View>
            </View>
          </Page>
        )}
      </Document>
    );
  };
