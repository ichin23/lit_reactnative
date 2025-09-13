import { Button, Text, View } from "react-native";
import { LoginTypes } from "../../navigations/LoginStackNavigations";
import { styles } from "./styles";
import { FlatList } from "react-native-gesture-handler";
import { posts } from "../../services/data";
import { PostHomeCard } from "../../components/PostHomeCard";
import { HomeTypes } from "../../navigations/MainStackNavigation";

export function HomeScreen({ navigation }: HomeTypes) {
    
    return <View style={styles.container}>
        <FlatList
            data={posts}
            style={{ width: '100%', padding: 10 }}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
                <PostHomeCard post={item} />
            )}
        />
    </View>;
}