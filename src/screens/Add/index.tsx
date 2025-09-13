import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import ColorTheme from "../../styles/colors";
import { styles } from "./styles";
import { HomeTypes } from "../../navigations/MainStackNavigation";

export default function AddScreen({ navigation }: HomeTypes) {
  const [title, setTitle] = useState("Forró do André");
  const [photo, setPhoto] = useState<string | null>(null);

  // Simulação de seleção de foto
  const handleAddPhoto = () => {
    // Aqui você pode integrar com expo-image-picker ou similar
    setPhoto("https://images.unsplash.com/photo-1464983953574-0892a716854b");
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <MaterialIcons name="arrow-back" size={28} color={ColorTheme.primary} />
      </TouchableOpacity>
      <Text style={styles.label}>Local:</Text>
      <Image
        source={{ uri: "https://i.imgur.com/8Km9tLL.png" }} // Imagem de mapa exemplo
        style={styles.map}
        resizeMode="cover"
      />
      <Text style={styles.inputLabel}>Título</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Digite o título"
        placeholderTextColor={ColorTheme.primary}
      />
      <TouchableOpacity style={styles.photoBox} onPress={handleAddPhoto}>
        {photo ? (
          <Image source={{ uri: photo }} style={styles.photo} />
        ) : (
          <View style={styles.photoPlaceholder}>
            <MaterialIcons name="photo-camera" size={40} color={ColorTheme.primary} />
            <Text style={styles.photoText}>Adicionar foto</Text>
          </View>
        )}
      </TouchableOpacity>
      <TouchableOpacity style={styles.addButton}>
        <Text style={styles.addButtonText}>Adicionar</Text>
      </TouchableOpacity>
    </View>
  );
}