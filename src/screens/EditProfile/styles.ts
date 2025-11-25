import { StyleSheet } from "react-native";
import ColorTheme from "../../styles/colors";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#fff",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#000",
        marginBottom: 20,
        textAlign: "center",
    },
    profileImageContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginBottom: 10,
    },
    changePhotoButton: {
        backgroundColor: '#e0e0e0',
        padding: 8,
        borderRadius: 5,
    },
    changePhotoButtonText: {
        fontSize: 14,
        color: '#333',
    },
    label: {
        fontSize: 16,
        color: "#000",
        marginBottom: 5,
    },
    input: {
        backgroundColor: "#f5f5f5",
        borderRadius: 5,
        padding: 10,
        marginBottom: 15,
        color: "#000",
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
});
