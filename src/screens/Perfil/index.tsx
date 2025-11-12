import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, Alert, Modal, TextInput } from "react-native";
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

const { findPostByUserId, deletePost, updatePost } = makePostUseCases();

export function PerfilScreen({ navigation }: HomeTypes) {
    const { logout, user } = useAuth();
    const { fetchPosts } = useContext(PostContext);
    const [userPosts, setUserPosts] = useState<Post[]>([]);
    const [selectedPost, setSelectedPost] = useState<Post | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [newTitle, setNewTitle] = useState("");

    const fetchUserPosts = useCallback(async () => {
        if (user) {
            const posts = await findPostByUserId.execute({ userId: user.id });
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
                        await deletePost.execute({ id: postId });
                        await fetchUserPosts();
                        await fetchPosts();
                        setModalVisible(false);
                    },
                    style: "destructive"
                }
            ]
        );
    };

    const handleUpdatePost = async () => {
        if (selectedPost) {
            try {
                await updatePost.execute({ id: selectedPost.id, title: newTitle });
                await fetchUserPosts();
                await fetchPosts();
                setModalVisible(false);
                Alert.alert("Sucesso", "Post atualizado com sucesso!");
            } catch (error) {
                Alert.alert("Erro", "Não foi possível atualizar o post.");
            }
        }
    };

    const openModal = (post: Post) => {
        setSelectedPost(post);
        setNewTitle(post.title);
        setModalVisible(true);
    };

    return (
        <View style={styles.container}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Image source={{ uri: selectedPost?.imgUrl }} style={styles.modalImage} />
                        <TextInput
                            style={styles.modalTextInput}
                            onChangeText={setNewTitle}
                            value={newTitle}
                        />
                        <TouchableOpacity
                            style={[styles.button, styles.buttonSalvar]}
                            onPress={handleUpdatePost}
                        >
                            <Text style={styles.textStyle}>Salvar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.button, styles.buttonClose]}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={styles.textStyle}>Fechar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.button, styles.buttonDelete]}
                            onPress={() => handleDeletePost(selectedPost!.id)}
                        >
                            <Text style={styles.textStyle}>Excluir</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

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
                    <TouchableOpacity onPress={() => openModal(item)}>
                        <View style={styles.historyItem}>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.historyName}>{item.userName}</Text>
                                <Text style={styles.historyPlace}>Visitou {item.title}</Text>
                                <Text style={styles.historyDate}>Em {new Date(item.createdAt).toLocaleDateString()}</Text>
                            </View>
                            <Image source={{ uri: item.imgUrl }} style={styles.historyImage} />
                        </View>
                    </TouchableOpacity>
                )}
                style={{ marginTop: 12 }}
            />
        </View>
    );
}