import { StyleSheet } from "react-native";
import ColorTheme from "../../styles/colors";


export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ColorTheme.background,
    padding: 20,
    paddingTop: 60,
  },
  backButton: {
    marginBottom: 8,
    alignSelf: "flex-start",
  },
  label: {
    fontWeight: "bold",
    fontSize: 16,
    color: ColorTheme.text,
    marginBottom: 4,
  },
  map: {
    width: "100%",
    height: 110,
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: "#eee",
  },
  inputLabel: {
    color: ColorTheme.primary,
    fontWeight: "bold",
    marginBottom: 2,
    marginLeft: 2,
  },
  input: {
    borderWidth: 2,
    borderColor: ColorTheme.primary,
    borderRadius: 8,
    padding: 10,
    marginBottom: 18,
    fontSize: 16,
    color: ColorTheme.text,
    backgroundColor: "#fff",
  },
  photoBox: {
    borderWidth: 2,
    borderColor: ColorTheme.primary,
    borderRadius: 12,
    height: 150,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 28,
    backgroundColor: "#fff",
  },
  photoPlaceholder: {
    alignItems: "center",
  },
  photoText: {
    color: ColorTheme.primary,
    fontWeight: "bold",
    marginTop: 8,
    fontSize: 16,
  },
  photo: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
    resizeMode: "cover",
  },
  addButton: {
    backgroundColor: ColorTheme.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 10,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
});