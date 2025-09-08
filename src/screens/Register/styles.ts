import { StyleSheet } from 'react-native';
import ColorTheme from '../../styles/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: ColorTheme.primary,
  },
  form:{
    flex: 1,
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: ColorTheme.white,
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    alignSelf: 'flex-start',
    marginLeft: '10%',    
    color: ColorTheme.white,
  },
  input: {
    //backgroundColor: '#FFF',
    borderColor: ColorTheme.white,
    borderWidth: 2,
    width: '80%',
    marginBottom: 20,
    borderRadius: 12,
    padding: 10
  },
  registerButton: {
    backgroundColor: ColorTheme.tertiary,
    borderRadius: 12,
    marginBottom: 20,
    width: '40%',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  registerButtonText:{
    textAlign: 'center',
    color: ColorTheme.white,
  },
  backLoginButton:{
    marginTop: 20,
  },
  backLoginButtonText:{
    color: ColorTheme.secondary,
    marginTop: 20,
  }
})