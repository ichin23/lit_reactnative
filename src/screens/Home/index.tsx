import { Button, Text, View } from "react-native";
import { LoginTypes } from "../../navigations/LoginStackNavigations";
import { styles } from "./styles";

export function HomeScreen({ navigation }: LoginTypes) {
    
    return <View style={styles.container}>
        <Text>Home Screen</Text>
    </View>;
}