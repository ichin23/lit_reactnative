import { Text, TouchableOpacity, View } from "react-native";
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


export function EditProfileScreen({ navigation }: HomeTypes) {
    const { user, logout, update, deleteUser } = useAuth();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    useEffect(() => {
        console.log(user)
        if (user) {
            setName(user.name.value);
            setEmail(user.email.value);
        }
    }, [user]);

    const handleUpdate = async () => {
        try {
            await update({
                id: user!.id,
                name: name,
                email: email
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
                text1: error.message,
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
            alert(error.message);
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Editar Perfil</Text>

            <Text style={styles.label}>Nome</Text>
            <TextInput style={styles.input} value={name} placeholder="Nome" onChangeText={setName} />

            <Text style={styles.label}>Email</Text>
            <TextInput style={styles.input} value={email} placeholder="Email" onChangeText={setEmail} />

            <TouchableOpacity style={styles.saveButton} onPress={handleUpdate}>
                <Text style={styles.saveButtonText}>Salvar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
                <Text style={styles.deleteButtonText}>Excluir Conta</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}
