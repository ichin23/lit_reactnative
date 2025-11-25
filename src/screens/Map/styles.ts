import { StyleSheet, Dimensions } from 'react-native';
import ColorTheme from '../../styles/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ColorTheme.background,
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 10,
    borderRadius: 25,
    zIndex: 10,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  locationTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  locationAddress: {
    fontSize: 14,
    color: '#666',
  },
  routeInfoContainer: {
    alignItems: 'flex-end',
  },
  durationText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1976d2',
  },
  distanceText: {
    fontSize: 14,
    color: '#666',
  },
  openMapsButton: {
    backgroundColor: '#1976d2',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  openMapsButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
});
