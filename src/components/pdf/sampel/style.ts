import { StyleSheet } from "@react-pdf/renderer";

export const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    padding: 20,
    fontFamily: "Helvetica",
    fontSize: 10,
  },

  label: {
    flexDirection: "row",
    margin: 10,
    gap: 2,
    flexWrap: "wrap",
  },

  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 5,
    border: "1px solid #000",
    width: "30%", 
    height: 80,
  },

  qrCodeImage: {
    width: 50,
    height: 50,
    marginRight: 15,
  },

  textContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
  },

  titleText: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 5,
  },

  labelText: {
    fontSize: 10,
    marginBottom: 4,
  },
});

