import { View, Text, TouchableOpacity, FlatList, Image, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { useState, useEffect, useCallback } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { MainStackParamList } from "../../navigations/MainStackNavigation";
import { makeFollowUseCases } from "../../core/factories/makeFollowUseCases";
import { makeUserUseCases } from "../../core/factories/makeUserUseCases";
import { User } from "../../core/domain/entities/User";
import { useAuth } from "../../context/auth";
import { useFollowRequest } from "../../context/followRequest";
import { styles } from "./styles";


const { getPendingFollowRequests, getSentFollowRequests, acceptFollowRequest, rejectFollowRequest } = makeFollowUseCases();
const { findUserById } = makeUserUseCases();

type Props = NativeStackScreenProps<MainStackParamList, 'FollowRequests'>;

type TabType = 'pending' | 'sent';

interface UserRequest {
    userId: string;
    user: User | null;
}

export function FollowRequestsScreen({ navigation }: Props) {
    const { user: currentUser } = useAuth();
    const { refreshPendingCount } = useFollowRequest();
    const [activeTab, setActiveTab] = useState<TabType>('pending');
    const [pendingRequests, setPendingRequests] = useState<UserRequest[]>([]);
    const [sentRequests, setSentRequests] = useState<UserRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);


    const fetchRequests = useCallback(async () => {
        if (!currentUser) return;

        try {
            setLoading(true);

            // Fetch pending requests (requests received)
            const pendingIds = await getPendingFollowRequests.execute(currentUser.id);
            const pendingUsers = await Promise.all(
                pendingIds.map(async (userId) => {
                    try {
                        const user = await findUserById.execute({ id: userId });
                        return { userId, user };
                    } catch (error) {
                        console.error(`Error fetching user ${userId}:`, error);
                        return { userId, user: null };
                    }
                })
            );
            setPendingRequests(pendingUsers);

            // Fetch sent requests
            const sentIds = await getSentFollowRequests.execute(currentUser.id);
            const sentUsers = await Promise.all(
                sentIds.map(async (userId) => {
                    try {
                        const user = await findUserById.execute({ id: userId });
                        return { userId, user };
                    } catch (error) {
                        console.error(`Error fetching user ${userId}:`, error);
                        return { userId, user: null };
                    }
                })
            );
            setSentRequests(sentUsers);
        } catch (error) {
            console.error("Error fetching follow requests:", error);
        } finally {
            setLoading(false);
        }
    }, [currentUser]);

    useEffect(() => {
        fetchRequests();
    }, [fetchRequests]);

    const handleAccept = async (requesterId: string) => {
        if (!currentUser) return;

        setActionLoading(requesterId);
        try {
            await acceptFollowRequest.execute(currentUser.id, requesterId);
            setPendingRequests(prev => prev.filter(req => req.userId !== requesterId));
            await refreshPendingCount(); // Update badge count
        } catch (error) {
            console.error("Error accepting request:", error);
            alert("Erro ao aceitar solicitação");
        } finally {
            setActionLoading(null);
        }
    };

    const handleReject = async (requesterId: string) => {
        if (!currentUser) return;

        setActionLoading(requesterId);
        try {
            await rejectFollowRequest.execute(currentUser.id, requesterId);
            setPendingRequests(prev => prev.filter(req => req.userId !== requesterId));
            await refreshPendingCount(); // Update badge count
        } catch (error) {
            console.error("Error rejecting request:", error);
            alert("Erro ao rejeitar solicitação");
        } finally {
            setActionLoading(null);
        }
    };

    const renderUserCard = ({ item }: { item: UserRequest }) => {
        if (!item.user) return null;

        const isActionLoading = actionLoading === item.userId;

        return (
            <View style={styles.userCard}>
                <TouchableOpacity
                    style={styles.userInfo}
                    onPress={() => navigation.navigate('PublicProfile', { userId: item.userId })}
                >
                    <Image
                        source={item.user.imgUrl ? { uri: item.user.imgUrl } : { uri: 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y' }}
                        style={styles.avatar}
                    />
                    <View style={styles.userDetails}>
                        <Text style={styles.userName}>{item.user.name.value}</Text>
                        <Text style={styles.userUsername}>@{item.user.username.value}</Text>
                    </View>
                </TouchableOpacity>

                {activeTab === 'pending' && (
                    <View style={styles.actionButtons}>
                        <TouchableOpacity
                            style={[styles.acceptButton, isActionLoading && styles.disabledButton]}
                            onPress={() => handleAccept(item.userId)}
                            disabled={isActionLoading}
                        >
                            {isActionLoading ? (
                                <ActivityIndicator size="small" color="#fff" />
                            ) : (
                                <MaterialIcons name="check" size={20} color="#fff" />
                            )}
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.rejectButton, isActionLoading && styles.disabledButton]}
                            onPress={() => handleReject(item.userId)}
                            disabled={isActionLoading}
                        >
                            <MaterialIcons name="close" size={20} color="#fff" />
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        );
    };

    const renderEmptyState = () => (
        <View style={styles.emptyState}>
            <MaterialIcons
                name={activeTab === 'pending' ? 'person-add' : 'send'}
                size={64}
                color="#ccc"
            />
            <Text style={styles.emptyStateText}>
                {activeTab === 'pending'
                    ? 'Nenhuma solicitação pendente'
                    : 'Nenhuma solicitação enviada'}
            </Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <MaterialIcons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Solicitações</Text>
                <View style={{ width: 24 }} />
            </View>

            <View style={styles.tabContainer}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'pending' && styles.activeTab]}
                    onPress={() => setActiveTab('pending')}
                >
                    <Text style={[styles.tabText, activeTab === 'pending' && styles.activeTabText]}>
                        Pendentes ({pendingRequests.length})
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'sent' && styles.activeTab]}
                    onPress={() => setActiveTab('sent')}
                >
                    <Text style={[styles.tabText, activeTab === 'sent' && styles.activeTabText]}>
                        Enviadas ({sentRequests.length})
                    </Text>
                </TouchableOpacity>
            </View>

            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#c00" />
                </View>
            ) : (
                <FlatList
                    data={activeTab === 'pending' ? pendingRequests : sentRequests}
                    keyExtractor={(item) => item.userId}
                    renderItem={renderUserCard}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={renderEmptyState}
                />
            )}
        </SafeAreaView>
    );
}
