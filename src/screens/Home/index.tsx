import { Button, Text, View } from "react-native";
import { styles } from "./styles";
import { FlatList, RefreshControl } from "react-native-gesture-handler";
import { PostHomeCard } from "../../components/PostHomeCard";
import { HomeTypes } from "../../navigations/MainStackNavigation";
import { makePostUseCases } from "../../core/factories/makePostUseCases";
import { useCallback, useEffect, useState } from "react";
import { Post } from "../../core/domain/entities/Post";

const { findPosts } = makePostUseCases();
export function HomeScreen({ navigation }: HomeTypes) {
    const [posts, setPosts] = useState<Post[]>([] as Post[]);
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        findPosts.execute().then(setPosts).finally(() => setRefreshing(false));
    }, []);

    useEffect(() => {
        findPosts.execute().then(setPosts);
    }, []);
    
    return <View style={styles.container}>
        <FlatList
            data={posts}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            style={{ width: '100%', padding: 10 }}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
                <PostHomeCard post={item} />
            )}
            ListEmptyComponent={() => (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 50 }}>
                    <Text style={{ fontSize: 18, color: '#555' }}>Nenhum post encontrado.</Text>
                </View>
            )}
        />
    </View>;
}