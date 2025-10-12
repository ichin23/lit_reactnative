import { StyleSheet } from 'react-native'
import '../../styles/colors';
import ColorTheme from '../../styles/colors';
export const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#000',
    },
    message: {
        textAlign: 'center',
        paddingBottom: 10,
    },
    camera: {
        aspectRatio: 1,
        position: 'relative',
        borderRadius: 20,
    },
    headerCamera: {
        flex: 1,
        alignItems: 'center',
        position: 'absolute',
        top: 50,
    },
    footerCamera: {
        flexDirection: 'row',
        marginBottom: 20,
        justifyContent: 'center',
        position: 'absolute',
        bottom: 0,
        width: '100%',
    },
    ball: {
        width: 70,
        height: 70,
        backgroundColor: ColorTheme.primary,
        borderRadius: 35,
    },
    headerSave: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        position: 'absolute',
        top: 50,
    }
});