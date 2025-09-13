import { StyleSheet } from "react-native";
import ColorTheme from "../../styles/colors";

export const styles = StyleSheet.create({
  container: {
        flex: 1,
        backgroundColor: ColorTheme.background,
        paddingHorizontal: 20,
        paddingTop: 32,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 12,
    },
    litText: {
        color: "#c00",
        fontWeight: "bold",
        fontSize: 24,
        marginLeft: 6,
    },
    avatarContainer: {
        alignItems: "center",
        marginBottom: 16,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: "#e0e0e0",
        marginBottom: 8,
    },
    name: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#222",
    },
    places: {
        color: "#1976d2",
        fontSize: 16,
        marginBottom: 8,
        textDecorationLine: "underline",
    },
    historyTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#c00",
        borderBottomWidth: 3,
        borderBottomColor: "#c00",
        alignSelf: "flex-start",
        marginBottom: 8,
    },
    historyItem: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 18,
    },
    historyName: {
        fontWeight: "bold",
        color: "#222",
        fontSize: 14,
    },
    historyPlace: {
        color: "#222",
        fontSize: 14,
    },
    historyDate: {
        color: "#888",
        fontSize: 13,
    },
    historyImage: {
        width: 70,
        height: 70,
        borderRadius: 8,
        marginLeft: 12,
        backgroundColor: "#eee",
    },
    fab: {
        position: "absolute",
        right: 24,
        bottom: 32,
        backgroundColor: "#c00",
        width: 56,
        height: 56,
        borderRadius: 28,
        alignItems: "center",
        justifyContent: "center",
        elevation: 4,
    },
})