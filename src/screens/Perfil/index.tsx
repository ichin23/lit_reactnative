import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useAuth } from "../../context/auth";
import { styles } from "./styles";
import { makePostUseCases } from "../../core/factories/makePostUseCases";
import { useEffect, useState } from "react";
import { Post } from "../../core/domain/entities/Post";
import { HomeTypes } from "../../navigations/MainStackNavigation";

const { findPostByUserId } = makePostUseCases();

export function PerfilScreen({ navigation }: HomeTypes) {
    const { logout, user } = useAuth();
    const [posts, setPosts] = useState<Post[]>([] as Post[]);

    useEffect(() => {
        findPostByUserId.execute({userId: user!.id}).then(setPosts);
    }, []);


    return (
        <View style={styles.container}>
            <View style={styles.avatarContainer}>
                <View style={styles.avatar} />
                <Text style={styles.name}>{user!.name.value}</Text>
                <Text style={styles.places}>{posts.length} locais</Text>
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
                data={posts}
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