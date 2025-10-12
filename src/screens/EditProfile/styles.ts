import { StyleSheet } from "react-native";
import ColorTheme from "../../styles/colors";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: ColorTheme.primary,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#fff",
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        color: "#fff",
        marginBottom: 5,
    },
    input: {
        backgroundColor: "#fff",
        borderRadius: 5,
        padding: 10,
        marginBottom: 15,
        color: ColorTheme.primary,
    },
    saveButton: {
        backgroundColor: ColorTheme.secondary,
        borderRadius: 5,
        padding: 15,
        alignItems: "center",
        marginBottom: 10,
    },
    saveButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    deleteButton: {
        backgroundColor: "red",
        borderRadius: 5,
        padding: 15,
        alignItems: "center",
    },
    deleteButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
});
