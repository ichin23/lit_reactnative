import { Button, Text, Touchable, TouchableOpacity, View } from "react-native";
import { LoginTypes } from "../../navigations/LoginStackNavigations";
import { styles } from "./styles";
import { TextInput } from "react-native-gesture-handler";

export function RegisterScreen({ navigation }: LoginTypes) {
    return <View style={styles.container}>
        <Text style={styles.title}>Cadastre-se</Text>

        
        <Text style={styles.label}>Nome</Text>
        <TextInput style={styles.input}></TextInput>
        <Text style={styles.label}>Usuário</Text>
        <TextInput style={styles.input}></TextInput>
        <Text style={styles.label}>Email</Text>
        <TextInput style={styles.input}></TextInput>
        <Text style={styles.label}>Senha</Text>
        <TextInput style={styles.input}></TextInput>
        <Text style={styles.label}>Confirmar Senha</Text>
        <TextInput style={styles.input}></TextInput>
        

        <TouchableOpacity onPress={() => alert('Cadastrado com sucesso!')} style={styles.registerButton}>
          <Text style={styles.registerButtonText}>Cadastrar</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.pop()} style={styles.backLoginButton}>
          <Text style={styles.backLoginButtonText}>Voltar para Login</Text>
        </TouchableOpacity>
    </View>;
}