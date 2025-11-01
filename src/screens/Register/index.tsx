import { Button, KeyboardAvoidingView, Platform, Text, Touchable, TouchableOpacity, View } from "react-native";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { LoginTypes } from "../../navigations/LoginStackNavigations";
import { styles } from "./styles";
import { TextInput } from "react-native-gesture-handler";
import { useAuth } from "../../context/auth";
import { useState } from "react";
import { User } from "../../core/domain/entities/User";
import { Name } from "../../core/domain/value-objects/Name";
import { Email } from "../../core/domain/value-objects/Email";
import { Password } from "../../core/domain/value-objects/Password";
import Toast from "react-native-toast-message";
import { Username } from "../../core/domain/value-objects/Username";

export function RegisterScreen({ navigation }: LoginTypes) {
    const { register } = useAuth();
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleRegister = async () => {
        try {
            if (password !== confirmPassword) {
                throw new Error("As senhas não conferem");
            }

            await register({name: name, username: username, email: email, password: password});
            Toast.show({
                text1: "Cadastrado com sucesso!",
                text2: "Confirme seu email no link enviado",
                position: "top",
                visibilityTime: 5000,
                autoHide: true,
                type: "success"
            });
            navigation.pop();
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

    return <View style={styles.container}>
        <KeyboardAwareScrollView style={{flex:1,  width: "100%"}} contentContainerStyle={{flexGrow:1, alignItems: "center", justifyContent: "center"}} enableOnAndroid={true} extraScrollHeight={20}>
            <Text style={styles.title}>Cadastre-se</Text>

            
            <Text style={styles.label}>Nome</Text>
            <TextInput style={styles.input} onChangeText={setName} placeholder="Nome"></TextInput>
            
            <Text style={styles.label}>Usuário</Text>
            <TextInput style={styles.input} onChangeText={setUsername} placeholder="Usuário"></TextInput>
            <Text style={styles.label}>Email</Text>
            <TextInput style={styles.input} onChangeText={setEmail} placeholder="Email"></TextInput>
            <Text style={styles.label}>Senha</Text>
            <TextInput style={styles.input} onChangeText={setPassword} secureTextEntry placeholder="Senha"></TextInput>
            <Text style={styles.label}>Confirmar Senha</Text>
            <TextInput style={styles.input} onChangeText={setConfirmPassword} secureTextEntry placeholder="Confirmar Senha"></TextInput>

            <TouchableOpacity onPress={handleRegister} style={styles.registerButton}>
                <Text style={styles.registerButtonText}>Cadastrar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.pop()} style={styles.backLoginButton}>
                <Text style={styles.backLoginButtonText}>Voltar para Login</Text>
            </TouchableOpacity>
        </KeyboardAwareScrollView>
    </View>;
}