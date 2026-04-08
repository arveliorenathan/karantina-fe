import { StyleSheet } from "@react-pdf/renderer";

export const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    padding: 20,
    fontFamily: "Helvetica",
    fontSize: 10,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
    textAlign: "center",
  },

  logoBarantin: {
    width: 60,
    height: 60,
  },

  logoKAN: {
    width: 85,
    height: 60,
  },

  headerTextContainer: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  },

  headerText: {
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
  },

  headerSubText: {
    fontSize: 8,
    textAlign: "center",
  },

  garis: {
    borderBottom: "1px solid black",
    width: "100%",
    marginVertical: 10,
  },

  judul: {
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 4,
  },

  subJudul: {
    fontSize: 10,
    fontStyle: "italic",
    textAlign: "center",
  },

  subJudulBold: {
    fontSize: 10,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 6,
  },

  titleContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },

  biodata: {
    fontSize: 10,
    width: "100%",
  },

  biodataRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginBottom: 4,
  },

  label: {
    fontSize: 10,
    width: "30%",
    marginRight: 10,
    marginBottom: 2,
    textAlign: "left",
  },

  data: {
    fontSize: 10,
    flexWrap: "wrap",
    wordBreak: "break-word",
  },

  judulContent: {
    fontWeight: "bold",
    marginVertical: 8,
  },

  keterangan: {
    flexDirection: "column",
    marginTop: 5,
    gap: 2,
  },

  table: {
    width: "100%",
  },

  td: {
    padding: 4,
    fontSize: 10,
  },

  catatanContent: {
    marginTop: 10,
    fontSize: 8,
  },

  catatanRow: {
    flexDirection: "row",
    marginBottom: 6,
  },

  catatanLabel: {
    width: 70,
  },

  catatanNomor: {
    width: 20,
    textAlign: "right",
    paddingRight: 5,
  },

  catatanIsi: {
    flex: 1,
  },

  englishText: {
    fontStyle: "italic",
    marginTop: 2,
  },

  ttdContainer: {
    marginTop: 20,
  },

  ttdPenutup: {
    textAlign: "left",
    marginBottom: 25,
    fontSize: 10,
  },

  ttdRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  ttdCol: {
    width: "45%",
    alignItems: "center",
  },

  ttdJabatan: {
    fontSize: 10,
    textAlign: "center",
    marginBottom: 10,
  },

  qrContainer: {
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
    margin: "0 auto", 
  },

  qrCode: {
    width: 60,
    height: 60,
  },

  ttdNama: {
    fontSize: 9,
    fontWeight: "bold",
    textAlign: "center",
    textDecoration: "underline",
    marginBottom: 3,
  },

  ttdNip: {
    fontSize: 8,
    textAlign: "center",
  },
});
