import React, { useContext, useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import ColorTheme from "../../styles/colors";
import { styles } from "./styles";
import { HomeTypes } from "../../navigations/MainStackNavigation";
import * as MediaLibrary from 'expo-media-library'
import * as Location from 'expo-location';
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from "../../context/auth";
import { makePostUseCases } from "../../core/factories/makePostUseCases";
import { Post } from "../../core/domain/entities/Post";
import { GeoCoordinates } from "../../core/domain/value-objects/GeoCoordinates";
import Toast from "react-native-toast-message";
import { useRoute } from "@react-navigation/native";
import { PostContext } from "../../context/post";
import { Asset } from "expo-asset";
import { supabase } from "../../core/infra/supabase/client/supabaseClient";
import { CameraCapturedPicture } from "expo-camera";
import { decode } from 'base64-arraybuffer'
import { SafeAreaView } from "react-native-safe-area-context";


const { createPost } = makePostUseCases();

interface RouteParams {
  photo?: string;
}

export default function AddScreen({ navigation }: HomeTypes) {
  const { user } = useAuth();
  const { fetchPosts } = useContext(PostContext);
  const [title, setTitle] = useState("Forró do André");
  const [photo, setPhoto] = useState<CameraCapturedPicture | null>(null);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {

    async function getCurrentLocation() {
      if (!location) {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);
        let place = await Location.reverseGeocodeAsync(location.coords);
        console.log(place);
        setTitle(place[0].name!);
      }
    }

    getCurrentLocation();
  }, []);

  async function takePhoto() {
    // 1) Permissão da câmera
    const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
    // 2) Permissão da galeria (necessária no Android 13+ para retornar o asset)
    const mediaPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (cameraPermission.status !== 'granted' || mediaPermission.status !== 'granted') {
      Toast.show({
        text1: "Você recusou o acesso à câmera!",
        position: "top",
        visibilityTime: 3000,
        autoHide: true,
        type: "error"
      });
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      /*setPhoto(result.assets[0]);*/
    }
  }

  const uploadPhotoAndGetUrl = async (): Promise<string> => {
    try {
      if (!user) throw new Error("User not authenticated")
      if (!photo) throw new Error("Take a picture first")

      const fileExt = photo.uri.split(".").pop();
      const fileName = `${user.id}_${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      // console.log("path: ", filePath)
      // const formData = new FormData();
      // formData.append('file', {
      //   uri: photo.uri,
      //   name: photo.fileName || `photo_${Date.now()}.jpg`, // Tenta pegar o nome, senão gera um
      //   type: photo.mimeType ?? 'image/jpeg', // Tenta pegar o tipo, senão usa um padrão
      // } as unknown as Blob);

      const { error: uploadError } = await supabase.storage
        .from('lit-photos')
        .upload(`${filePath}`, decode(photo.base64!), {
          contentType: 'image/jpeg'
        });
      
      if (uploadError) {
        throw new Error('Falha ao fazer upload da imagem');
      }

      const { data: urlData } = supabase.storage
        .from("lit-photos")
        .getPublicUrl(filePath)

      if (!urlData?.publicUrl) {
        throw new Error('Falha ao obter URL pública da imagem');
      }
      return urlData.publicUrl;
    }catch(error){
      throw error;
    }
  }

  const handleAddPost = async () => {
      try {
        if (!location) {
          Toast.show({
            text1: "Localização não disponível",
            position: "top",
            visibilityTime: 3000,
            autoHide: true,
            type: "error"
          });
          return;
        }

        if (!photo) {
          Toast.show({
            text1: "Por favor, tire uma foto primeiro",
            position: "top",
            visibilityTime: 3000,
            autoHide: true,
            type: "error"
          });
          return;
        }

        if (!user || !user.name?.value) {
          Toast.show({
            text1: "Erro de autenticação",
            position: "top",
            visibilityTime: 3000,
            autoHide: true,
            type: "error"
          });
          return;
        }
        
        const imageUrl = await uploadPhotoAndGetUrl();
        await createPost.execute({
          userId: user.id,
          userName: user.name.value,
          geolocation: GeoCoordinates.create(location.coords.latitude, location.coords.longitude),
          imgUrl: imageUrl,
          datetime: new Date().toString(),
          title: title
        });

        await fetchPosts();

        Toast.show({
          text1: "Post adicionado com sucesso!",
          position: "top",
          visibilityTime: 3000,
          autoHide: true,
          type: "success"
        });
        navigation.goBack();
      } catch (error: any) {
        console.error('Error adding post:', error);
        Toast.show({
          text1: error?.message || 'Erro ao adicionar post',
          position: "top",
          visibilityTime: 3000,
          autoHide: true,
          type: "error"
        });
      }
    }    // Render component
    return (
      <SafeAreaView style={styles.container}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={28} color={ColorTheme.primary} />
        </TouchableOpacity>
        <Text style={styles.label}>Local:</Text>

        {location ? (
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              latitudeDelta: 0.0122,
              longitudeDelta: 0.0421,
            }}
            provider={PROVIDER_GOOGLE}
          >
            <Marker
              coordinate={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              }}
            />
          </MapView>
        ) : (
          <View style={styles.map}>
            <Text>Aguardando localização...</Text>
          </View>
        )}

        {errorMsg && <Text>{errorMsg}</Text>}

        <Text style={styles.inputLabel}>Título</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="Digite o Título"
          placeholderTextColor={ColorTheme.primary}
        />

        <TouchableOpacity style={styles.photoBox} onPress={()=>navigation.navigate("Camera",{ onPhotoTaken:(asset:CameraCapturedPicture)=>{console.log(asset.base64); if(asset.base64) setPhoto(asset)}})}>
          {photo ? (
            <Image
              source={{ uri: photo.uri }}
              style={styles.photo}
              onError={(error) => console.error('Error loading image:', error)}
            />
          ) : (
            <View style={styles.photoPlaceholder}>
              <MaterialIcons name="photo-camera" size={40} color={ColorTheme.primary} />
              <Text style={styles.photoText}>Adicionar foto</Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.addButton, (!photo || !location) && { opacity: 0.7 }]}
          onPress={handleAddPost}
          disabled={ !location}
        >
          <Text style={styles.addButtonText}>Adicionar</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }