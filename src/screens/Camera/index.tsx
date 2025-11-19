import { CameraView, CameraType, useCameraPermissions, CameraCapturedPicture } from 'expo-camera';
import { useEffect, useRef, useState } from 'react';
import { Button, Text, TouchableOpacity, View, Alert, ImageBackground } from 'react-native';
import { styles } from './styles'
import '../../styles/colors';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import * as MediaLibrary from 'expo-media-library'
import ColorTheme from '../../styles/colors';
import { HomeTypes } from '../../navigations/MainStackNavigation';
import { useRoute } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import * as ImagePicker from 'expo-image-picker'
import { SafeAreaView } from 'react-native-safe-area-context';

export function CameraScreen({navigation}: HomeTypes) {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [permissionMedia, requestPermissionMedia] = MediaLibrary.usePermissions();
  const ref = useRef<CameraView>(null)
  const [photo, setPhoto] = useState<CameraCapturedPicture>()

  const route = useRoute();
  const {onPhotoTaken} = route.params || {};

  useEffect(() => {
    async function setAspect() {
      if (ref.current) {
        const ratios = await ref.current.getAvailablePictureSizesAsync();
        console.log("Ratios suportados:", ratios);
        // ex: ["4:3", "16:9"]
      }
    }
    setAspect();
  }, [ref]);

  if (!permission) {
    return <Text>Carregando...</Text>
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.message}>Você precisa dar permissão para acesso à Câmera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </SafeAreaView>
    );
  }

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  async function takePicture() {
    if (ref.current) {
      const picture = await ref.current.takePictureAsync({ imageType: 'jpg', quality: 0.6, shutterSound: false, base64: true })
      setPhoto(picture)
    }
  }

  async function savePhoto() {
    console.log(permissionMedia?.status)
    if (permissionMedia?.status !== 'granted') {
      await requestPermissionMedia();
    }
    const asset = await MediaLibrary.createAssetAsync(photo!.uri)

    
    MediaLibrary.createAlbumAsync("Lit", asset, false),
    
    onPhotoTaken && onPhotoTaken(photo);
    navigation.goBack();
    Toast.show({
      text1: "Foto salva na galeria!",
      position: "top",
      visibilityTime: 3000,
      autoHide: true,
      type: "success"
    });
  }

  if (photo) {
    return (
      <SafeAreaView style={styles.container}>
        <ImageBackground source={{ uri: photo.uri }} style={styles.camera}></ImageBackground>
        <View style={styles.footerSave}>
            <TouchableOpacity style={styles.button} onPress={() => setPhoto(undefined)}>
              <Text style={styles.buttonText}>Voltar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button}  onPress={savePhoto}>
              <Text style={styles.buttonText}>Salvar</Text>
            </TouchableOpacity>
          </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <CameraView style={styles.camera} facing={facing} ref={ref}  ratio='1:1'/>
      
      <View style={styles.footerCamera}>
        <TouchableOpacity onPress={toggleCameraFacing}>
          <AntDesign name="retweet" size={60} color={ColorTheme.primary} />
        </TouchableOpacity>
        <TouchableOpacity onPress={takePicture} style={styles.ball} />
        <TouchableOpacity onPress={toggleCameraFacing}>
          <Ionicons name="flash" size={60} color={ColorTheme.primary} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}