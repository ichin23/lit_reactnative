import { Button, Text, View, TouchableOpacity } from "react-native";
import { styles } from "./styles";
import { FlatList, RefreshControl } from "react-native-gesture-handler";
import { HomeTypes } from "../../navigations/MainStackNavigation";
import { useCallback, useContext, useEffect, useState } from "react";
import { usePost } from "../../context/post";
import { PostCarousel } from "../../components/PostCarousel";
import { SafeAreaView } from "react-native-safe-area-context";
import { makePostUseCases } from "../../core/factories/makePostUseCases";
import { Post } from "../../core/domain/entities/Post";
import * as Location from 'expo-location';

const { getFriendsFeed } = makePostUseCases();

type FeedType = 'geral' | 'amigos';

export function HomeScreen({ navigation }: HomeTypes) {
    const { postClusters, fetchPosts } = usePost();
    const [refreshing, setRefreshing] = useState(false);
    const [feedType, setFeedType] = useState<FeedType>('geral');
    const [friendsPosts, setFriendsPosts] = useState<Post[][]>([]);
    const [loadingFriends, setLoadingFriends] = useState(false);

    const fetchFriendsFeed = async () => {
        setLoadingFriends(true);
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.error('Permission to access location was denied');
                setLoadingFriends(false);
                return;
            }

            const currentLocation = await Location.getCurrentPositionAsync({});
            const clusters = await getFriendsFeed.execute({
                latitude: currentLocation.coords.latitude,
                longitude: currentLocation.coords.longitude,
                radius: 100000,
                zoom: 10
            });

            setFriendsPosts(clusters.map(cluster => cluster.posts));
        } catch (error) {
            console.error("Failed to fetch friends feed:", error);
        } finally {
            setLoadingFriends(false);
        }
    };

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        if (feedType === 'geral') {
            fetchPosts().finally(() => setRefreshing(false));
        } else {
            fetchFriendsFeed().finally(() => setRefreshing(false));
        }
    }, [feedType]);

    useEffect(() => {
        if (feedType === 'geral') {
            fetchPosts();
        } else {
            fetchFriendsFeed();
        }
    }, [feedType]);

    const displayPosts = feedType === 'geral' ? postClusters : friendsPosts;

    return <View style={styles.container}>
        <View style={styles.feedToggle}>
            <TouchableOpacity
                style={[styles.feedButton, feedType === 'geral' && styles.feedButtonActive]}
                onPress={() => setFeedType('geral')}
            >
                <Text style={[styles.feedButtonText, feedType === 'geral' && styles.feedButtonTextActive]}>
                    Geral
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.feedButton, feedType === 'amigos' && styles.feedButtonActive]}
                onPress={() => setFeedType('amigos')}
            >
                <Text style={[styles.feedButtonText, feedType === 'amigos' && styles.feedButtonTextActive]}>
                    Amigos
                </Text>
            </TouchableOpacity>
        </View>
        <FlatList
            data={displayPosts}
            refreshControl={
                <RefreshControl refreshing={refreshing || loadingFriends} onRefresh={onRefresh} />
            }
            style={{ width: '100%', padding: 10 }}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
                <PostCarousel posts={item} />
            )}
            ListEmptyComponent={() => (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 50 }}>
                    <Text style={{ fontSize: 18, color: '#555' }}>
                        {feedType === 'amigos' ? 'Nenhum post de amigos encontrado.' : 'Nenhum post encontrado.'}
                    </Text>
                </View>
            )}
        />
    </View>;
}