import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface BadgeProps {
    count: number;
    size?: number;
}

export function Badge({ count, size = 16 }: BadgeProps) {
    if (count === 0) return null;

    return (
        <View style={[styles.badge, { width: size, height: size, borderRadius: size / 2 }]}>
            <Text style={[styles.badgeText, { fontSize: size * 0.6 }]}>
                {count > 9 ? '9+' : count}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    badge: {
        position: 'absolute',
        top: -4,
        right: -4,
        backgroundColor: '#f44336',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#fff',
    },
    badgeText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});
