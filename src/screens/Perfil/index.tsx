import { View, Text, Image, TouchableOpacity, FlatList, Alert, Modal, TextInput, TouchableWithoutFeedback } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useAuth } from "../../context/auth";
import { styles } from "./styles";
import { useContext, useState, useCallback, useRef } from "react";
import { HomeTypes } from "../../navigations/MainStackNavigation";
import { PostContext } from "../../context/post";
import { useFocusEffect } from "@react-navigation/native";
import { makePostUseCases } from "../../core/factories/makePostUseCases";
import { Post } from "../../core/domain/entities/Post";

import { SafeAreaView } from "react-native-safe-area-context";

const { findPostByUserId, deletePost, updatePost } = makePostUseCases();




export function PerfilScreen({ navigation }: HomeTypes) {
    const { logout, user } = useAuth();
    const { fetchPosts } = useContext(PostContext);
    const [userPosts, setUserPosts] = useState<Post[]>([]);
    const [selectedPost, setSelectedPost] = useState<Post | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [editModalVisible, setEditModalVisible] = useState(false);
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
                setEditModalVisible(false);
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

    const renderHeader = () => (
        <>
            <View style={styles.avatarContainer}>
                <Image
                    source={user?.imgUrl ? { uri: user.imgUrl } : { uri: 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y' }}
                    style={styles.avatar}
                />
                <View style={styles.usernameOverlay}>
                    <Text style={styles.usernameText}>@{user?.username?.value}</Text>
                </View>
                <Text style={styles.name}>{user!.name.value}</Text>
                <Text style={styles.places}>{userPosts.length} locais</Text>


            </View>
            <Text style={styles.historyTitle}>Histórico</Text>
        </>
    );

    const renderGridItem = ({ item }: { item: Post }) => (
        <TouchableOpacity style={styles.gridItem} onPress={() => openModal(item)}>
            <Image source={{ uri: item.imgUrl }} style={styles.gridImage} />
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
                    <View style={styles.modalContainer}>
                        <TouchableWithoutFeedback>
                            <View style={styles.modalContent}>
                                {selectedPost && (
                                    <View style={styles.modalHeaderContainer}>
                                        <Image source={{ uri: selectedPost.imgUrl }} style={styles.modalHeaderImage} />
                                        <Text style={styles.modalHeaderTitle}>{selectedPost.title}</Text>
                                        <Text style={styles.modalHeaderDate}>
                                            Visitou em {new Date(selectedPost.createdAt).toLocaleDateString()} às {new Date(selectedPost.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </Text>
                                    </View>
                                )}
                                <TouchableOpacity style={styles.modalOption} onPress={() => {
                                    setModalVisible(false);
                                    setNewTitle(selectedPost?.title || "");
                                    setEditModalVisible(true);
                                }}>
                                    <MaterialIcons name="edit" size={24} color="#333" />
                                    <Text style={styles.modalOptionText}>Editar</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.modalOption} onPress={() => {
                                    if (selectedPost) {
                                        handleDeletePost(selectedPost.id);
                                    }
                                }}>
                                    <MaterialIcons name="delete" size={24} color="#c00" />
                                    <Text style={[styles.modalOptionText, { color: '#c00' }]}>Excluir</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.modalOption, { borderBottomWidth: 0 }]} onPress={() => setModalVisible(false)}>
                                    <MaterialIcons name="close" size={24} color="#666" />
                                    <Text style={[styles.modalOptionText, { color: '#666' }]}>Cancelar</Text>
                                </TouchableOpacity>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>

            <Modal
                animationType="slide"
                transparent={true}
                visible={editModalVisible}
                onRequestClose={() => setEditModalVisible(false)}
            >
                <TouchableWithoutFeedback onPress={() => setEditModalVisible(false)}>
                    <View style={styles.centeredView}>
                        <TouchableWithoutFeedback>
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
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>

            <FlatList
                data={userPosts}
                keyExtractor={item => item.id}
                renderItem={renderGridItem}
                numColumns={3}
                contentContainerStyle={{ paddingBottom: 80 }}
                ListHeaderComponent={renderHeader}
            />
        </View>
    );
}
