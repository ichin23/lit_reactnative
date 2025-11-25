import { StyleSheet } from 'react-native';
import ColorTheme from '../../styles/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: ColorTheme.background,
    width: '100%',
    margin: 0,
    padding: 0,

  },
  feedToggle: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 4,
    margin: 10,
    alignSelf: 'center',
  },
  feedButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  feedButtonActive: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  feedButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  feedButtonTextActive: {
    color: '#c00',
    fontWeight: 'bold',
  },
})