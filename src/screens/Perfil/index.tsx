import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, Alert } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useAuth } from "../../context/auth";
import { styles } from "./styles";
import { useContext, useMemo, useState } from "react";
import { HomeTypes } from "../../navigations/MainStackNavigation";
import { PostContext } from "../../context/post";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { makePostUseCases } from "../../core/factories/makePostUseCases";
import { Post } from "../../core/domain/entities/Post";

const { findPostByUserId, deletePost } = makePostUseCases();

export function PerfilScreen({ navigation }: HomeTypes) {
    const { logout, user } = useAuth();
    const { fetchPosts } = useContext(PostContext);
    const [userPosts, setUserPosts] = useState<Post[]>([]);

    const fetchUserPosts = useCallback(async () => {
        if (user) {
            const posts = await findPostByUserId.execute({userId: user.id});
            setUserPosts(posts);
        }
    }, [user]);

    useFocusEffect(
        useCallback(() => {
            fetchUserPosts();
        }, [fetchUserPosts])
    );

    const handleDeletePost = async (postId: string) => {
        Alert.alert(
            "Confirmar exclusão",
            "Tem certeza que deseja excluir este post?",
            [
                {
                    text: "Cancelar",
                    style: "cancel"
                },
                {
                    text: "Excluir",
                    onPress: async () => {
                        await deletePost.execute({id: postId});
                        await fetchUserPosts();
                        await fetchPosts();
                    },
                    style: "destructive"
                }
            ]
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.avatarContainer}>
                <View style={styles.avatar} />
                <Text style={styles.name}>{user!.name.value}</Text>
                <Text style={styles.places}>{userPosts.length} locais</Text>
                <TouchableOpacity style={styles.logoutButton} onPress={() => navigation.navigate('EditProfile')}>
                    <MaterialIcons name="edit" size={20} color="#fff" />
                    <Text style={styles.logoutText}>Editar Perfil</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.logoutButton} onPress={logout}>
                    <MaterialIcons name="logout" size={20} color="#fff" />
                    <Text style={styles.logoutText}>Sair</Text>
                </TouchableOpacity>
            </View>
            <Text style={styles.historyTitle}>Histórico</Text>
            <FlatList
                data={userPosts}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <View style={styles.historyItem}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.historyName}>{item.userName}</Text>
                            <Text style={styles.historyPlace}>Visitou {item.title}</Text>
                            <Text style={styles.historyDate}>Em {new Date(item.createdAt).toLocaleDateString()}</Text>
                        </View>
                        <Image source={{ uri: item.imgUrl }} style={styles.historyImage} />
                        <TouchableOpacity onPress={() => handleDeletePost(item.id)} style={{ marginLeft: 10 }}>
                            <MaterialIcons name="delete" size={24} color="red" />
                        </TouchableOpacity>
                    </View>
                )}
                style={{ marginTop: 12 }}
            />
        </View>
    );
}