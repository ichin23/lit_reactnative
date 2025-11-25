import { StyleSheet } from "react-native";
import ColorTheme from "../../styles/colors";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingHorizontal: 5,
        paddingTop: 0,
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
    usernameOverlay: {
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    usernameText: {
        color: "#fff",
        fontSize: 12,
        fontWeight: "bold",
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
    gridItem: {
        flex: 1,
        margin: 1,
        aspectRatio: 1,
        maxWidth: '33.33%',
    },
    gridImage: {
        width: '100%',
        height: '100%',
    },
    modalHeaderContainer: {
        marginBottom: 20,
        alignItems: 'center',
    },
    modalHeaderImage: {
        width: '100%',
        height: 250,
        borderRadius: 12,
        marginBottom: 12,
    },
    modalHeaderTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        marginBottom: 4,
    },
    modalHeaderDate: {
        fontSize: 14,
        color: '#666',
        marginTop: 5,
    },
    followButton: {
        marginTop: 15,
        backgroundColor: '#c00',
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 20,
    },
    followingButton: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#c00',
    },
    followButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    },
    followingButtonText: {
        color: '#c00',
    },
    requestSentButton: {
        backgroundColor: '#999',
        borderWidth: 0,
    },
    requestSentButtonText: {
        color: '#fff',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
    },
    modalOption: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    modalOptionText: {
        fontSize: 18,
        marginLeft: 15,
        color: '#333',
    },
})
