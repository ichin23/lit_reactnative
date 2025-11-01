import { StatusBar } from 'expo-status-bar';
import { Linking, StyleSheet, Text, View } from 'react-native';
import { Navigation } from './src/navigations';
import { AuthProvider } from './src/context/auth';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
import { PostProvider } from './src/context/post';
import { useEffect } from 'react';
import { supabase } from './src/core/infra/supabase/client/supabaseClient';

function App() {
  useEffect(() => {
    const subscription = Linking.addEventListener("url", async ({ url }) => {
      const { data, error } = await supabase.auth.exchangeCodeForSession(url);
      console.log(data, error);
    });

    // Checa se o app foi iniciado pelo link
    Linking.getInitialURL().then(url => {
      if (url) supabase.auth.exchangeCodeForSession(url);
    });

    return () => subscription.remove();
  }, []);

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
