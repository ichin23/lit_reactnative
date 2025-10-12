
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import App from '../../App';
import Toast from 'react-native-toast-message';
import { AuthProvider } from '../context/auth';
import { Navigation } from '../navigations';

jest.mock('react-native-toast-message', () => ({
  show: jest.fn(),
  hide: jest.fn()
}));

describe('User flow', () => {
  it('should register, login, edit profile and delete account', async () => {
    const { getByText, getByPlaceholderText, queryByText } = render(<App />);

    // Register
    fireEvent.press(getByText('Go to Register'));

    const nameInput = getByPlaceholderText('Nome');
    const userInput = getByPlaceholderText('Usuário');
    const emailInput = getByPlaceholderText('Email');
    const passwordInput = getByPlaceholderText('Senha');
    const confirmPasswordInput = getByPlaceholderText('Confirmar Senha');

    fireEvent.changeText(nameInput, 'Test User');
    fireEvent.changeText(userInput, 'testuser');
    fireEvent.changeText(emailInput, 'test@user.com');
    fireEvent.changeText(passwordInput, 'password123');
    fireEvent.changeText(confirmPasswordInput, 'password123');

    fireEvent.press(getByText('Cadastrar'));

    await waitFor(() => {
    expect(Toast.show).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'success' })
      );
    });

    // Login
    //fireEvent.press(getByText('Voltar para Login'));

    const loginEmailInput = getByPlaceholderText('Email');
    const loginPasswordInput = getByPlaceholderText('Senha');

    fireEvent.changeText(loginEmailInput, 'test@user.com');
    fireEvent.changeText(loginPasswordInput, 'password123');

    fireEvent.press(getByText('Login'));

    await waitFor(() => expect(queryByText('Home')).toBeTruthy());

    // Edit Profile
    fireEvent.press(getByText('Perfil'));
    fireEvent.press(getByText('Editar Perfil'));

    const editNameInput = getByPlaceholderText('Nome');
    fireEvent.changeText(editNameInput, 'Test User Edited');

    fireEvent.press(getByText('Salvar'));

    await waitFor(() => {
    expect(Toast.show).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'success' })
      );
    });
    
    // Delete Account
    
    fireEvent.press(getByText('Editar Perfil'));
    fireEvent.press(getByText('Excluir Conta'));

    await waitFor(() => expect(queryByText('Lit.')).toBeTruthy());
  });
});
