import { View, Text } from 'react-native';
import { Appbar } from 'react-native-paper';
import { useAuth } from '../../context/auth';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { HomeTypes, MainStackParamList } from '../../navigations/MainStackNavigation';
import ColorTheme from '../../styles/colors';
import { Ionicons } from '@expo/vector-icons';
import { useFollowRequest } from '../../context/followRequest';
import { Badge } from '../Badge';

type CustomHeaderProps = {
    route: RouteProp<MainStackParamList, keyof MainStackParamList>;
    options: NativeStackNavigationOptions;
};


export function CustomHeader({ route, options, navigation }: any) {
    const { pendingCount } = useFollowRequest();

    return (
        <Appbar.Header style={{ backgroundColor: ColorTheme.background }}>
            {route.name === 'Perfil' && (
                <Appbar.Action
                    icon={() => (
                        <View>
                            <FontAwesome5 name="user-friends" size={20} color={ColorTheme.primary} />
                            <Badge count={pendingCount} size={14} />
                        </View>
                    )}
                    onPress={() => navigation.navigate('FollowRequests')}
                />
            )}
            <Appbar.Content
                title={
                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                        <FontAwesome5 name="map-marker-alt" size={20} color={ColorTheme.primary} />
                        <Text style={{ alignSelf: 'center', color: ColorTheme.primary, fontWeight: '900' }}>Lit.</Text>
                    </View>
                }
            />
            {route.name === 'Perfil' && (
                <Appbar.Action
                    icon={() => <Ionicons name="settings-sharp" size={20} color={ColorTheme.primary} />}
                    onPress={() => navigation.navigate('EditProfile')}
                />
            )}
        </Appbar.Header>
    )
}