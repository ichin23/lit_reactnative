import { StyleSheet } from 'react-native';
import ColorTheme from '../../styles/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: ColorTheme.primary,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFF',
  },
  subtitle: {
    fontSize: 16,
    color: '#FFF',
  },
  input: {
    //backgroundColor: '#FFF',
    borderColor: "#FFF",
    borderWidth: 2,
    width: '80%',
    marginTop: 20,
    borderRadius: 12,
    padding: 10
  },
  loginButton: {
    marginTop: 20,
    backgroundColor: ColorTheme.tertiary,
    padding: 10,
    width: '40%',
    borderRadius: 12,
  },
  registerButton: {
    marginTop: 10,
    color: ColorTheme.secondary,
  },
  registerButtonText: {
    padding: 10,
    color: ColorTheme.secondary,
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
  }
})