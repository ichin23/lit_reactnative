import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const modalWidth = width * 0.8;

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    refreshButton: {
        position: 'absolute',
        top: 20,
        right: 20,
        backgroundColor: 'white',
        borderRadius: 30,
        padding: 10,
        elevation: 5,
    },
    clusterMarker: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: 'blue',
        justifyContent: 'center',
        alignItems: 'center',
    },
    clusterText: {
        color: 'white',
        fontWeight: 'bold',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 10,
        width: modalWidth,
        maxHeight: '80%',
        alignItems: 'center',
    },
    postItem: {
        width: modalWidth - 20, // modal padding
        alignItems: 'center',
        justifyContent: 'center',
    },
    postImage: {
        width: modalWidth * 0.7,
        height: modalWidth * 0.7,
        borderRadius: 10,
        marginBottom: 10,
    },
    postTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    indicatorContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 10,
    },
    indicator: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#ccc',
        marginHorizontal: 5,
    },
    activeIndicator: {
        backgroundColor: '#2196F3',
    },
    nextButton: {
        backgroundColor: '#2196F3',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
        width: '100%',
    },
    closeButton: {
        backgroundColor: '#f44336',
        borderRadius: 5,
        padding: 10,
        width: '100%',
    },
    closeButtonText: {
        color: 'white',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    searchContainer: {
        position: 'absolute',
        top: 50,
        left: 20,
        right: 20,
        backgroundColor: 'white',
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        height: 50,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        zIndex: 10,
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        height: '100%',
    },
    searchResults: {
        position: 'absolute',
        top: 110,
        left: 20,
        right: 20,
        backgroundColor: 'white',
        borderRadius: 8,
        maxHeight: 300,
        elevation: 5,
        zIndex: 10,
    },
    userItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    userImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    userName: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    userUsername: {
        color: '#666',
        fontSize: 14,
    },
    emptyText: {
        padding: 20,
        textAlign: 'center',
        color: '#666',
    },
});
