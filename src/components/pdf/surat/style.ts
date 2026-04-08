import { StyleSheet } from "@react-pdf/renderer";

export const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    padding: 30,
    fontFamily: "Helvetica",
    fontSize: 12,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
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
    borderBottom: "2px solid black",
    width: "100%",
    marginBottom: 20,
  },

  judul: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },

  penomoran: {
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "center",
    fontSize: 10,
    gap: 4,
    marginBottom: 10,
  },

  pegawai: {
    fontSize: 10,
  },

  table: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#000",
    marginVertical: 8,
  },

  td: {
    paddingVertical: 3,
    paddingHorizontal: 4,
    fontSize: 10,
    textAlign: "left",
  },

  item: {
    fontSize: 10,
  },

  checkBoxLabel: {
    fontSize: 10,
    padding: 2,
    textAlign: "left",
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

  checkboxText: {
    fontSize: 12,
  },

  checkboxFill: {
    width: 6,
    height: 6,
    backgroundColor: "#000",
  },

  deskripsi: {
    fontSize: 10,
    lineHeight: 1.5,
    textAlign: "justify",
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
