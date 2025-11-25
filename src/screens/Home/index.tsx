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
import { PostHomeCard } from "../../components/PostHomeCard";

const { getFriendsFeed } = makePostUseCases();

type FeedType = 'geral' | 'amigos';

export function HomeScreen({ navigation }: HomeTypes) {
    const { postClusters, fetchPosts } = usePost();
    const [refreshing, setRefreshing] = useState(false);
    const [feedType, setFeedType] = useState<FeedType>('amigos');
    const [friendsPosts, setFriendsPosts] = useState<Post[]>([]);
    const [loadingFriends, setLoadingFriends] = useState(false);

    const fetchFriendsFeed = async () => {
        setLoadingFriends(true);
        try {
            const posts = await getFriendsFeed.execute();
            setFriendsPosts(posts);
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
                style={[styles.feedButton, feedType === 'amigos' && styles.feedButtonActive]}
                onPress={() => setFeedType('amigos')}
            >
                <Text style={[styles.feedButtonText, feedType === 'amigos' && styles.feedButtonTextActive]}>
                    Amigos
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.feedButton, feedType === 'geral' && styles.feedButtonActive]}
                onPress={() => setFeedType('geral')}
            >
                <Text style={[styles.feedButtonText, feedType === 'geral' && styles.feedButtonTextActive]}>
                    Geral
                </Text>
            </TouchableOpacity>
        </View>
        <FlatList
            data={displayPosts as any}
            refreshControl={
                <RefreshControl refreshing={refreshing || loadingFriends} onRefresh={onRefresh} />
            }
            style={{ width: '100%', padding: 10 }}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
                feedType === 'amigos' ?
                    <View style={{ marginBottom: 15 }}>
                        <PostHomeCard post={item as Post} containerStyle={{ width: '98%' }} />
                    </View>
                    :
                    <PostCarousel posts={item as Post[]} />
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