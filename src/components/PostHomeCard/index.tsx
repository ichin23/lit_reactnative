import { View, Image, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';
import { styles } from "./styles";
import { Post } from "../../core/domain/entities/Post";
import { makePostUseCases } from "../../core/factories/makePostUseCases";
import { useAuth } from "../../context/auth";
import { usePost } from "../../context/post";
import { formatTimeAgo } from "../../utils/dateUtils";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { MainStackParamList } from "../../navigations/MainStackNavigation";

const { addPartiu } = makePostUseCases();

export function PostHomeCard({ post }: { post: Post }) {
    const { user } = useAuth();
    const { fetchPosts } = usePost();
    const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();

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

    const handleProfilePress = () => {
        navigation.navigate('PublicProfile', { userId: post.userId });
    };

    return (
        <View style={styles.card}>
            <Image source={{ uri: post.imgUrl }} style={styles.image} />
            <View style={styles.overlay}>
                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={handleProfilePress}>
                    <Image
                        source={{ uri: post.userProfileImgUrl || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y' }}
                        style={styles.userAvatar}
                    />
                    <View style={styles.userInfo}>
                        <Text style={styles.userName}>{post.username}</Text>
                        <Text style={styles.timeAgo}>{formatTimeAgo(post.createdAt)}</Text>
                    </View>
                </TouchableOpacity>
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