import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { Navigation } from './src/navigations';
import { AuthProvider } from './src/context/auth';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
import { PostProvider } from './src/context/post';

function App() {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <AuthProvider>
        <PostProvider>
          <Navigation />
        </PostProvider>
        <Toast />
      </AuthProvider>
    </GestureHandlerRootView>
  );
}

export default App;
