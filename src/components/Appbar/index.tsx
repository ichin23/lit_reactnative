import { View, Text } from 'react-native';
import { Appbar } from 'react-native-paper';
import { useAuth } from '../../context/auth';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { HomeTypes, MainStackParamList } from '../../navigations/MainStackNavigation';
import ColorTheme from '../../styles/colors';
import { Ionicons } from '@expo/vector-icons';

type CustomHeaderProps = {
    route: RouteProp<MainStackParamList, keyof MainStackParamList>;
    options: NativeStackNavigationOptions;
};


export function CustomHeader({ route, options, navigation }: any) {

    return (
        <Appbar.Header style={{ backgroundColor: ColorTheme.background }}>
            <Appbar.Content title={
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                    <FontAwesome5 name="map-marker-alt" size={20} color={ColorTheme.primary} />
                    <Text style={{ alignSelf: 'center', color: ColorTheme.primary, fontWeight: '900' }}>Lit.</Text>
                    {route.name === 'Perfil' && <Ionicons name="settings-sharp" size={24} color={ColorTheme.primary} style={{ position: 'absolute', right: 10 }} onPress={() => navigation.navigate('EditProfile')} />}
                </View>
            }  />
        </Appbar.Header>
    )
}