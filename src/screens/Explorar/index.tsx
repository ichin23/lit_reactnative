import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, StyleSheet, ActivityIndicator, TouchableOpacity, Modal, Text, FlatList, Image, Dimensions, TextInput } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import * as Location from 'expo-location';
import { makePostUseCases } from '../../core/factories/makePostUseCases';
import { makeUserUseCases } from '../../core/factories/makeUserUseCases';
import { Post } from '../../core/domain/entities/Post';
import { User } from '../../core/domain/entities/User';
import { MaterialIcons } from '@expo/vector-icons';
import { styles } from './styles';
import { ClusteredPost } from '../../core/domain/repositories/IPostRepository';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../navigations/MainStackNavigation';

const { findClusteredPostByGeoLocation, findPostById } = makePostUseCases();
const { width } = Dimensions.get('window');

export function ExplorarScreen() {
    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [clusteredPosts, setClusteredPosts] = useState<ClusteredPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [isPopupVisible, setPopupVisible] = useState(false);
    const [selectedPosts, setSelectedPosts] = useState<Post[]>([]);
    const flatListRef = useRef<FlatList<Post>>(null);
    const mapRef = useRef<MapView>(null);
    const [region, setRegion] = useState<Region>();
    const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();

    const fetchClusteredPosts = useCallback(async (currentRegion: Region) => {
        if (!currentRegion) return;

        setLoading(true);
        try {
            const zoom = Math.round(Math.log(360 / currentRegion.longitudeDelta) / Math.LN2);
            const radius = 100000; // 100km radius, a ser ajustado conforme o necessario

            const posts = await findClusteredPostByGeoLocation.execute({
                latitude: currentRegion.latitude,
                longitude: currentRegion.longitude,
                radius,
                zoom
            });
            setClusteredPosts(posts);

            console.log("POSTs MAP: ", posts)
        } catch (error) {
            console.error("Failed to fetch clustered posts:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    const handleLocationAndPosts = useCallback(async () => {
        setLoading(true);
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            console.error('Permission to access location was denied');
            setLoading(false);
            return;
        }

        let currentLocation = await Location.getCurrentPositionAsync({});
        setLocation(currentLocation);
        const initialRegion = {
            latitude: currentLocation.coords.latitude,
            longitude: currentLocation.coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
        };
        setRegion(initialRegion);
        await fetchClusteredPosts(initialRegion);
    }, [fetchClusteredPosts]);

    useEffect(() => {
        if (!location) {
            handleLocationAndPosts();
        }
    }, [location, handleLocationAndPosts]);

    const handleMarkerPress = async (item: ClusteredPost) => {
        if (region) {

            const newRegion = {
                latitude: item.posts[0].geolocation.latitude,
                longitude: item.posts[0].geolocation.longitude,
                latitudeDelta: region.latitudeDelta / 2,
                longitudeDelta: region.longitudeDelta / 2,
            };
            mapRef.current?.animateToRegion(newRegion, 500);
        }
        if (!item.posts[0].id) return;
        const post = await findPostById.execute(item.posts[0].id);
        if (post) {
            setSelectedPosts(item.posts);
            setPopupVisible(true);
        }

    };

    const onRegionChangeComplete = (newRegion: Region) => {
        setRegion(newRegion);
        fetchClusteredPosts(newRegion);
    };

    const renderPostItem = ({ item }: { item: Post }) => (
        <View style={styles.postItem}>
            <Image source={{ uri: item.imgUrl }} style={styles.postImage} />
            <Text style={styles.postTitle}>{item.title}</Text>
        </View>
    );

    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<User[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const { searchUsers } = makeUserUseCases();

    const handleSearch = async (query: string) => {
        setSearchQuery(query);
        if (query.trim().length === 0) {
            setSearchResults([]);
            return;
        }

        setIsSearching(true);
        try {
            const users = await searchUsers.execute(query);
            setSearchResults(users);
        } catch (error) {
            console.error("Search failed:", error);
        } finally {
            setIsSearching(false);
        }
    };

    const renderUserItem = ({ item }: { item: User }) => (
        <TouchableOpacity
            style={styles.userItem}
            onPress={() => navigation.navigate('PublicProfile', { userId: item.id })}
        >
            <Image
                source={{ uri: item.imgUrl || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y' }}
                style={styles.userImage}
            />
            <View>
                <Text style={styles.userName}>{item.name.value}</Text>
                <Text style={styles.userUsername}>@{item.username.value}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <MaterialIcons name="search" size={24} color="#666" style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Buscar usuários..."
                    value={searchQuery}
                    onChangeText={handleSearch}
                />
                {isSearching && <ActivityIndicator size="small" color="#666" />}
            </View>

            {searchQuery.length > 0 ? (
                <FlatList
                    data={searchResults}
                    renderItem={renderUserItem}
                    keyExtractor={item => item.id}
                    style={styles.searchResults}
                    ListEmptyComponent={
                        !isSearching ? <Text style={styles.emptyText}>Nenhum usuário encontrado</Text> : null
                    }
                />
            ) : (
                <>
                    {loading || !location ? (
                        <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(255,255,255,0.5)', justifyContent: 'center', alignItems: 'center' }]}>
                            <ActivityIndicator size="large" color="#000" />
                        </View>
                    ) : null}

                    <MapView
                        ref={mapRef}
                        style={styles.map}
                        provider={PROVIDER_GOOGLE}
                        initialRegion={region}
                        onRegionChangeComplete={onRegionChangeComplete}
                    >
                        {clusteredPosts && clusteredPosts.map((item) => (
                            <Marker
                                key={item.cluster_id}
                                coordinate={{
                                    latitude: item.posts[0].geolocation.latitude,
                                    longitude: item.posts[0].geolocation.longitude,
                                }}
                                onPress={() => handleMarkerPress(item)}
                            >
                                <View style={styles.clusterMarker}>
                                    <Text style={styles.clusterText}>{item.posts.length}</Text>
                                </View>
                            </Marker>
                        ))}
                    </MapView>

                    <TouchableOpacity style={styles.refreshButton} onPress={handleLocationAndPosts}>
                        <MaterialIcons name="refresh" size={24} color="black" />
                    </TouchableOpacity>
                </>
            )}

            <Modal
                animationType="slide"
                transparent={true}
                visible={isPopupVisible}
                onRequestClose={() => setPopupVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <FlatList
                            ref={flatListRef}
                            data={selectedPosts}
                            renderItem={renderPostItem}
                            keyExtractor={item => item.id}
                            horizontal
                            pagingEnabled
                            showsHorizontalScrollIndicator={false}
                        />
                        <TouchableOpacity onPress={() => setPopupVisible(false)} style={styles.closeButton}>
                            <Text style={styles.closeButtonText}>Fechar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}
