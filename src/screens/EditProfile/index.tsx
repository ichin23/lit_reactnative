import { Text, TouchableOpacity, View, Image, Alert, Modal, TouchableWithoutFeedback } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { useAuth } from "../../context/auth";
import { styles } from "./styles";
import { useEffect, useState } from "react";
import { Name } from "../../core/domain/value-objects/Name";
import { Email } from "../../core/domain/value-objects/Email";
import { Password } from "../../core/domain/value-objects/Password";
import { makeUserUseCases } from "../../core/factories/makeUserUseCases";
import { HomeTypes } from "../../navigations/MainStackNavigation";
import Toast from "react-native-toast-message";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from 'expo-image-picker';
import { supabase } from "../../core/infra/supabase/client/supabaseClient";
import { decode } from 'base64-arraybuffer';
import { MaterialIcons } from "@expo/vector-icons";

export function EditProfileScreen({ navigation }: HomeTypes) {
    const { user, logout, update, deleteUser } = useAuth();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [image, setImage] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        console.log(user)
        if (user) {
            setName(user.name.value);
            setEmail(user.email.value);
            if (user.imgUrl) {
                setImage(user.imgUrl);
            }
        }
    }, [user]);

    const pickImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissionResult.granted === false) {
            alert("É necessário permitir o acesso à galeria!");
            return;
        }

        setModalVisible(false);

        // Delay to allow modal to close animation to finish on iOS
        setTimeout(async () => {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 1,
            });

            if (!result.canceled) {
                setImage(result.assets[0].uri);
            }
        }, 500);
    };

    const takePhoto = async () => {
        const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
        if (permissionResult.granted === false) {
            alert("É necessário permitir o acesso à câmera!");
            return;
        }

        setModalVisible(false);

        // Delay to allow modal to close animation to finish on iOS
        setTimeout(async () => {
            try {
                const result = await ImagePicker.launchCameraAsync({
                    allowsEditing: true,
                    aspect: [1, 1],
                    quality: 1,
                });
                if (!result.canceled) {
                    setImage(result.assets[0].uri);
                }
            } catch (error) {
                console.error("Error taking photo:", error);
                Alert.alert("Erro", "Não foi possível abrir a câmera.");
            }
        }, 500);
    };

    const uploadImage = async () => {
        if (!image || image.startsWith('http')) return image; // Already uploaded or no image

        setUploading(true);
        try {
            const base64 = await new Promise<string>((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.onload = function () {
                    const reader = new FileReader();
                    reader.onloadend = function () {
                        resolve(reader.result as string);
                    };
                    reader.readAsDataURL(xhr.response);
                };
                xhr.onerror = function (e) {
                    console.log(e);
                    reject(new TypeError("Network request failed"));
                };
                xhr.responseType = "blob";
                xhr.open("GET", image, true);
                xhr.send(null);
            });

            // Extract base64 data
            const base64Data = base64.split(',')[1];

            const fileName = `${user!.id}/${Date.now()}.jpg`;
            const { data, error } = await supabase.storage
                .from('fotoPerfil')
                .upload(fileName, decode(base64Data), {
                    contentType: 'image/jpeg',
                    upsert: true
                });

            if (error) {
                throw error;
            }

            const { data: publicUrlData } = supabase.storage
                .from('fotoPerfil')
                .getPublicUrl(fileName);

            return publicUrlData.publicUrl;
        } catch (error) {
            console.error("Error uploading image: ", error);
            throw error;
        } finally {
            setUploading(false);
        }
    };

    const handleUpdate = async () => {
        try {
            const imageUrl = await uploadImage();
            await update({
                id: user!.id,
                name: name,
                email: email,
                imgUrl: imageUrl || undefined
            });
            Toast.show({
                text1: "Dados atualizados com sucesso!",
                position: "top",
                visibilityTime: 3000,
                autoHide: true,
                type: "success"
            });
            navigation.goBack();
        } catch (error) {
            Toast.show({
                text1: (error as any).message,
                position: "top",
                visibilityTime: 3000,
                autoHide: true,
                type: "error"
            });
        }
    }

    const handleDelete = async () => {
        try {
            await deleteUser(user!.id);
            logout();
        } catch (error) {
            alert((error as any).message);
        }
    }

    const handleImageSelection = () => {
        setModalVisible(true);
    }

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Editar Perfil</Text>

            <View style={styles.profileImageContainer}>
                <Image
                    source={image ? { uri: image } : { uri: 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y' }}
                    style={styles.profileImage}
                />
                <TouchableOpacity style={styles.changePhotoButton} onPress={handleImageSelection}>
                    <Text style={styles.changePhotoButtonText}>{uploading ? 'Enviando...' : 'Alterar Foto'}</Text>
                </TouchableOpacity>
            </View>

            <Text style={styles.label}>Nome</Text>
            <TextInput style={styles.input} value={name} placeholder="Nome" onChangeText={setName} />

            <Text style={styles.label}>Email</Text>
            <TextInput style={styles.input} value={email} placeholder="Email" onChangeText={setEmail} />

            <TouchableOpacity style={styles.saveButton} onPress={handleUpdate} disabled={uploading}>
                <Text style={styles.saveButtonText}>{uploading ? 'Salvando...' : 'Salvar'}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
                <Text style={styles.deleteButtonText}>Excluir Conta</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.deleteButton, { backgroundColor: '#666', marginTop: 10 }]} onPress={logout}>
                <Text style={styles.deleteButtonText}>Sair</Text>
            </TouchableOpacity>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
                    <View style={styles.modalContainer}>
                        <TouchableWithoutFeedback>
                            <View style={styles.modalContent}>
                                <TouchableOpacity style={styles.modalOption} onPress={takePhoto}>
                                    <MaterialIcons name="camera-alt" size={24} color="#333" />
                                    <Text style={styles.modalOptionText}>Tirar Foto</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.modalOption} onPress={pickImage}>
                                    <MaterialIcons name="photo-library" size={24} color="#333" />
                                    <Text style={styles.modalOptionText}>Escolher da Galeria</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.modalOption, { borderBottomWidth: 0 }]} onPress={() => setModalVisible(false)}>
                                    <MaterialIcons name="close" size={24} color="#c00" />
                                    <Text style={[styles.modalOptionText, { color: '#c00' }]}>Cancelar</Text>
                                </TouchableOpacity>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </SafeAreaView>
    );
}
