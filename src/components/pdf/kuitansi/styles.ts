import { StyleSheet } from "@react-pdf/renderer";

export const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    padding: 20,
    fontFamily: "Helvetica",
    fontSize: 10,
    gap: 8,
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
  },

  judul: {
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
  },

  subJudul: {
    fontSize: 10,
    fontStyle: "italic",
    textAlign: "center",
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

  table: {
    width: "100%",
  },

  td: {
    padding: 4,
    fontSize: 10,
  },

  footer: {
    flexDirection: "column",
    alignItems: "flex-end",
    marginTop: 30,
    marginBottom: 10,
  },

  footerContainer: {
    flexDirection: "column",
    width: "40%",
  },

  footerText: {
    fontSize: 10,
    textAlign: "left",
  },

  qrContainer: {
    width: "100%",
    marginVertical: 8,
  },

  qrCode: {
    width: 60,
    height: 60,
  },

  footerTextRight: {
    fontSize: 10,
    textAlign: "left",
    fontWeight: "bold",
  },
});
