import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { Linking, StyleSheet, Text, View } from 'react-native';
import { Navigation } from './src/navigations';
import { AuthProvider } from './src/context/auth';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
import { PostProvider } from './src/context/post';
import { useEffect, useState } from 'react';
import { supabase } from './src/core/infra/supabase/client/supabaseClient';
import { testSupabaseConnection } from './src/utils/testSupabase';
import * as Updates from 'expo-updates'
import { UpdateScreen } from './src/screens/Update';
import { FollowRequestProvider } from './src/context/followRequest';
import { CacheDatabase } from './src/core/infra/db/CacheDatabase';


function App() {
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false)
  const [isChecking, setIsChecking] = useState(false)

  useEffect(() => {
    // Initialize cache database
    CacheDatabase.init().catch(err => console.error('Failed to init cache:', err));

    // testSupabaseConnection()
    const subscription = Linking.addEventListener("url", async ({ url }) => {
      const { data, error } = await supabase.auth.exchangeCodeForSession(url);
      console.log(data, error);
    });

    // Checa se o app foi iniciado pelo link
    Linking.getInitialURL().then(url => {
      if (url) supabase.auth.exchangeCodeForSession(url);
    });

    checkForUpdates()
    CacheDatabase.getPosts().then(posts => console.log("Posts cached: ", posts))

    return () => subscription.remove();

  }, []);

  async function checkForUpdates() {
    try {
      setIsChecking(true)
      const update = await Updates.checkForUpdateAsync();
      if (update.isAvailable) {
        setIsUpdateAvailable(true)
        console.log('Update disponíivel')
      }
    } catch (error) {
      console.log("erro ao verificar update")
    } finally {
      setIsChecking(false)
    }
  }

  async function downloadAndReload() {
    try {
      await Updates.fetchUpdateAsync()
      await Updates.reloadAsync()
    } catch (error) {
      console.error("Erro ao baixar update", error)
    }
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {isUpdateAvailable ? <UpdateScreen onUpdate={downloadAndReload} /> :
        <AuthProvider>
          <PostProvider>
            <FollowRequestProvider>
              <Navigation />
            </FollowRequestProvider>
          </PostProvider>
          <Toast />
        </AuthProvider>
      }
    </GestureHandlerRootView>
  );
}

export default App;

