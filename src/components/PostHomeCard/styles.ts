import { StyleSheet } from "react-native";


export const styles = StyleSheet.create({
    card: {
        backgroundColor: "#fff",
        borderRadius: 12,
        overflow: "hidden",
        margin: 6,
        elevation: 2,
        width: 300
    },
    image: {
        width: "100%",
        height: 220,
    },
    overlay: {
        position: "absolute",
        left: 12,
        bottom: 70,
        flexDirection: 'row',
        alignItems: 'center',
    },
    userAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 8,
        borderWidth: 2,
        borderColor: '#fff',
    },
    userInfo: {
        justifyContent: 'center',
    },
    userName: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
        textShadowColor: "#000",
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    timeAgo: {
        color: "#fff",
        fontSize: 12,
        textShadowColor: "#000",
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    bottomRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 12,
        backgroundColor: "#fff",
    },
    locationRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    location: {
        color: "#c00",
        marginLeft: 4,
        fontSize: 16,
    },
    button: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#e3f2fd",
        borderRadius: 6,
        paddingHorizontal: 10,
        paddingVertical: 6,
    },
    buttonText: {
        color: "#1976d2",
        fontWeight: "bold",
        marginLeft: 4,
        fontSize: 16,
    },
});