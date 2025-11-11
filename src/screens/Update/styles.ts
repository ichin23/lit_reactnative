import { StyleSheet } from "react-native";
import ColorTheme from "../../styles/colors";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: ColorTheme.background,
        paddingHorizontal: 20,
        paddingTop: 32,
    },
    label: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 8,
    },
    input: {
        backgroundColor: "#fff",
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#ccc'
    },
    button: {
        backgroundColor: ColorTheme.primary,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
});
