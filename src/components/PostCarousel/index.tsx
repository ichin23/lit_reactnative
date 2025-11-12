import React from 'react';
import { View, FlatList, Text } from 'react-native';
import { Post } from '../../core/domain/entities/Post';
import { PostHomeCard } from '../PostHomeCard';
import { styles } from './styles';

interface PostCarouselProps {
    posts: Post[];
}

export function PostCarousel({ posts }: PostCarouselProps) {
    const location = posts.length > 0 ? posts[0].title : 'Posts';

    return (
        <View style={styles.container}>
            <Text style={styles.carouselTitle}>{`${location} (${posts.length})`}</Text>
            <FlatList
                data={posts}
                renderItem={({ item }) => <PostHomeCard post={item} />}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
            />
        </View>
    );
}
