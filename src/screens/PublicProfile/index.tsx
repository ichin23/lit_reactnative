import { View, Text, Image, TouchableOpacity, FlatList, Modal, TouchableWithoutFeedback, ActivityIndicator } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { styles } from "./styles";
import { useState, useCallback, useEffect } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { MainStackParamList } from "../../navigations/MainStackNavigation";
import { makePostUseCases } from "../../core/factories/makePostUseCases";
import { makeUserUseCases } from "../../core/factories/makeUserUseCases";
import { Post } from "../../core/domain/entities/Post";
import { User } from "../../core/domain/entities/User";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAuth } from "../../context/auth";
import { makeFollowUseCases } from "../../core/factories/makeFollowUseCases";

const { findPostByUserId } = makePostUseCases();
const { findUserById } = makeUserUseCases();
const { followUser, unfollowUser, isFollowing: checkIsFollowing, sendFollowRequest, hasFollowRequest } = makeFollowUseCases();


type Props = NativeStackScreenProps<MainStackParamList, 'PublicProfile'>;

export function PublicProfileScreen({ route, navigation }: Props) {
    const { userId } = route.params;
    const { user: currentUser } = useAuth();
    const [user, setUser] = useState<User | null>(null);
    const [userPosts, setUserPosts] = useState<Post[]>([]);
    const [selectedPost, setSelectedPost] = useState<Post | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isFollowing, setIsFollowing] = useState(false);
    const [hasRequestSent, setHasRequestSent] = useState(false);
    const [loadingFollow, setLoadingFollow] = useState(false);


    const fetchUserData = useCallback(async () => {
        try {
            const fetchedUser = await findUserById.execute({ id: userId });
            setUser(fetchedUser);

            const posts = await findPostByUserId.execute({ userId: userId });
            const sortedPosts = posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            setUserPosts(sortedPosts);

            if (currentUser) {
                const following = await checkIsFollowing.execute(currentUser.id, userId);
                setIsFollowing(following);

                if (!following) {
                    const requestSent = await hasFollowRequest.execute(currentUser.id, userId);
                    setHasRequestSent(requestSent);
                }
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
        } finally {
            setLoading(false);
        }
    }, [userId, currentUser]);

    const handleFollowToggle = async () => {
        if (!currentUser || !user) return;
        setLoadingFollow(true);
        try {
            if (isFollowing) {
                await unfollowUser.execute(currentUser.id, user.id);
                setIsFollowing(false);
            } else {
                await sendFollowRequest.execute(currentUser.id, user.id);
                setHasRequestSent(true);
            }
        } catch (error) {
            console.error("Error toggling follow:", error);
            alert("Erro ao atualizar status de seguidor.");
        } finally {
            setLoadingFollow(false);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, [fetchUserData]);

    const openModal = (post: Post) => {
        setSelectedPost(post);
        setModalVisible(true);
    };

    const renderHeader = () => {
        if (!user) return null;
        return (
            <>
                <View style={styles.avatarContainer}>
                    <Image
                        source={user.imgUrl ? { uri: user.imgUrl } : { uri: 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y' }}
                        style={styles.avatar}
                    />
                    <View style={styles.usernameOverlay}>
                        <Text style={styles.usernameText}>@{user.username.value}</Text>
                    </View>
                    <Text style={styles.name}>{user.name.value}</Text>
                    <Text style={styles.places}>{userPosts.length} locais</Text>

                    {currentUser && currentUser.id !== user.id && (
                        <TouchableOpacity
                            style={[
                                styles.followButton,
                                isFollowing && styles.followingButton,
                                hasRequestSent && !isFollowing && styles.requestSentButton
                            ]}
                            onPress={handleFollowToggle}
                            disabled={loadingFollow || (hasRequestSent && !isFollowing)}
                        >
                            <Text style={[
                                styles.followButtonText,
                                isFollowing && styles.followingButtonText,
                                hasRequestSent && !isFollowing && styles.requestSentButtonText
                            ]}>
                                {isFollowing ? "Deixar de Seguir" : hasRequestSent ? "Solicitação Enviada" : "Seguir"}
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>
                <Text style={styles.historyTitle}>Histórico</Text>
            </>
        );
    };

    const renderGridItem = ({ item }: { item: Post }) => (
        <TouchableOpacity style={styles.gridItem} onPress={() => openModal(item)}>
            <Image source={{ uri: item.imgUrl }} style={styles.gridImage} />
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color="#c00" />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10 }}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <MaterialIcons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
            </View>

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
                                <TouchableOpacity style={[styles.modalOption, { borderBottomWidth: 0 }]} onPress={() => setModalVisible(false)}>
                                    <MaterialIcons name="close" size={24} color="#666" />
                                    <Text style={[styles.modalOptionText, { color: '#666' }]}>Fechar</Text>
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
        </SafeAreaView>
    );
}
