import { Button, Text, View } from "react-native";
import { styles } from "./styles";
import { useAuth } from "../../context/auth";


export function PerfilScreen() {
    const {logout} = useAuth();
    
    return <View style={styles.container}>
        <Text>Perfil Screen</Text>
        
        <Button title="Logout" onPress={logout} />
    </View>;
}