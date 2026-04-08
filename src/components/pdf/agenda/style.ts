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
    marginVertical: 8,
  },

  table: {
    width: "100%",
    marginTop: 10,
  },

  td: {
    padding: 4,
  },
});
