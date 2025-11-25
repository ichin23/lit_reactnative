import { NavigationContainer } from '@react-navigation/native'
import { LoginStackNavigations } from './LoginStackNavigations'
import { use } from 'react';
import { MainStackNavigation } from './MainStackNavigation';
import { useAuth } from '../context/auth';
import { ActivityIndicator, View } from 'react-native';
import ColorTheme from '../styles/colors';

export function Navigation() {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', backgroundColor: ColorTheme.background, alignItems: 'center' }}>
                <ActivityIndicator size="large" color={ColorTheme.primary} />
            </View>
        );
    }

    return (
        <NavigationContainer>
            {user ? <MainStackNavigation /> : <LoginStackNavigations />}
        </NavigationContainer>
    )
}