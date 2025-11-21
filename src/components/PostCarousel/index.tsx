import React from 'react';
import { View, FlatList, Text, TouchableOpacity } from 'react-native';
import { Post } from '../../core/domain/entities/Post';
import { PostHomeCard } from '../PostHomeCard';
import { styles } from './styles';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../navigations/MainStackNavigation';

type NavigationProps = NativeStackNavigationProp<MainStackParamList>;

interface PostCarouselProps {
    posts: Post[];
}

export function PostCarousel({ posts }: PostCarouselProps) {
    const navigation = useNavigation<NavigationProps>();
    const locationName = posts.length > 0 ? posts[0].title : 'Posts';
    const destination = posts.length > 0 ? posts[0].geolocation : null;

    const totalPartiu = posts.reduce((acc, post) => acc + (post.partiu || 0), 0);

    const handleRoutePress = () => {
        if (destination) {
            navigation.navigate('Map', {
                destination: destination,
                locationName: locationName
            });
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.carouselTitle}>{locationName}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={styles.postCount}>{posts.length} posts aqui</Text>
                        <Text style={[styles.postCount, { marginLeft: 10 }]}>•   {totalPartiu} partiu</Text>
                    </View>
                </View>

                <TouchableOpacity style={styles.routeButton} onPress={handleRoutePress}>
                    <MaterialIcons name="directions" size={20} color="#1976d2" />
                    <Text style={styles.routeButtonText}>Rota</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={posts}
                renderItem={({ item }) => <PostHomeCard post={item} />}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 10 }}
            />
        </View>
    );
}
