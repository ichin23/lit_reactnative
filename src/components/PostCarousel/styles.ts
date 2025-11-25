import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        marginBottom: 24,
        backgroundColor: '#fff',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginBottom: 12,
    },
    carouselTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1a1a1a',
    },
    postCount: {
        fontSize: 14,
        color: '#666',
        fontWeight: 'normal',
    },
    routeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f0f7ff',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    routeButtonText: {
        color: '#1976d2',
        fontWeight: '600',
        fontSize: 14,
        marginLeft: 4,
    },
});