import { Button, Text, View } from "react-native";
import { styles } from "./styles";
import { FlatList, RefreshControl } from "react-native-gesture-handler";
import { PostHomeCard } from "../../components/PostHomeCard";
import { HomeTypes } from "../../navigations/MainStackNavigation";
import { useCallback, useContext, useEffect, useState } from "react";
import { PostContext, usePost } from "../../context/post";
import { useFocusEffect } from "@react-navigation/native";

export function HomeScreen({ navigation }: HomeTypes) {
    const { posts, fetchPosts } = usePost();
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchPosts().finally(() => setRefreshing(false));
    }, []);

    useEffect(() => {
        try{
            fetchPosts();
        }catch(error){
            console.error("Fetch:", error)
        }
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