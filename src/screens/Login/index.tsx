import { Button, Text, TouchableOpacity, View, KeyboardAvoidingView, Platform, ScrollView, TouchableWithoutFeedback, Keyboard } from "react-native";
import { LoginTypes } from "../../navigations/LoginStackNavigations";
import { styles } from "./styles";
import { useAuth } from "../../context/auth";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { TextInput } from "react-native-gesture-handler";
import { useState } from "react";
import { Email } from "../../core/domain/value-objects/Email";
import { Password } from "../../core/domain/value-objects/Password";
import Toast from "react-native-toast-message";
import { SafeAreaView } from "react-native-safe-area-context";


export function LoginScreen({ navigation }: LoginTypes) {
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        try {
            const emailVO = Email.create(email);
            const passwordVO = Password.create(password);
            await login(emailVO.value, passwordVO.value);
        } catch (error: any) {
            Toast.show({
                text1: "Ocorreu um erro no login",
                text2: error.message,
                type: "error",
                position: "top",
                visibilityTime: 3000,
            });
        }
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: styles.container.backgroundColor }}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <ScrollView
                        contentContainerStyle={styles.scrollContainer}
                        keyboardShouldPersistTaps="handled"
                    >
                        <FontAwesome5 name="map-marker-alt" size={80} color="#F6F6F6" />
                        <Text style={styles.title}>Lit.</Text>
                        <Text style={styles.subtitle}>Seu próximo rolê se encontra aqui</Text>

                        <TextInput
                            placeholder="Email"
                            placeholderTextColor={"#FFF"}
                            style={styles.input}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
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
                    </ScrollView>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}