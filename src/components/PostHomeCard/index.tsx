import { View, Image, Text, StyleSheet, TouchableOpacity } from "react-native";
import { IPost } from "../../services/data";
import { MaterialIcons } from '@expo/vector-icons';
import { styles } from "./styles";

export function PostHomeCard({ post }: { post: IPost }) {
    return (
        <View style={styles.card}>
            <Image source={{ uri: post.pic }} style={styles.image} />
            <View style={styles.overlay}>
                <Text style={styles.userName}>{post.username}</Text>
                <Text style={styles.timeAgo}>{post.datetime}</Text>
            </View>
            <View style={styles.bottomRow}>
                <View style={styles.locationRow}>
                    <MaterialIcons name="location-on" size={18} color="#c00" />
                    <Text style={styles.location}>{post.location}</Text>
                </View>
                <TouchableOpacity style={styles.button}>
                    <MaterialIcons name="group" size={18} color="#1976d2" />
                    <Text style={styles.buttonText}>{post.going} Partiu!</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}