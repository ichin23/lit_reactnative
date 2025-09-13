import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useAuth } from "../../context/auth";
import { styles } from "./styles";

const history = [
    {
        id: "1",
        place: "Forró do André",
        date: "30 de agosto de 2025",
        image: "https://images.unsplash.com/photo-1464983953574-0892a716854b",
    },
    {
        id: "2",
        place: "Villas Beer",
        date: "29 de agosto de 2025",
        image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
    },
    {
        id: "3",
        place: "Calourada Muquirana",
        date: "12 de agosto de 2025",
        image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca",
    },
];

export function PerfilScreen() {
    const { logout } = useAuth();

    return (
        <View style={styles.container}>
            <View style={styles.avatarContainer}>
                <View style={styles.avatar} />
                <Text style={styles.name}>João Malagueta</Text>
                <Text style={styles.places}>67 locais</Text>
            </View>
            <Text style={styles.historyTitle}>Histórico</Text>
            <FlatList
                data={history}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <View style={styles.historyItem}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.historyName}>João Malagueta</Text>
                            <Text style={styles.historyPlace}>Visitou {item.place}</Text>
                            <Text style={styles.historyDate}>Em {item.date}</Text>
                        </View>
                        <Image source={{ uri: item.image }} style={styles.historyImage} />
                    </View>
                )}
                style={{ marginTop: 12 }}
            />
        </View>
    );
}