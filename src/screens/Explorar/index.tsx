import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, StyleSheet, ActivityIndicator, TouchableOpacity, Modal, Text, FlatList, Image, Dimensions } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import * as Location from 'expo-location';
import { makePostUseCases } from '../../core/factories/makePostUseCases';
import { Post } from '../../core/domain/entities/Post';
import { MaterialIcons } from '@expo/vector-icons';
import { styles } from './styles';
import { ClusteredPost } from '../../core/domain/repositories/IPostRepository';

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

    const fetchClusteredPosts = useCallback(async (currentRegion: Region) => {
        if (!currentRegion) return;

        setLoading(true);
        try {
            const zoom = Math.round(Math.log(360 / currentRegion.longitudeDelta) / Math.LN2);
            const radius = 10; // 100km radius, a ser ajustado conforme o necessario

            const posts = await findClusteredPostByGeoLocation.execute({
                latitude: currentRegion.latitude,
                longitude: currentRegion.longitude,
                radius,
                zoom
            });
            setClusteredPosts(posts);
            console.log(posts)
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
            latitudeDelta: 0.000922,
            longitudeDelta: 0.000421,
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
        if (region && item.is_cluster) {
            const newRegion = {
                latitude: item.latitude,
                longitude: item.longitude,
                latitudeDelta: region.latitudeDelta / 2,
                longitudeDelta: region.longitudeDelta / 2,
            };
            mapRef.current?.animateToRegion(newRegion, 500);
        } else {
            if(!item.post_id) return;
            const post = await findPostById.execute(item.post_id);
            if(post){
                setSelectedPosts([post]);
                setPopupVisible(true);
            }
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

    return (
        <View style={styles.container}>
            {loading || !location ? (
                <ActivityIndicator size="large" style={StyleSheet.absoluteFill} />
            ) : (
                <MapView
                    ref={mapRef}
                    style={styles.map}
                    provider={PROVIDER_GOOGLE}
                    initialRegion={region}
                    onRegionChangeComplete={onRegionChangeComplete}
                >
                    {clusteredPosts && clusteredPosts.map((item) => (
                        <Marker
                            key={item.id}
                            coordinate={{
                                latitude: item.latitude,
                                longitude: item.longitude,
                            }}
                            onPress={() => handleMarkerPress(item)}
                        >
                            {item.is_cluster ? (
                                <View style={styles.clusterMarker}>
                                    <Text style={styles.clusterText}>{item.point_count}</Text>
                                </View>
                            ) : (
                                <MaterialIcons name="place" size={32} color="red" />
                            )}
                        </Marker>
                    ))}
                </MapView>
            )}
            <TouchableOpacity style={styles.refreshButton} onPress={handleLocationAndPosts}>
                <MaterialIcons name="refresh" size={24} color="black" />
            </TouchableOpacity>

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
