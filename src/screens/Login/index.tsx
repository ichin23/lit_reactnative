import { Button, Text, TouchableOpacity, View } from "react-native";
import { LoginTypes } from "../../navigations/LoginStackNavigations";
import { styles } from "./styles";
import { useAuth } from "../../context/auth";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { TextInput } from "react-native-gesture-handler";
import { useState } from "react";
import { Email } from "../../core/domain/value-objects/Email";
import { Password } from "../../core/domain/value-objects/Password";


export function LoginScreen({ navigation }: LoginTypes) {
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        try {
            const emailVO = Email.create(email);
            const passwordVO = Password.create(password);
            await login(emailVO.value, passwordVO.value);
        } catch (error) {
            alert(error.message);
        }
    }

    return <View style={styles.container}>
        
        <FontAwesome5 name="map-marker-alt" size={80} color="#F6F6F6" />
        <Text style={styles.title}>Lit.</Text>
        <Text style={styles.subtitle}>Seu próximo rolê se encontra aqui</Text>

        <TextInput
            placeholder="Email"
            placeholderTextColor={"#FFF"}
            style={styles.input}
            onChangeText={setEmail}
        />
        <TextInput
            placeholder="Senha"
            placeholderTextColor={"#FFF"}
            style={styles.input}
            onChangeText={setPassword}
            secureTextEntry
        />

        <TouchableOpacity onPress={handleLogin} style={styles.loginButton}>
          <Text style={{ color: 'white', textAlign: 'center' }}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Register')} style={styles.registerButton}>
          <Text style={styles.registerButtonText}>Go to Register</Text>
        </TouchableOpacity>
    </View>;
}