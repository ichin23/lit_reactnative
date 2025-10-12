import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useAuth } from "../../context/auth";
import { styles } from "./styles";
import { useContext, useMemo } from "react";
import { HomeTypes } from "../../navigations/MainStackNavigation";
import { PostContext } from "../../context/post";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";

export function PerfilScreen({ navigation }: HomeTypes) {
    const { logout, user } = useAuth();
    const { posts, fetchPosts } = useContext(PostContext);

    useFocusEffect(
        useCallback(() => {
            fetchPosts();
        }, [])
    );

    const userPosts = useMemo(() => posts.filter(post => post.userId === user!.id), [posts, user]);

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
                            <Text style={styles.historyDate}>Em {item.createdAt.toLocaleDateString()}</Text>
                        </View>
                        <Image source={{ uri: item.imgUrl }} style={styles.historyImage} />
                    </View>
                )}
                style={{ marginTop: 12 }}
            />
        </View>
    );
}