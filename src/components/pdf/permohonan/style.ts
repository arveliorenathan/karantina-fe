// style.js
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
    justifyContent: "center",
    marginBottom: 10,
    textAlign: "center",
  },

  logo: {
    width: 60,
    height: 60,
    marginRight: 10,
  },

  headerTextContainer: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  },

  headerText: {
    fontSize: 14,
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
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 10,
  },

  titleContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },

  biodata: {
    fontSize: 10,
    width: "100%",
  },

  biodataRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    marginBottom: 4,
  },

  label: {
    fontSize: 10,
    width: "25%",
    marginRight: 10,
    marginBottom: 5,
    fontWeight: "bold",
    textAlign: "left",
  },

  data: {
    fontSize: 10,
    flex: 1,
    flexWrap: "wrap",
  },

  checkBoxLabel: {
    fontSize: 10,
    padding: 2,
    textAlign: "left",
  },

  checkboxColumn: {
    width: "30%",
  },

  checkbox: {
    width: 10,
    height: 10,
    borderWidth: 1,
    borderColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 2,
  },

  checkboxFill: {
    width: 6,
    height: 6,
    backgroundColor: "#000",
  },

  table: {
    width: "100%",
    marginTop: 10,
  },

  td: {
    padding: 4,
    fontSize: 10,
  },

  signatureTable: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#000",
    marginTop: 20,
  },

  signatureTd: {
    padding: 10,
    fontSize: 10,
  },

  signatureTableTitle: {
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
  },

  signatureTableContent: {
    flexDirection: "column",
    width: "100%",
    gap: 15,
  },

  signatureTableDate: {
    fontSize: 10,
    marginBottom: 10,
    textAlign: "left",
  },

  signatureTableColumns: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },

  signatureTableColumn: {
    flexDirection: "column",
    alignItems: "center",
    width: "45%",
  },

  signatureTableLabel: {
    fontSize: 10,
    fontWeight: "bold",
    textAlign: "center",
  },

  signatureTableName: {
    fontSize: 10,
    textAlign: "center",
    fontWeight: "bold",
    borderTop: "1px",
  },

  keepTogether: {
    width: "100%",
  },

  pageBreakBefore: {
    pageBreakBefore: "always",
  },

  note: {
    marginTop: 5,
  },

  campaign: {
    fontSize: 12,
    justifyContent: "center",
    textAlign: "center",
    marginVertical: 20,
    fontWeight: "bold",
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
});
