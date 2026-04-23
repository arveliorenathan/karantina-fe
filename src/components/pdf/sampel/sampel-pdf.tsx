import { Permohonan } from "@/types/permohonan";
import { Page, Text, View, Document, Image as Logo } from "@react-pdf/renderer";
import { styles } from "./style";

export const Label = ({ data }: { data: Permohonan | null }) => (
  <Document>
    <Page size="A4">
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 4 }}>
        {data?.sampel?.map((sampel) => {
          const hasilUji = sampel?.hasil_uji ?? [];

          return hasilUji.length > 1 ? (
            hasilUji.map((hasil) => (
              <View key={hasil.id} style={{ ...styles.content, flex: "0 1 48%" }}>
                <Logo src="/images/barantin.png" style={styles.qrCodeImage} />
                <View style={styles.textContainer}>
                  <Text style={styles.titleText}>{sampel.kode_sampel}</Text>
                  <Text style={styles.labelText}>{sampel.nama_sampel}</Text>
                  <Text style={styles.labelText}>Spesies: {sampel.spesies}</Text>
                  <Text style={styles.labelText}>Parameter: {hasil.parameter?.nama_parameter ?? "Tidak Diketahui"}</Text>
                </View>
              </View>
            ))
          ) : (
            <View key={sampel.id} style={{ ...styles.content, flex: "0 1 48%" }}>
              <Logo src="/images/barantin.png" style={styles.qrCodeImage} />
              <View style={styles.textContainer}>
                <Text style={styles.titleText}>{sampel.kode_sampel}</Text>
                <Text style={styles.labelText}>{sampel.nama_sampel}</Text>
                <Text style={styles.labelText}>Spesies: {sampel.spesies}</Text>
                <Text style={styles.labelText}>Hasil Uji: {hasilUji[0]?.parameter?.nama_parameter ?? "Tidak Diketahui"}</Text>
              </View>
            </View>
          );
        })}
      </View>
    </Page>
  </Document>
);
