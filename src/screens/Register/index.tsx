import { Button, Text, Touchable, TouchableOpacity, View } from "react-native";
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

            const nameVO = Name.create(name);
            const emailVO = Email.create(email);
            const passwordVO = Password.create(password);

            await register({name: nameVO.value, email: emailVO.value, password: passwordVO.value});
            Toast.show({
                text1: "Cadastrado com sucesso!",
                position: "top",
                visibilityTime: 3000,
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
    </View>;
}