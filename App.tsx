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

function App() {
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false)
  const [isChecking, setIsChecking] = useState(false)
  
  useEffect(() => {
    testSupabaseConnection()
    const subscription = Linking.addEventListener("url", async ({ url }) => {
      const { data, error } = await supabase.auth.exchangeCodeForSession(url);
      console.log(data, error);
    });

    // Checa se o app foi iniciado pelo link
    Linking.getInitialURL().then(url => {
      if (url) supabase.auth.exchangeCodeForSession(url);
    });

    return () => subscription.remove();

    checkForUpdates()
  }, []);

  async function checkForUpdates(){
    try{
      setIsChecking(true)
      const update = await Updates.checkForUpdateAsync();
      if(update.isAvailable){
        setIsUpdateAvailable(true)
        console.log('Update disponíivel')
      }
    }catch(error){
      console.log("erro ao verificar update")
    }finally{
      setIsChecking(false)
    }
  }

  async function downloadAndReload(){
    try{
      await Updates.fetchUpdateAsync()
      await Updates.reloadAsync()
    }catch(error){
      console.error("Erro ao baixar update", error)
    }
  }

  return (
    isUpdateAvailable ? <UpdateScreen onUpdate={downloadAndReload}/> : <GestureHandlerRootView style={{flex: 1}}>
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
