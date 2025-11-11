import { View, Image, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';
import { styles } from "./styles";
import { Post } from "../../core/domain/entities/Post";
import { makePostUseCases } from "../../core/factories/makePostUseCases";
import { useAuth } from "../../context/auth";
import { usePost } from "../../context/post";

const { addPartiu } = makePostUseCases();

export function PostHomeCard({ post }: { post: Post }) {
    const { user } = useAuth();
    const { fetchPosts } = usePost();

    const handlePartiu = async () => {
        if (user) {
            try {
                await addPartiu.execute({ postId: post.id, userId: user.id });
                await fetchPosts();
            } catch (error) {
                console.error("Error adding partiu:", error);
                Alert.alert("Erro", "Você já confirmou presença neste post.");
            }
        }
    };

    return (
        <View style={styles.card}>
            <Image source={{ uri: post.imgUrl }} style={styles.image} />
            <View style={styles.overlay}>
                <Text style={styles.userName}>{post.userName}</Text>
                <Text style={styles.timeAgo}>{post.datetime}</Text>
            </View>
            <View style={styles.bottomRow}>
                <View style={styles.locationRow}>
                    <MaterialIcons name="location-on" size={18} color="#c00" />
                    <Text style={styles.location}>{post.title}</Text>
                </View>
                <TouchableOpacity style={styles.button} onPress={handlePartiu}>
                    <MaterialIcons name="group" size={18} color="#1976d2" />
                    <Text style={styles.buttonText}>{post.partiu} Partiu!</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}