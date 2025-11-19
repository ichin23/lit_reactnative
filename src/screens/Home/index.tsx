import { Button, Text, View } from "react-native";
import { styles } from "./styles";
import { FlatList, RefreshControl } from "react-native-gesture-handler";
import { HomeTypes } from "../../navigations/MainStackNavigation";
import { useCallback, useContext, useEffect, useState } from "react";
import { usePost } from "../../context/post";
import { PostCarousel } from "../../components/PostCarousel";
import { SafeAreaView } from "react-native-safe-area-context";

export function HomeScreen({ navigation }: HomeTypes) {
    const { postClusters, fetchPosts } = usePost();
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchPosts().finally(() => setRefreshing(false));
    }, []);

    useEffect(() => {
        fetchPosts();
    }, []);
    
    return <View style={styles.container}>
            <FlatList
                data={postClusters}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                style={{ width: '100%', padding: 10 }}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <PostCarousel posts={item} />
                )}
                ListEmptyComponent={() => (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 50 }}>
                        <Text style={{ fontSize: 18, color: '#555' }}>Nenhum post encontrado.</Text>
                    </View>
                )}
            />
    </View>;
}