import { View, Text } from 'react-native';
import { Appbar } from 'react-native-paper';
import { useAuth } from '../context/auth';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { MainStackParamList } from '../navigations/MainStackNavigation';
import ColorTheme from '../styles/colors';

type CustomHeaderProps = {
  route: RouteProp<MainStackParamList, keyof MainStackParamList>;
  options: NativeStackNavigationOptions;
};


export function CustomHeader({ route, options }: any){
    const {logout} = useAuth();

    return (
        <Appbar.Header style={{backgroundColor: ColorTheme.background}}>
            <Appbar.Content title={
                <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                    <FontAwesome5 name="map-marker-alt" size={20} color={ColorTheme.primary} />
                    <Text style={{alignSelf: 'center', color: ColorTheme.primary, fontWeight: '900'}}>Lit.</Text>
                </View>
            } />
        </Appbar.Header>
    )
}