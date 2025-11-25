import { render, fireEvent, waitFor } from '@testing-library/react-native';
import Toast from 'react-native-toast-message';
import { AuthProvider } from '../context/auth';
import { Navigation } from '../navigations';
import { PostProvider } from '../context/post';
import * as Location from 'expo-location';
import * as MediaLibrary from 'expo-media-library';
import { User } from '../core/domain/entities/User';
import { Name } from '../core/domain/value-objects/Name';
import { Username } from '../core/domain/value-objects/Username';
import { Email } from '../core/domain/value-objects/Email';
import { Password } from '../core/domain/value-objects/Password';
import { Photo } from '../core/domain/value-objects/Photo';
import React from 'react';

jest.mock('react-native-toast-message', () => ({
  show: jest.fn(),
  hide: jest.fn()
}));

jest.mock('expo-location');
jest.mock('expo-media-library');

jest.mock('../screens/Camera/index', () => {
  const ReactNav = require('@react-navigation/native');
  const { View, Button } = require('react-native');
  return {
    CameraScreen: ({ navigation }: { navigation: any }) => {
      const route = ReactNav.useRoute();
      const { onPhotoTaken } = route.params;
      return (
        <View>
          <Button title="Take Mock Photo" onPress={() => {
            if (onPhotoTaken) {
              onPhotoTaken('mocked-photo-uri');
            }
            navigation.goBack();
          }} />
        </View>
      );
    }
  };
});

const mockUser = User.create(
  '1',
  Name.create('Test User'),
  Username.create('testuser'),
  Email.create('test@user.com'),
  Password.create('password123')
);

jest.mock('../context/auth', () => ({
  ...jest.requireActual('../context/auth'),
  useAuth: () => ({
    user: mockUser,
    login: jest.fn(),
    register: jest.fn(),
    logout: jest.fn(),
    update: jest.fn(),
    deleteUser: jest.fn(),
  }),
}));

describe('Create post flow with mocked user', () => {
  it('should create a post successfully', async () => {
    (Location.requestForegroundPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'granted' });
    (Location.getCurrentPositionAsync as jest.Mock).mockResolvedValue({
      coords: { latitude: 10, longitude: 20, altitude: null, accuracy: null, altitudeAccuracy: null, heading: null, speed: null },
    });
    (Location.reverseGeocodeAsync as jest.Mock).mockResolvedValue([{ name: 'Mocked Location' }]);
    (MediaLibrary.requestPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'granted' });
    (MediaLibrary.createAssetAsync as jest.Mock).mockResolvedValue({ uri: 'test-uri' });
    (MediaLibrary.createAlbumAsync as jest.Mock).mockResolvedValue(null);

    const { getByText, getByPlaceholderText, findByText } = render(
      <AuthProvider>
        <PostProvider>
          <Navigation />
        </PostProvider>
      </AuthProvider>
    );

    await waitFor(() => expect(getByText('Home')).toBeTruthy());

    // Navigate to Add screen
    fireEvent.press(getByText(''));

    // Navigate to Camera screen (which is mocked)
    fireEvent.press(getByText('Adicionar foto'));

    // On the mocked CameraScreen, press the button to "take a photo"
    await waitFor(() => fireEvent.press(getByText('Take Mock Photo')));

    // Now we are back on the Add screen, with the photo URI
    // Fill post title
    const titleInput = getByPlaceholderText('Digite o Título');
    fireEvent.changeText(titleInput, 'Test post title');

    // Publish the post
    fireEvent.press(getByText('Adicionar'));

    // Check for success toast
    await waitFor(() => {
      expect(Toast.show).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'success',
          text1: 'Post adicionado com sucesso!'
        })
      );
    });
  });
});