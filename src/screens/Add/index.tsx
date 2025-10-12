import React, { useContext, useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import ColorTheme from "../../styles/colors";
import { styles } from "./styles";
import { HomeTypes } from "../../navigations/MainStackNavigation";

import * as Location from 'expo-location';
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { useAuth } from "../../context/auth";
import { makePostUseCases } from "../../core/factories/makePostUseCases";
import { Post } from "../../core/domain/entities/Post";
import { GeoCoordinates } from "../../core/domain/value-objects/GeoCoordinates";
import Toast from "react-native-toast-message";
import { useRoute } from "@react-navigation/native";
import { PostContext } from "../../context/post";

const { createPost } = makePostUseCases();

interface RouteParams {
  photo?: string;
}

export default function AddScreen({ navigation }: HomeTypes) {
  const { user } = useAuth();
  const { fetchPosts } = useContext(PostContext);
  const [title, setTitle] = useState("Forró do André");
  const [photo, setPhoto] = useState<string | null>(null);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {

    async function getCurrentLocation() {
      if (!location) {
        let { status } = await Location.requestForegroundPermissionsAsync();
        console.log(status)
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        console.log(location)
        setLocation(location);
        let place = await Location.reverseGeocodeAsync(location.coords);
        console.log(place);
        setTitle(place[0].name!);
      }
  }

    getCurrentLocation();
  }, []);

  const handleAddPost = async () => {
    try {
      if (!location) {
        alert("Localização não disponível");
        return;
      }

      await createPost.execute({
        userId: user?.id!,
        userName: user?.name!.value!,
        geolocation: GeoCoordinates.create(location.coords.latitude, location.coords.longitude),
        imgUrl: photo!,
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
    } catch (error) {
      Toast.show({
        text1: error.message,
        position: "top",
        visibilityTime: 3000,
        autoHide: true,
        type: "error"
      });
    }
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <MaterialIcons name="arrow-back" size={28} color={ColorTheme.primary} />
      </TouchableOpacity>
      <Text style={styles.label}>Local:</Text>

      {location && (
        <MapView style={styles.map} initialRegion={{
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.0122,
          longitudeDelta: 0.0421,
        }} provider={PROVIDER_GOOGLE}>
          <Marker coordinate={location.coords} />
        </MapView>
      )}

      {!location && <View style={styles.map}><Text>Aguardando localização...</Text></View>}

      {errorMsg && <Text>{errorMsg}</Text>}

      <Text style={styles.inputLabel}>Título</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Digite o título"
        placeholderTextColor={ColorTheme.primary}
      />
      <TouchableOpacity style={styles.photoBox} onPress={() => navigation.navigate('Camera', { onPhotoTaken: (uri: string) => setPhoto(uri) })}>
        {photo ? (
          <Image source={{ uri: photo }} style={styles.photo} />
        ) : (
          <View style={styles.photoPlaceholder} >
            <MaterialIcons name="photo-camera" size={40} color={ColorTheme.primary} />
            <Text style={styles.photoText}>Adicionar foto</Text>
          </View>
        )}
      </TouchableOpacity>
      <TouchableOpacity style={styles.addButton} onPress={handleAddPost}>
        <Text style={styles.addButtonText}>Adicionar</Text>
      </TouchableOpacity>
    </View>
  );
}